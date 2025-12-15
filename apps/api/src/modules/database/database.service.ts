import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../database/prisma.service';
import * as bcrypt from 'bcrypt';

@Injectable()
export class DatabaseService {
  private readonly logger = new Logger(DatabaseService.name);

  constructor(private readonly prisma: PrismaService) {}

  /**
   * Check if database is empty
   */
  async isDatabaseEmpty(): Promise<boolean> {
    const userCount = await this.prisma.user.count();
    const groupCount = await this.prisma.group.count();
    const workspaceCount = await this.prisma.workspace.count();

    return userCount === 0 && groupCount === 0 && workspaceCount === 0;
  }

  /**
   * Seed database with initial data
   * Only runs if database is empty
   */
  async seedDatabase(): Promise<{
    success: boolean;
    message: string;
    data?: any;
  }> {
    try {
      const isEmpty = await this.isDatabaseEmpty();

      if (!isEmpty) {
        return {
          success: false,
          message: 'Database is not empty. Seeding skipped to prevent data loss.',
        };
      }

      this.logger.log('🌱 Starting database seeding...');

      const defaultPassword = 'Orange123!';
      const hashedPassword = await bcrypt.hash(defaultPassword, 10);

      // ====================================
      // SEED GROUPS
      // ====================================
      this.logger.log('🏢 Seeding groups...');

      const groups = await Promise.all([
        this.prisma.group.create({
          data: {
            name: 'Groupe RH',
            code: 'RH',
            description:
              'Ressources Humaines - Gestion du personnel et recrutement',
            color: '#EA580C',
          },
        }),
        this.prisma.group.create({
          data: {
            name: 'Groupe Commercial',
            code: 'COM',
            description: 'Service Commercial - Vente et relation client',
            color: '#2563EB',
          },
        }),
        this.prisma.group.create({
          data: {
            name: 'Groupe IT',
            code: 'IT',
            description:
              'Technologies de l\'Information - Infrastructure et développement',
            color: '#16A34A',
          },
        }),
        this.prisma.group.create({
          data: {
            name: 'Groupe Finance',
            code: 'FIN',
            description: 'Finance et Comptabilité - Gestion financière',
            color: '#DC2626',
          },
        }),
        this.prisma.group.create({
          data: {
            name: 'Groupe Production',
            code: 'PROD',
            description: 'Production - Fabrication et opérations',
            color: '#9333EA',
          },
        }),
      ]);

      // ====================================
      // SEED UNITS
      // ====================================
      this.logger.log('🏗️ Seeding units...');

      const units = await Promise.all([
        this.prisma.unit.create({
          data: {
            name: 'Direction Générale',
          },
        }),
        this.prisma.unit.create({
          data: {
            name: 'Ressources Humaines',
          },
        }),
        this.prisma.unit.create({
          data: {
            name: 'Commercial',
          },
        }),
        this.prisma.unit.create({
          data: {
            name: 'IT',
          },
        }),
        this.prisma.unit.create({
          data: {
            name: 'Finance',
          },
        }),
      ]);

      // ====================================
      // SEED USERS
      // ====================================
      this.logger.log('👥 Seeding users...');

      const adminUser = await this.prisma.user.create({
        data: {
          email: 'admin@orange-processes.com',
          hashedPassword: hashedPassword,
          firstName: 'Admin',
          lastName: 'Orange',
          isActive: true,
          isAdmin: true,
        },
      });

      const users = await Promise.all([
        this.prisma.user.create({
          data: {
            email: 'jean.dupont@orange.com',
            hashedPassword: hashedPassword,
            firstName: 'Jean',
            lastName: 'Dupont',
            isActive: true,
            isAdmin: false,
          },
        }),
        this.prisma.user.create({
          data: {
            email: 'marie.martin@orange.com',
            hashedPassword: hashedPassword,
            firstName: 'Marie',
            lastName: 'Martin',
            isActive: true,
            isAdmin: false,
          },
        }),
        this.prisma.user.create({
          data: {
            email: 'pierre.durand@orange.com',
            hashedPassword: hashedPassword,
            firstName: 'Pierre',
            lastName: 'Durand',
            isActive: true,
            isAdmin: false,
          },
        }),
      ]);

      // Note: Role in this schema is not linked to users directly
      // It's used for process assignments and node ownership
      this.logger.log('🎭 Roles will be created based on process assignments');

      // ====================================
      // SEED WORKSPACES
      // ====================================
      this.logger.log('🗂️ Seeding workspaces...');

      const workspaces = await Promise.all([
        this.prisma.workspace.create({
          data: {
            name: 'Espace RH',
            description: 'Gestion des processus RH',
            code: 'RH',
            type: 'DEPARTMENT',
            isActive: true,
            workspaceMembers: {
              create: [
                {
                  userId: users[0].id,
                  role: 'EDITOR',
                },
              ],
            },
          },
        }),
        this.prisma.workspace.create({
          data: {
            name: 'Espace Commercial',
            description: 'Gestion des processus commerciaux',
            code: 'COM',
            type: 'DEPARTMENT',
            isActive: true,
            workspaceMembers: {
              create: [
                {
                  userId: users[1].id,
                  role: 'EDITOR',
                },
              ],
            },
          },
        }),
        this.prisma.workspace.create({
          data: {
            name: 'Espace IT',
            description: 'Gestion des processus informatiques',
            code: 'IT',
            type: 'DEPARTMENT',
            isActive: true,
            workspaceMembers: {
              create: [
                {
                  userId: users[2].id,
                  role: 'VIEWER',
                },
              ],
            },
          },
        }),
      ]);

      // ====================================
      // SEED PROCESS MAPS
      // ====================================
      this.logger.log('🗺️ Seeding process maps...');

      const processMap = await this.prisma.processMap.create({
        data: {
          code: 'PM-RH-001',
          title: 'Cartographie des Processus RH',
          description: 'Vue d\'ensemble des processus de gestion des ressources humaines',
          status: 'PUBLISHED',
          workspaceId: workspaces[0].id,
          createdById: adminUser.id,
        },
      });

      // ====================================
      // SEED PROCESSES (Level 2)
      // ====================================
      this.logger.log('⚙️ Seeding processes...');

      const process1 = await this.prisma.process.create({
        data: {
          code: 'PROC-REC-001',
          title: 'Recrutement',
          description: 'Processus de recrutement de nouveaux collaborateurs',
          status: 'PUBLISHED',
          type: 'FLOW',
          processMapId: processMap.id,
          workspaceId: workspaces[0].id,
          createdById: adminUser.id,
          owners: {
            connect: [{ id: adminUser.id }],
          },
        },
      });

      const process2 = await this.prisma.process.create({
        data: {
          code: 'PROC-ON-001',
          title: 'Onboarding',
          description: 'Processus d\'intégration des nouveaux employés',
          status: 'DRAFT',
          type: 'SIPOC',
          processMapId: processMap.id,
          workspaceId: workspaces[0].id,
          createdById: adminUser.id,
          owners: {
            connect: [{ id: adminUser.id }],
          },
        },
      });

      this.logger.log('✅ Database seeding completed successfully!');
      this.logger.log(`📊 Summary:
        - Groups: ${groups.length}
        - Units: ${units.length}
        - Users: ${users.length + 1} (including admin)
        - Workspaces: ${workspaces.length}
        - Process Maps: 1
        - Processes: 2
      `);

      return {
        success: true,
        message: 'Database seeded successfully',
        data: {
          groups: groups.length,
          units: units.length,
          users: users.length + 1,
          workspaces: workspaces.length,
          processMaps: 1,
          processes: 2,
          credentials: {
            admin: {
              email: 'admin@orange-processes.com',
              password: defaultPassword,
            },
          },
        },
      };
    } catch (error) {
      this.logger.error('❌ Error seeding database:', error);
      throw error;
    }
  }
}
