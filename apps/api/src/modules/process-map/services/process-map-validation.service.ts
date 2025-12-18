import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ValidationStatus, ProcessStatus } from '@prisma/client';
import { CreateValidationRequestDto } from '../../process/dto/create-validation-request.dto';
import { ApproveValidationDto } from '../../process/dto/approve-validation.dto';
import { RejectValidationDto } from '../../process/dto/reject-validation.dto';

@Injectable()
export class ProcessMapValidationService {
  private readonly logger = new Logger(ProcessMapValidationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Request validation for a ProcessMap from multiple validators
   */
  async requestValidation(
    processMapId: string,
    validatorIds: string[],
    requestedById: string,
  ) {
    if (!requestedById) {
      throw new BadRequestException('User authentication required to request validation');
    }

    const processMap = await this.prisma.processMap.findUnique({
      where: { id: processMapId },
      include: { createdBy: true },
    });

    if (!processMap) {
      throw new NotFoundException(`ProcessMap with ID ${processMapId} not found`);
    }

    // Only the creator can request validation for a DRAFT ProcessMap
    const isCreator = processMap.createdById === requestedById;

    if (!isCreator) {
      // throw new ForbiddenException(
      //   'Only the creator can request validation for this ProcessMap',
      // );
    }

    if (processMap.status !== ProcessStatus.DRAFT) {
      throw new BadRequestException(
        `Validation can only be requested for ProcessMaps in DRAFT status. Current status: ${processMap.status}`,
      );
    }

    const validators = await this.prisma.user.findMany({
      where: {
        id: { in: validatorIds },
        isActive: true,
      },
    });

    if (validators.length !== validatorIds.length) {
      throw new BadRequestException('One or more validators not found or inactive');
    }

    const validationRequests = await Promise.all(
      validatorIds.map((validatorId) =>
        this.prisma.processMapValidationRequest.upsert({
          where: {
            processMapId_validatorId: {
              processMapId,
              validatorId,
            },
          },
          create: {
            processMapId,
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

    // Update ProcessMap status to IN_REVIEW
    await this.prisma.processMap.update({
      where: { id: processMapId },
      data: { status: ProcessStatus.IN_REVIEW },
    });

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
    const validationRequest = await this.prisma.processMapValidationRequest.findUnique({
      where: { id: requestId },
      include: { processMap: true },
    });

    if (!validationRequest) {
      throw new NotFoundException(`Validation request with ID ${requestId} not found`);
    }

    if (validationRequest.validatorId !== validatorId) {
      throw new ForbiddenException('You are not authorized to approve this request');
    }

    if (validationRequest.status !== ValidationStatus.PENDING) {
      throw new BadRequestException(
        `Validation request is already ${validationRequest.status}`,
      );
    }

    const updatedRequest = await this.prisma.processMapValidationRequest.update({
      where: { id: requestId },
      data: {
        status: ValidationStatus.APPROVED,
        comment: approveDto.comment,
        validatedAt: new Date(),
      },
    });

    await this.checkIfProcessMapValidated(validationRequest.processMapId);

    return updatedRequest;
  }

  /**
   * Reject a validation request
   */
  async rejectValidation(
    requestId: string,
    validatorId: string,
    rejectDto: RejectValidationDto,
  ) {
    const validationRequest = await this.prisma.processMapValidationRequest.findUnique({
      where: { id: requestId },
      include: { processMap: true },
    });

    if (!validationRequest) {
      throw new NotFoundException(`Validation request with ID ${requestId} not found`);
    }

    if (validationRequest.validatorId !== validatorId) {
      throw new ForbiddenException('You are not authorized to reject this request');
    }

    if (validationRequest.status !== ValidationStatus.PENDING) {
      throw new BadRequestException(
        `Validation request is already ${validationRequest.status}`,
      );
    }

    const updatedRequest = await this.prisma.processMapValidationRequest.update({
      where: { id: requestId },
      data: {
        status: ValidationStatus.REJECTED,
        comment: rejectDto.comment,
        validatedAt: new Date(),
      },
    });

    // If a request is rejected, the ProcessMap status should revert to DRAFT or stay IN_REVIEW
    if (validationRequest.processMap.status === ProcessStatus.IN_REVIEW) {
      await this.prisma.processMap.update({
        where: { id: validationRequest.processMapId },
        data: { status: ProcessStatus.DRAFT },
      });
    }

    return updatedRequest;
  }

  /**
   * Get all validation requests for a ProcessMap
   */
  async getValidationRequests(processMapId: string) {
    const processMap = await this.prisma.processMap.findUnique({
      where: { id: processMapId },
    });

    if (!processMap) {
      throw new NotFoundException(`ProcessMap with ID ${processMapId} not found`);
    }

    return this.prisma.processMapValidationRequest.findMany({
      where: { processMapId },
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
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Get pending validation requests for a user
   */
  async getPendingValidationsForUser(userId: string) {
    return this.prisma.processMapValidationRequest.findMany({
      where: {
        validatorId: userId,
        status: ValidationStatus.PENDING,
      },
      include: {
        processMap: {
          select: {
            id: true,
            title: true,
            code: true,
            status: true,
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
      orderBy: { createdAt: 'asc' },
    });
  }

  /**
   * Check if all validators have approved and update ProcessMap status
   */
  private async checkIfProcessMapValidated(processMapId: string) {
    const pendingRequests = await this.prisma.processMapValidationRequest.count({
      where: {
        processMapId,
        status: ValidationStatus.PENDING,
      },
    });

    if (pendingRequests === 0) {
      // All requests are either APPROVED or REJECTED.
      // Check if any were rejected.
      const rejectedRequests = await this.prisma.processMapValidationRequest.count({
        where: {
          processMapId,
          status: ValidationStatus.REJECTED,
        },
      });

      if (rejectedRequests === 0) {
        // All requests were approved, update ProcessMap status to VALIDATED
        await this.prisma.processMap.update({
          where: { id: processMapId },
          data: { status: ProcessStatus.VALIDATED },
        });
      } else {
        // Some requests were rejected, ProcessMap status should be DRAFT (handled in rejectValidation)
        this.logger.warn(
          `ProcessMap ${processMapId} has rejected validation requests. Status remains DRAFT.`,
        );
      }
    }
  }
}

