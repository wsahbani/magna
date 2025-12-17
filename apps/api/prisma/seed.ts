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
    'flow_edges',
    'flow_nodes',
    'flow_diagrams',
    'process_maps',
    'nodes',
    'edges',
    'node_templates',
    'process_themes',
    'procedures',
    'processes',
    'departments',
    'workspaces',
    'roles',
    'units',
    'users',
    'groups',
    'group_permissions',
  ];

  await prisma.$executeRawUnsafe(
    `TRUNCATE TABLE ${tablesToTruncate.map((table) => `"${table}"`).join(', ')} RESTART IDENTITY CASCADE;`,
  );

  // ====================================
  // SEED GROUPS (Business Units)
  // ====================================
  console.log('🏢 Seeding groups...');
  
  const groups = [
    {
      name: 'Groupe RH',
      code: 'RH',
      description: 'Ressources Humaines - Gestion du personnel et recrutement',
      color: '#EA580C',
    },
    {
      name: 'Groupe Commercial',
      code: 'COM',
      description: 'Équipe Commerciale - Ventes et relations clients',
      color: '#10B981',
    },
    {
      name: 'Groupe Qualité',
      code: 'QUAL',
      description: 'Gestion Qualité - Normes et certifications',
      color: '#3B82F6',
    },
    {
      name: 'Groupe IT',
      code: 'IT',
      description: 'Informatique - Infrastructure et développement',
      color: '#8B5CF6',
    },
    {
      name: 'Groupe Finance',
      code: 'FIN',
      description: 'Finance et Comptabilité',
      color: '#F59E0B',
    },
    {
      name: 'Groupe Marketing',
      code: 'MKT',
      description: 'Marketing et Communication',
      color: '#EC4899',
    },
  ];

  const createdGroups: any = {};
  for (const group of groups) {
    const created = await prisma.group.create({
      data: group,
    });
    createdGroups[group.code] = created;
    console.log(`  ✅ Created group: ${group.name} (${group.code})`);
  }

  console.log(`✅ Created ${groups.length} groups`);

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

  // Create users with new model structure (with groups)
  const users = await Promise.all([
    prisma.user.create({
      data: {
        email: 'alice.johnson@orange.com',
        firstName: 'Alice',
        lastName: 'Johnson',
        displayName: 'Alice J.',
        position: 'Process Manager',
        departmentId: itDepartment.id,
        groupId: createdGroups.IT.id,
        provider: 'local',
        isActive: true,
        emailVerified: true,
        hashedPassword,
        isAdmin: true, // Alice is admin
      },
    }),
    prisma.user.create({
      data: {
        email: 'bob.smith@orange.com',
        firstName: 'Bob',
        lastName: 'Smith',
        position: 'IT Director',
        departmentId: itDepartment.id,
        groupId: createdGroups.IT.id,
        provider: 'local',
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
        groupId: createdGroups.RH.id,
        provider: 'local',
        isActive: true,
        emailVerified: true,
        hashedPassword,
      },
    }),
  ]);

  console.log(`✅ Created ${users.length} users with groups assigned`);

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

  // ====================================
  // SEED PROCESSMAPS (Niveau 1)
  // ====================================
  console.log('🗺️ Seeding ProcessMaps...');

  const processMap1 = await prisma.processMap.create({
    data: {
      title: 'Carte des Processus IT',
      code: 'MAP-IT-001',
      description: 'Carte des processus du département IT',
      status: 'PUBLISHED',
      workspaceId: orangeTunisie.id,
      departmentId: itDepartment.id,
      createdById: users[0].id,
      publishedAt: new Date(),
    },
  });

  // Create FlowDiagram for ProcessMap (level=1)
  await prisma.flowDiagram.create({
    data: {
      level: 1,
      processId: processMap1.id,
      processMapId: processMap1.id,
    },
  });

  const processMap2 = await prisma.processMap.create({
    data: {
      title: 'Carte des Processus RH',
      code: 'MAP-RH-001',
      description: 'Carte des processus des ressources humaines',
      status: 'PUBLISHED',
      workspaceId: orangeTunisie.id,
      departmentId: hrDepartment.id,
      createdById: users[2].id,
      publishedAt: new Date(),
    },
  });

  // Create FlowDiagram for ProcessMap (level=1)
  await prisma.flowDiagram.create({
    data: {
      level: 1,
      processId: processMap2.id,
      processMapId: processMap2.id,
    },
  });

  console.log(`  ✅ Created ${2} ProcessMaps with FlowDiagrams`);

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

  // ====================================
  // SEED QUALIGRAM DATA (ProcessMap → Process → Procedure)
  // ====================================
  console.log('📊 Seeding Qualigram data...');

  // Create Processes (Niveau 2) linked to ProcessMaps
  const process1 = await prisma.process.create({
    data: {
      code: 'PROC-RH-001',
      title: 'Recrutement et Intégration',
      description: 'Processus complet de recrutement et intégration des nouveaux collaborateurs',
      type: 'FLOW',
      processMapId: processMap2.id, // Linked to ProcessMap
      workspaceId: orangeTunisie.id,
      departmentId: hrDepartment.id,
      createdById: users[2].id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  // Create FlowDiagram for Process (level=2)
  await prisma.flowDiagram.create({
    data: {
      level: 2,
      processId: process1.id,
      processId_ref: process1.id,
    },
  });

  const process2 = await prisma.process.create({
    data: {
      code: 'PROC-RH-002',
      title: 'Gestion des Carrières',
      description: 'Processus de gestion des évolutions de carrière et formations',
      type: 'FLOW',
      processMapId: processMap2.id, // Linked to ProcessMap
      workspaceId: orangeTunisie.id,
      departmentId: hrDepartment.id,
      createdById: users[2].id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  // Create FlowDiagram for Process (level=2)
  await prisma.flowDiagram.create({
    data: {
      level: 2,
      processId: process2.id,
      processId_ref: process2.id,
    },
  });

  const process3 = await prisma.process.create({
    data: {
      code: 'PROC-IT-001',
      title: 'Gestion des Incidents IT',
      description: 'Processus de gestion et résolution des incidents informatiques',
      type: 'FLOW',
      processMapId: processMap1.id, // Linked to ProcessMap
      workspaceId: orangeTunisie.id,
      departmentId: itDepartment.id,
      createdById: users[1].id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  // Create FlowDiagram for Process (level=2)
  await prisma.flowDiagram.create({
    data: {
      level: 2,
      processId: process3.id,
      processId_ref: process3.id,
    },
  });

  const process4 = await prisma.process.create({
    data: {
      code: 'PROC-IT-002',
      title: 'Gestion des Demandes IT',
      description: 'Processus de gestion des demandes informatiques',
      type: 'FLOW',
      processMapId: processMap1.id, // Linked to ProcessMap
      workspaceId: orangeTunisie.id,
      departmentId: itDepartment.id,
      createdById: users[1].id,
      status: 'PUBLISHED',
      publishedAt: new Date(),
    },
  });

  // Create FlowDiagram for Process (level=2)
  await prisma.flowDiagram.create({
    data: {
      level: 2,
      processId: process4.id,
      processId_ref: process4.id,
    },
  });

  console.log(`  ✅ Created ${4} Processes (Niveau 2) with FlowDiagrams`);

  // Create Procedures (Niveau 3) linked to Processes
  const procedure1 = await prisma.procedure.create({
    data: {
      processId: process1.id,
      code: 'PROC-RH-001-001',
      title: 'Procédure de Recrutement',
      description: 'Procédure détaillée pour le recrutement d\'un nouveau collaborateur',
      objective: 'Recruter et intégrer efficacement de nouveaux collaborateurs',
      scope: 'Tous les départements',
      status: 'ACTIVE',
      workspaceId: orangeTunisie.id,
      departmentId: hrDepartment.id,
      createdById: users[2].id,
      effectiveDate: new Date(),
    },
  });

  // Create FlowDiagram for Procedure (level=3)
  await prisma.flowDiagram.create({
    data: {
      level: 3,
      processId: procedure1.id,
      procedureId: procedure1.id,
    },
  });

  const procedure2 = await prisma.procedure.create({
    data: {
      processId: process1.id,
      code: 'PROC-RH-001-002',
      title: 'Procédure d\'Intégration',
      description: 'Procédure d\'intégration des nouveaux collaborateurs',
      objective: 'Faciliter l\'intégration des nouveaux collaborateurs',
      scope: 'Ressources Humaines',
      status: 'ACTIVE',
      workspaceId: orangeTunisie.id,
      departmentId: hrDepartment.id,
      createdById: users[2].id,
    },
  });

  // Create FlowDiagram for Procedure (level=3)
  await prisma.flowDiagram.create({
    data: {
      level: 3,
      processId: procedure2.id,
      procedureId: procedure2.id,
    },
  });

  const procedure3 = await prisma.procedure.create({
    data: {
      processId: process3.id,
      code: 'PROC-IT-001-001',
      title: 'Procédure de Traitement Incident',
      description: 'Procédure détaillée pour traiter un incident IT',
      objective: 'Résoudre les incidents dans les délais SLA',
      scope: 'Service IT',
      status: 'ACTIVE',
      workspaceId: orangeTunisie.id,
      departmentId: itDepartment.id,
      createdById: users[1].id,
      effectiveDate: new Date(),
    },
  });

  // Create FlowDiagram for Procedure (level=3)
  await prisma.flowDiagram.create({
    data: {
      level: 3,
      processId: procedure3.id,
      procedureId: procedure3.id,
    },
  });

  const procedure4 = await prisma.procedure.create({
    data: {
      processId: process4.id,
      code: 'PROC-IT-002-001',
      title: 'Procédure de Gestion des Demandes',
      description: 'Procédure pour gérer les demandes informatiques',
      objective: 'Traiter les demandes dans les délais',
      scope: 'Service IT',
      status: 'ACTIVE',
      workspaceId: orangeTunisie.id,
      departmentId: itDepartment.id,
      createdById: users[1].id,
      effectiveDate: new Date(),
    },
  });

  // Create FlowDiagram for Procedure (level=3)
  await prisma.flowDiagram.create({
    data: {
      level: 3,
      processId: procedure4.id,
      procedureId: procedure4.id,
    },
  });

  console.log(`  ✅ Created ${4} Procedures (Niveau 3) with FlowDiagrams`);

  // ====================================
  // CREATE FLOW NODES FOR PROCESSMAP (Niveau 1)
  // ====================================
  console.log('🎨 Creating ProcessMap FlowNodes...');

  // Get FlowDiagrams for ProcessMaps
  const processMap1FlowDiagram = await prisma.flowDiagram.findFirst({
    where: { processMapId: processMap1.id },
  });

  const processMap2FlowDiagram = await prisma.flowDiagram.findFirst({
    where: { processMapId: processMap2.id },
  });

  if (processMap1FlowDiagram) {
    // Create FlowNodes in ProcessMap1 representing Processes
    await prisma.flowNode.create({
      data: {
        diagramId: processMap1FlowDiagram.id,
        rfId: 'node-map1-process1',
        type: 'PROCESS',
        label: 'Gestion des Incidents IT',
        entityType: 'PROCESS',
        referencedEntityId: process3.id,
        position: { x: 200, y: 150 },
        data: {
          description: 'Processus de gestion incidents',
        },
      },
    });

    await prisma.flowNode.create({
      data: {
        diagramId: processMap1FlowDiagram.id,
        rfId: 'node-map1-process2',
        type: 'PROCESS',
        label: 'Gestion des Demandes IT',
        entityType: 'PROCESS',
        referencedEntityId: process4.id,
        position: { x: 500, y: 150 },
        data: {
          description: 'Processus de gestion des demandes',
        },
      },
    });

    // Create FlowEdge between processes
    await prisma.flowEdge.create({
      data: {
        diagramId: processMap1FlowDiagram.id,
        rfId: 'edge-map1-1',
        sourceRfId: 'node-map1-process1',
        targetRfId: 'node-map1-process2',
        label: 'Suit',
      },
    });
  }

  if (processMap2FlowDiagram) {
    // Create FlowNodes in ProcessMap2 representing Processes
    await prisma.flowNode.create({
      data: {
        diagramId: processMap2FlowDiagram.id,
        rfId: 'node-map2-process1',
        type: 'PROCESS',
        label: 'Recrutement et Intégration',
        entityType: 'PROCESS',
        referencedEntityId: process1.id,
        position: { x: 200, y: 150 },
        data: {
          description: 'Processus de recrutement',
        },
      },
    });

    await prisma.flowNode.create({
      data: {
        diagramId: processMap2FlowDiagram.id,
        rfId: 'node-map2-process2',
        type: 'PROCESS',
        label: 'Gestion des Carrières',
        entityType: 'PROCESS',
        referencedEntityId: process2.id,
        position: { x: 500, y: 150 },
        data: {
          description: 'Processus de gestion des carrières',
        },
      },
    });

    // Create FlowEdge between processes
    await prisma.flowEdge.create({
      data: {
        diagramId: processMap2FlowDiagram.id,
        rfId: 'edge-map2-1',
        sourceRfId: 'node-map2-process1',
        targetRfId: 'node-map2-process2',
        label: 'Suit',
      },
    });
  }

  console.log(`  ✅ Created FlowNodes and FlowEdges for ProcessMaps`);

  // ====================================
  // CREATE FLOW NODES FOR PROCESS (Niveau 2)
  // ====================================
  console.log('🎨 Creating Process FlowNodes...');

  // Get FlowDiagrams for Processes
  const process1FlowDiagram = await prisma.flowDiagram.findFirst({
    where: { processId_ref: process1.id },
  });

  const process3FlowDiagram = await prisma.flowDiagram.findFirst({
    where: { processId_ref: process3.id },
  });

  const process4FlowDiagram = await prisma.flowDiagram.findFirst({
    where: { processId_ref: process4.id },
  });

  if (process1FlowDiagram) {
    // Create FlowNodes in Process1 representing Procedures
    await prisma.flowNode.create({
      data: {
        diagramId: process1FlowDiagram.id,
        rfId: 'node-proc1-procedure1',
        type: 'PROCEDURE',
        label: 'Procédure de Recrutement',
        entityType: 'PROCEDURE',
        referencedEntityId: procedure1.id,
        position: { x: 150, y: 100 },
        data: {
          description: 'Procédure détaillée de recrutement',
        },
      },
    });

    await prisma.flowNode.create({
      data: {
        diagramId: process1FlowDiagram.id,
        rfId: 'node-proc1-procedure2',
        type: 'PROCEDURE',
        label: 'Procédure d\'Intégration',
        entityType: 'PROCEDURE',
        referencedEntityId: procedure2.id,
        position: { x: 400, y: 100 },
        data: {
          description: 'Procédure d\'intégration',
        },
      },
    });

    // Create FlowEdge between procedures
    await prisma.flowEdge.create({
      data: {
        diagramId: process1FlowDiagram.id,
        rfId: 'edge-proc1-1',
        sourceRfId: 'node-proc1-procedure1',
        targetRfId: 'node-proc1-procedure2',
        label: 'Puis',
      },
    });
  }

  if (process3FlowDiagram) {
    // Create FlowNode in Process3 representing Procedure
    await prisma.flowNode.create({
      data: {
        diagramId: process3FlowDiagram.id,
        rfId: 'node-proc3-procedure1',
        type: 'PROCEDURE',
        label: 'Procédure de Traitement Incident',
        entityType: 'PROCEDURE',
        referencedEntityId: procedure3.id,
        position: { x: 300, y: 150 },
        data: {
          description: 'Procédure de traitement incident',
        },
      },
    });
  }

  if (process4FlowDiagram) {
    // Create FlowNode in Process4 representing Procedure
    await prisma.flowNode.create({
      data: {
        diagramId: process4FlowDiagram.id,
        rfId: 'node-proc4-procedure1',
        type: 'PROCEDURE',
        label: 'Procédure de Gestion des Demandes',
        entityType: 'PROCEDURE',
        referencedEntityId: procedure4.id,
        position: { x: 300, y: 120 },
        data: {
          description: 'Procédure pour gérer les demandes',
        },
      },
    });
  }

  console.log(`  ✅ Created FlowNodes and FlowEdges for Processes`);

  console.log('✅ Database seeded successfully!');
  console.log(`🔐 Default password for seeded users: ${defaultPassword}`);
  console.log(`Created ${users.length} users`);
  console.log(`Created workspace: ${orangeTunisie.name}`);
  console.log(`Created ${2} ProcessMaps (Niveau 1) with FlowDiagrams`);
  console.log(`Created ${4} Processes (Niveau 2) with FlowDiagrams`);
  console.log(`Created ${4} Procedures (Niveau 3) with FlowDiagrams`);
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