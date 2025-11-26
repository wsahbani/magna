import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seeding...');
  const defaultPassword = 'Orange123!';
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  console.log('🧹 Clearing existing data...');
  const tablesToTruncate = [
    'workspace_members',
    'process_versions',
    'nodes',
    'edges',
    'node_templates',
    'process_themes',
    'processes',
    'departments',
    'workspaces',
    'roles',
    'units',
    'users',
  ];

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tablesToTruncate.map((table) => `"${table}"`).join(', ')} RESTART IDENTITY CASCADE;`,
  );

  // Create Orange Group workspaces
  const orangeGroup = await prisma.workspace.create({
    data: {
      name: 'Orange Group',
      code: 'OG',
      type: 'GROUPE',
      description: 'Orange Group - Global telecommunications company',
    },
  });

  const orangeTunisie = await prisma.workspace.create({
    data: {
      name: 'Orange Tunisie',
      code: 'OTN',
      type: 'ENTITY',
      description: 'Orange Tunisie telecommunications services',
      parentId: orangeGroup.id,
    },
  });

  const orangeBS = await prisma.workspace.create({
    data: {
      name: 'Orange Business Services',
      code: 'OBS',
      type: 'ENTITY',
      description: 'Orange Business Services for enterprise solutions',
      parentId: orangeGroup.id,
    },
  });

  // Create departments
  const itDepartment = await prisma.department.create({
    data: {
      name: 'Information Technology',
      code: 'IT',
      description: 'IT Department responsible for technology infrastructure',
      workspaceId: orangeTunisie.id,
    },
  });

  const hrDepartment = await prisma.department.create({
    data: {
      name: 'Human Resources',
      code: 'HR',
      description: 'HR Department for people management',
      workspaceId: orangeTunisie.id,
    },
  });

  // Create roles
  const internalRole = await prisma.role.create({
    data: {
      name: 'Internal Staff',
      type: 'INTERNE',
      color: '#007bff',
      description: 'Internal Orange employees',
    },
  });

  const externalRole = await prisma.role.create({
    data: {
      name: 'External Consultant',
      type: 'EXTERNE',
      color: '#6c757d',
      description: 'External consultants and contractors',
    },
  });

  // Create units
  const devUnit = await prisma.unit.create({
    data: {
      name: 'Development Team',
    },
  });

  const opsUnit = await prisma.unit.create({
    data: {
      name: 'Operations Team',
    },
  });

  // Create users with new model structure
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice.johnson@orange.com',
        firstName: 'Alice',
        lastName: 'Johnson',
        displayName: 'Alice J.',
        position: 'Process Manager',
        departmentId: itDepartment.id,
        isActive: true,
        emailVerified: true,
        hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob.smith@orange.com',
        firstName: 'Bob',
        lastName: 'Smith',
        position: 'IT Director',
        departmentId: itDepartment.id,
        isActive: true,
        emailVerified: true,
        hashedPassword,
      },
    }),
    prisma.user.create({
      data: {
        email: 'charlie.brown@orange.com',
        firstName: 'Charlie',
        lastName: 'Brown',
        position: 'HR Manager',
        departmentId: hrDepartment.id,
        isActive: true,
        emailVerified: true,
        hashedPassword,
      },
    }),
  ]);

  // Create workspace members
  await Promise.all([
    prisma.workspaceMember.create({
      data: {
        userId: users[0].id,
        workspaceId: orangeTunisie.id,
        role: 'ADMIN',
      },
    }),
    prisma.workspaceMember.create({
      data: {
        userId: users[1].id,
        workspaceId: orangeTunisie.id,
        role: 'OWNER',
      },
    }),
    prisma.workspaceMember.create({
      data: {
        userId: users[2].id,
        workspaceId: orangeTunisie.id,
        role: 'EDITOR',
      },
    }),
  ]);

  // Create sample processes with workspace
  const mainProcess = await prisma.process.create({
    data: {
      name: 'Customer Onboarding Process',
      description: 'Complete process for onboarding new customers',
      type: 'FLOW',
      level: 1,
      workspaceId: orangeTunisie.id,
      departmentId: itDepartment.id,
      createdById: users[0].id,
      status: 'PUBLISHED',
      authorName: 'Alice Johnson',
      publishedAt: new Date(),
    },
  });

  const subProcess1 = await prisma.process.create({
    data: {
      name: 'Customer Data Collection',
      description: 'Collect and validate customer information',
      type: 'SIPOC',
      level: 2,
      parentId: mainProcess.id,
      workspaceId: orangeTunisie.id,
      departmentId: itDepartment.id,
      createdById: users[1].id,
      status: 'PUBLISHED',
      authorName: 'Bob Smith',
      publishedAt: new Date(),
    },
  });

  const subProcess2 = await prisma.process.create({
    data: {
      name: 'Account Setup Procedure',
      description: 'Set up customer account in system',
      type: 'SIPOC',
      level: 2,
      parentId: mainProcess.id,
      workspaceId: orangeTunisie.id,
      departmentId: itDepartment.id,
      createdById: users[1].id,
      status: 'APPROVED',
      authorName: 'Bob Smith',
    },
  });

  const instruction = await prisma.process.create({
    data: {
      name: 'Validate Customer ID Documents',
      description: 'Step-by-step validation of customer identification',
      type: 'BPMN',
      level: 3,
      parentId: subProcess1.id,
      workspaceId: orangeTunisie.id,
      departmentId: itDepartment.id,
      createdById: users[2].id,
      status: 'DRAFT',
      authorName: 'Charlie Brown',
    },
  });

  // Create ReactFlow node templates
  console.log('🎨 Creating node templates...');
  const basicTaskTemplate = await prisma.nodeTemplate.create({
    data: {
      name: 'Basic Task',
      description: 'Standard process task template',
      category: 'basic',
      nodeType: 'TASK',
      defaultStyle: {
        backgroundColor: '#ffffff',
        border: '2px solid #1976d2',
        borderRadius: 6,
        padding: '10px',
        fontSize: 14,
        fontWeight: 'bold',
      },
      defaultSize: { width: 150, height: 80 },
      icon: 'task',
      workspaceId: orangeTunisie.id,
      createdBy: users[0].id,
    },
  });

  const gatewayTemplate = await prisma.nodeTemplate.create({
    data: {
      name: 'Decision Gateway',
      description: 'Decision point in process flow',
      category: 'gateways',
      nodeType: 'EXCLUSIVE_GATEWAY',
      defaultStyle: {
        backgroundColor: '#fff3e0',
        border: '3px solid #f57c00',
        borderRadius: 0,
        transform: 'rotate(45deg)',
      },
      defaultSize: { width: 60, height: 60 },
      icon: 'decision',
      workspaceId: orangeTunisie.id,
      createdBy: users[0].id,
    },
  });

  // Create process theme
  console.log('🎨 Creating process theme...');
  const orangeTheme = await prisma.processTheme.create({
    data: {
      name: 'Orange Corporate Theme',
      description: 'Official Orange Group branding theme',
      nodeStyles: {
        TASK: {
          backgroundColor: '#ffffff',
          borderColor: '#ff6900', // Orange brand color
          borderWidth: 2,
          borderRadius: 6,
          fontSize: 14,
          fontColor: '#333333',
        },
        START_EVENT: {
          backgroundColor: '#4caf50',
          borderColor: '#2e7d32',
          borderWidth: 3,
          borderRadius: '50%',
        },
        END_EVENT: {
          backgroundColor: '#f44336',
          borderColor: '#c62828',
          borderWidth: 3,
          borderRadius: '50%',
        },
      },
      edgeStyles: {
        SEQUENCE_FLOW: {
          strokeColor: '#666666',
          strokeWidth: 2,
          markerEnd: 'arrowclosed',
        },
        CONDITIONAL_FLOW: {
          strokeColor: '#ff6900',
          strokeWidth: 2,
          strokeDasharray: '5,5',
          markerEnd: 'arrowclosed',
        },
      },
      primaryColor: '#ff6900',
      secondaryColor: '#000000',
      successColor: '#4caf50',
      errorColor: '#f44336',
      warningColor: '#ff9800',
      fontFamily: "'Orange Helvetica', Arial, sans-serif",
      fontSize: {
        small: 12,
        medium: 14,
        large: 16,
        title: 20,
      },
      spacing: {
        small: 8,
        medium: 16,
        large: 24,
      },
      borderRadius: {
        small: 4,
        medium: 6,
        large: 8,
      },
      workspaceId: orangeTunisie.id,
      isDefault: true,
    },
  });

  console.log('✅ Database seeded successfully!');
  console.log(`🔐 Default password for seeded users: ${defaultPassword}`);
  console.log(`Created ${users.length} users`);
  console.log(`Created workspace: ${orangeTunisie.name}`);
  console.log(`Created process: ${mainProcess.name}`);
  console.log(`Created ${2} node templates`);
  console.log(`Created theme: ${orangeTheme.name}`);
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });