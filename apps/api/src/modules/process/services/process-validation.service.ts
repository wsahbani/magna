import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ValidationStatus, ProcessStatus } from '@prisma/client';
import { CreateValidationRequestDto } from '../dto/create-validation-request.dto';
import { ApproveValidationDto } from '../dto/approve-validation.dto';
import { RejectValidationDto } from '../dto/reject-validation.dto';

@Injectable()
export class ProcessValidationService {
  private readonly logger = new Logger(ProcessValidationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Request validation for a process from multiple validators
   */
  async requestValidation(
    processId: string,
    validatorIds: string[],
    requestedById: string,
  ) {
    // Validate requestedById
    if (!requestedById) {
      throw new BadRequestException('User ID is required to request validation');
    }

    // Check if process exists
    const process = await this.prisma.process.findUnique({
      where: { id: processId },
    });

    if (!process) {
      throw new NotFoundException(`Process with ID ${processId} not found`);
    }

    // Check if user is the creator or owner
    if (process.createdById !== requestedById) {
      const isOwner = await this.prisma.process.findFirst({
        where: {
          id: processId,
          owners: {
            some: { id: requestedById },
          },
        },
      });

      if (!isOwner) {
        // throw new BadRequestException(
        //   'Only the creator or owner can request validation',
        // );
      }
    }

    // Check if process is in DRAFT status
    if (process.status !== ProcessStatus.DRAFT) {
      throw new BadRequestException(
        'Only processes in DRAFT status can be sent for validation',
      );
    }

    // Verify all validators exist
    const validators = await this.prisma.user.findMany({
      where: {
        id: { in: validatorIds },
        isActive: true,
      },
    });

    if (validators.length !== validatorIds.length) {
      throw new BadRequestException('One or more validators not found');
    }

    // Create validation requests
    const validationRequests = await Promise.all(
      validatorIds.map((validatorId) =>
        this.prisma.processValidationRequest.upsert({
          where: {
            processId_validatorId: {
              processId,
              validatorId,
            },
          },
          create: {
            processId,
            requestedById,
            validatorId,
            status: ValidationStatus.PENDING,
          },
          update: {
            status: ValidationStatus.PENDING,
            comment: null,
            validatedAt: null,
            updatedAt: new Date(),
          },
        }),
      ),
    );

    this.logger.log(
      `Validation requested for process ${processId} by ${requestedById} to ${validatorIds.length} validators`,
    );

    return validationRequests;
  }

  /**
   * Approve a validation request
   */
  async approveValidation(
    requestId: string,
    validatorId: string,
    approveDto: ApproveValidationDto,
  ) {
    const validationRequest = await this.prisma.processValidationRequest.findUnique({
      where: { id: requestId },
      include: { process: true },
    });

    if (!validationRequest) {
      throw new NotFoundException(
        `Validation request with ID ${requestId} not found`,
      );
    }

    if (validationRequest.validatorId !== validatorId) {
      throw new BadRequestException(
        'You can only approve your own validation requests',
      );
    }

    if (validationRequest.status !== ValidationStatus.PENDING) {
      throw new BadRequestException(
        'Only pending validation requests can be approved',
      );
    }

    // Update validation request
    const updated = await this.prisma.processValidationRequest.update({
      where: { id: requestId },
      data: {
        status: ValidationStatus.APPROVED,
        comment: approveDto.comment,
        validatedAt: new Date(),
      },
    });

    // Check if all validators have approved
    await this.checkIfProcessValidated(validationRequest.processId);

    this.logger.log(
      `Validation request ${requestId} approved by validator ${validatorId}`,
    );

    return updated;
  }

  /**
   * Reject a validation request
   */
  async rejectValidation(
    requestId: string,
    validatorId: string,
    rejectDto: RejectValidationDto,
  ) {
    const validationRequest = await this.prisma.processValidationRequest.findUnique({
      where: { id: requestId },
    });

    if (!validationRequest) {
      throw new NotFoundException(
        `Validation request with ID ${requestId} not found`,
      );
    }

    if (validationRequest.validatorId !== validatorId) {
      throw new BadRequestException(
        'You can only reject your own validation requests',
      );
    }

    if (validationRequest.status !== ValidationStatus.PENDING) {
      throw new BadRequestException(
        'Only pending validation requests can be rejected',
      );
    }

    const updated = await this.prisma.processValidationRequest.update({
      where: { id: requestId },
      data: {
        status: ValidationStatus.REJECTED,
        comment: rejectDto.comment,
        validatedAt: new Date(),
      },
    });

    this.logger.log(
      `Validation request ${requestId} rejected by validator ${validatorId}`,
    );

    return updated;
  }

  /**
   * Get all validation requests for a process
   */
  async getValidationRequests(processId: string) {
    const process = await this.prisma.process.findUnique({
      where: { id: processId },
    });

    if (!process) {
      throw new NotFoundException(`Process with ID ${processId} not found`);
    }

    return this.prisma.processValidationRequest.findMany({
      where: { processId },
      include: {
        requestedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        validator: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Get pending validation requests for a user
   */
  async getPendingValidationsForUser(validatorId: string) {
    return this.prisma.processValidationRequest.findMany({
      where: {
        validatorId,
        status: ValidationStatus.PENDING,
      },
      include: {
        process: {
          select: {
            id: true,
            title: true,
            code: true,
            status: true,
            createdBy: {
              select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
              },
            },
          },
        },
        requestedBy: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Check if all validators have approved and update process status
   */
  private async checkIfProcessValidated(processId: string) {
    const validationRequests = await this.prisma.processValidationRequest.findMany({
      where: { processId },
    });

    // Check if all requests are approved
    const allApproved = validationRequests.every(
      (req) => req.status === ValidationStatus.APPROVED,
    );

    // Check if any request is rejected
    const hasRejected = validationRequests.some(
      (req) => req.status === ValidationStatus.REJECTED,
    );

    if (allApproved && validationRequests.length > 0) {
      // All validators approved - update process status to VALIDATED
      await this.prisma.process.update({
        where: { id: processId },
        data: {
          status: ProcessStatus.VALIDATED,
          approvalDate: new Date(),
        },
      });

      this.logger.log(`Process ${processId} validated by all validators`);
    } else if (hasRejected) {
      // At least one rejection - keep process in DRAFT or IN_REVIEW
      // Don't change status automatically on rejection
      this.logger.log(
        `Process ${processId} has rejected validations, keeping current status`,
      );
    }
  }
}

