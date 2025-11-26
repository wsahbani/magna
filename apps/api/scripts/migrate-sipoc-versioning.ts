import { PrismaClient, SipocStatus } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Script de migration pour convertir les SipocDiagram existants
 * vers le nouveau système de versioning
 */
async function migrateSipocToVersioning() {
  console.log('🚀 Début de la migration SIPOC vers le système de versioning...');

  try {
    // Récupérer tous les diagrammes SIPOC existants
    const sipocs = await prisma.sipocDiagram.findMany({});

    console.log(`📊 ${sipocs.length} diagrammes SIPOC trouvés`);

    for (const sipoc of sipocs) {
      console.log(`\n📝 Migration du SIPOC: ${sipoc.title} (${sipoc.sipoc_id})`);

      // Vérifier si une version existe déjà
      const existingVersion = await prisma.sipocVersion.findFirst({
        where: { sipoc_id: sipoc.sipoc_id },
      });

      if (existingVersion) {
        console.log(`  ⏭️  Version déjà existante, passage au suivant`);
        continue;
      }

      // Créer la première version basée sur les données existantes
      // Par défaut, on crée une version DRAFT
      const version = await prisma.sipocVersion.create({
        data: {
          sipoc_id: sipoc.sipoc_id,
          version: 1,
          status: SipocStatus.DRAFT,
          title: sipoc.title,
          description: sipoc.description,
          releasedAt: null,
          changesLog: 'Version initiale migrée depuis l\'ancien système',
        },
      });

      console.log(`  ✅ Version créée: v${version.version} (${version.id})`);

      // Récupérer et migrer les éléments existants vers la nouvelle version
      const elements = await prisma.sipocElement.findMany({
        where: { documentId: sipoc.documentId },
      });

      if (elements.length > 0) {
        console.log(`  📦 Migration de ${elements.length} éléments...`);

        for (const element of elements) {
          await prisma.sipocElement.update({
            where: { id: element.id },
            data: { versionId: version.id },
          });
        }

        console.log(`  ✅ Éléments migrés`);
      }

      // Récupérer et migrer les connexions vers la nouvelle version
      const connections = await prisma.sipocConnection.findMany({
        where: { documentId: sipoc.documentId },
      });

      if (connections.length > 0) {
        console.log(`  🔗 Migration de ${connections.length} connexions...`);

        for (const connection of connections) {
          await prisma.sipocConnection.update({
            where: { connection_id: connection.connection_id },
            data: { versionId: version.id },
          });
        }

        console.log(`  ✅ Connexions migrées`);
      }

      // Mettre à jour le SIPOC pour pointer vers la bonne version
      const updateData: any = {};

      // Comme on crée toujours une version DRAFT lors de la migration
      updateData.currentDraftId = version.id;

      await prisma.sipocDiagram.update({
        where: { sipoc_id: sipoc.sipoc_id },
        data: updateData,
      });

      // Créer une entrée d'historique
      await prisma.sipocHistory.create({
        data: {
          versionId: version.id,
          changed_by: sipoc.createdBy,
          change_type: 'MIGRATION',
          change_description: 'Migration vers le système de versioning',
          previous_state: null,
          new_state: {
            version: version.version,
            status: version.status,
          },
        },
      });

      console.log(`  ✅ SIPOC ${sipoc.title} migré avec succès`);
    }

    console.log('\n✨ Migration terminée avec succès !');
  } catch (error) {
    console.error('\n❌ Erreur lors de la migration:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Exécuter la migration
migrateSipocToVersioning()
  .then(() => {
    console.log('\n🎉 Script de migration terminé');
    process.exit(0);
  })
  .catch((error) => {
    console.error('\n💥 Échec de la migration:', error);
    process.exit(1);
  });
