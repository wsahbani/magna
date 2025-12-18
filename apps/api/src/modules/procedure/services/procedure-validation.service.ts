import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../../../database/prisma.service';
import { ValidationStatus, ProcedureStatus } from '@prisma/client';
import { CreateValidationRequestDto } from '../../process/dto/create-validation-request.dto';
import { ApproveValidationDto } from '../../process/dto/approve-validation.dto';
import { RejectValidationDto } from '../../process/dto/reject-validation.dto';

@Injectable()
export class ProcedureValidationService {
  private readonly logger = new Logger(ProcedureValidationService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Request validation for a Procedure from multiple validators
   */
  async requestValidation(
    procedureId: string,
    validatorIds: string[],
    requestedById: string,
  ) {
    if (!requestedById) {
      throw new BadRequestException('User authentication required to request validation');
    }

    const procedure = await this.prisma.procedure.findUnique({
      where: { id: procedureId },
      include: { createdBy: true },
    });

    if (!procedure) {
      throw new NotFoundException(`Procedure with ID ${procedureId} not found`);
    }

    // Only the creator can request validation for a DRAFT Procedure
    const isCreator = procedure.createdById === requestedById;

    if (!isCreator) {
      // throw new ForbiddenException(
      //   'Only the creator can request validation for this Procedure',
      // );
    }

    if (procedure.status !== ProcedureStatus.DRAFT) {
      throw new BadRequestException(
        `Validation can only be requested for Procedures in DRAFT status. Current status: ${procedure.status}`,
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
        this.prisma.procedureValidationRequest.upsert({
          where: {
            procedureId_validatorId: {
              procedureId,
              validatorId,
            },
          },
          create: {
            procedureId,
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

    // Update Procedure status to IN_REVIEW
    await this.prisma.procedure.update({
      where: { id: procedureId },
      data: { status: ProcedureStatus.IN_REVIEW },
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
    const validationRequest = await this.prisma.procedureValidationRequest.findUnique({
      where: { id: requestId },
      include: { procedure: true },
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

    const updatedRequest = await this.prisma.procedureValidationRequest.update({
      where: { id: requestId },
      data: {
        status: ValidationStatus.APPROVED,
        comment: approveDto.comment,
        validatedAt: new Date(),
      },
    });

    await this.checkIfProcedureValidated(validationRequest.procedureId);

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
    const validationRequest = await this.prisma.procedureValidationRequest.findUnique({
      where: { id: requestId },
      include: { procedure: true },
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

    const updatedRequest = await this.prisma.procedureValidationRequest.update({
      where: { id: requestId },
      data: {
        status: ValidationStatus.REJECTED,
        comment: rejectDto.comment,
        validatedAt: new Date(),
      },
    });

    // If a request is rejected, the Procedure status should revert to DRAFT or stay IN_REVIEW
    if (validationRequest.procedure.status === ProcedureStatus.IN_REVIEW) {
      await this.prisma.procedure.update({
        where: { id: validationRequest.procedureId },
        data: { status: ProcedureStatus.DRAFT },
      });
    }

    return updatedRequest;
  }

  /**
   * Get all validation requests for a Procedure
   */
  async getValidationRequests(procedureId: string) {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id: procedureId },
    });

    if (!procedure) {
      throw new NotFoundException(`Procedure with ID ${procedureId} not found`);
    }

    return this.prisma.procedureValidationRequest.findMany({
      where: { procedureId },
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
    return this.prisma.procedureValidationRequest.findMany({
      where: {
        validatorId: userId,
        status: ValidationStatus.PENDING,
      },
      include: {
        procedure: {
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
   * Check if all validators have approved and update Procedure status
   */
  private async checkIfProcedureValidated(procedureId: string) {
    const pendingRequests = await this.prisma.procedureValidationRequest.count({
      where: {
        procedureId,
        status: ValidationStatus.PENDING,
      },
    });

    if (pendingRequests === 0) {
      // All requests are either APPROVED or REJECTED.
      // Check if any were rejected.
      const rejectedRequests = await this.prisma.procedureValidationRequest.count({
        where: {
          procedureId,
          status: ValidationStatus.REJECTED,
        },
      });

      if (rejectedRequests === 0) {
        // All requests were approved, update Procedure status to VALIDATED
        await this.prisma.procedure.update({
          where: { id: procedureId },
          data: { status: ProcedureStatus.VALIDATED },
        });
      } else {
        // Some requests were rejected, Procedure status should be DRAFT (handled in rejectValidation)
        this.logger.warn(
          `Procedure ${procedureId} has rejected validation requests. Status remains DRAFT.`,
        );
      }
    }
  }

  /**
   * Validate procedure diagram structure
   * Returns validation result with errors and warnings
   */
  async validateProcedure(procedureId: string) {
    const procedure = await this.prisma.procedure.findUnique({
      where: { id: procedureId },
      include: {
        flowDiagram: {
          include: {
            nodes: true,
            edges: true,
          },
        },
      },
    });

    if (!procedure) {
      throw new NotFoundException(`Procedure with ID ${procedureId} not found`);
    }

    const errors: Array<{
      code: string;
      message: string;
      nodeId?: string;
      edgeId?: string;
      laneId?: string;
    }> = [];
    const warnings: Array<{
      code: string;
      message: string;
      nodeId?: string;
      edgeId?: string;
    }> = [];

    const nodes = procedure.flowDiagram?.nodes || [];
    const edges = procedure.flowDiagram?.edges || [];

    // Check if there are any nodes
    if (nodes.length === 0) {
      warnings.push({
        code: 'NO_NODES',
        message: 'Le diagramme ne contient aucun nœud',
      });
    }

    // Check if there are start and end nodes
    const hasStartNode = nodes.some((node) => node.type === 'START');
    const hasEndNode = nodes.some((node) => node.type === 'END');

    if (!hasStartNode) {
      warnings.push({
        code: 'NO_START_NODE',
        message: 'Le diagramme ne contient pas de nœud de départ',
      });
    }

    if (!hasEndNode) {
      warnings.push({
        code: 'NO_END_NODE',
        message: 'Le diagramme ne contient pas de nœud de fin',
      });
    }

    // Check for orphaned nodes (nodes without connections)
    const connectedNodeIds = new Set<string>();
    edges.forEach((edge) => {
      connectedNodeIds.add(edge.sourceRfId);
      connectedNodeIds.add(edge.targetRfId);
    });

    nodes.forEach((node) => {
      if (!connectedNodeIds.has(node.rfId) && node.type !== 'START' && node.type !== 'END') {
        warnings.push({
          code: 'ORPHANED_NODE',
          message: `Le nœud "${node.label}" n'est pas connecté`,
          nodeId: node.rfId,
        });
      }
    });

    return {
      isValid: errors.length === 0,
      errors,
      warnings,
    };
  }
}
