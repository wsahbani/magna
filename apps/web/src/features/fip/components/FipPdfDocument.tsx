import React from 'react';
import { Document, Page, Text, View, StyleSheet, Font } from '@react-pdf/renderer';
import { ProcessIdentityCard } from '../types/fip.types';
import { SipocElement, SipocDiagram } from '../../sipoc/types/sipoc.types';

// Define styles
const styles = StyleSheet.create({
  page: {
    padding: 30,
    fontSize: 10,
    fontFamily: 'Helvetica',
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  orangeText: {
    color: '#ea580c',
  },
  gridRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  box: {
    border: '3px solid #ea580c',
    padding: 8,
    flex: 1,
    marginRight: 8,
  },
  boxLast: {
    marginRight: 0,
  },
  boxOrange: {
    backgroundColor: '#fff7ed',
  },
  boxTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  boxContent: {
    fontSize: 8,
  },
  fullWidth: {
    border: '3px solid #ea580c',
    padding: 8,
    marginBottom: 10,
  },
  twoColumns: {
    flexDirection: 'row',
    gap: 15,
  },
  column: {
    flex: 1,
  },
  listItem: {
    fontSize: 8,
    marginBottom: 2,
    marginLeft: 10,
  },
  curvedBox: {
    border: '3px solid #ea580c',
    padding: 12,
    borderRadius: 40,
    backgroundColor: '#fff7ed',
    flex: 2,
    marginHorizontal: 8,
    textAlign: 'center',
  },
  threeColumns: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  col3: {
    border: '3px solid #ea580c',
    padding: 8,
    flex: 1,
    marginRight: 8,
  },
  centerTitle: {
    fontSize: 9,
    fontWeight: 'bold',
    borderBottom: '2px solid #ea580c',
    paddingBottom: 4,
    marginBottom: 6,
    textAlign: 'center',
  },
  smallText: {
    fontSize: 7,
    color: '#666',
    marginTop: 2,
  },
});

interface FipPdfDocumentProps {
  fip: ProcessIdentityCard;
  sipocElements?: SipocElement[];
  sipocDiagram?: SipocDiagram;
}

export const FipPdfDocument: React.FC<FipPdfDocumentProps> = ({ fip, sipocElements = [], sipocDiagram }) => {
  // Helper to get SIPOC elements by type
  const getSipocByType = (type: string) => sipocElements.filter((el) => el.type === type);

  const suppliers = getSipocByType('supplier');
  const inputs = getSipocByType('input');
  const outputs = getSipocByType('output');
  const customers = getSipocByType('customer');
  const processes = getSipocByType('process');

  return (
    <Document>
      <Page size="A4" orientation="landscape" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>
            <Text style={styles.orangeText}>F</Text>iche d'<Text style={styles.orangeText}>I</Text>dentité du{' '}
            <Text style={styles.orangeText}>P</Text>rocessus
          </Text>
        </View>

        {/* Row 1: Process Name, Leaders, Date */}
        <View style={styles.gridRow}>
          <View style={[styles.box, styles.boxOrange]}>
            <Text style={styles.boxTitle}>Nom du processus :</Text>
            <Text style={styles.boxContent}>{sipocDiagram?.title || fip.process?.name || 'Non défini'}</Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Global Process Leader :</Text>
            <Text style={styles.boxContent}>
              {fip.stakeholders?.find((s) => s.role === 'Global Process Leader')?.name || 'Non défini'}
            </Text>
          </View>
          <View style={styles.box}>
            <Text style={styles.boxTitle}>Sponsor de processus :</Text>
            <Text style={styles.boxContent}>
              {fip.stakeholders?.find((s) => s.role === 'Sponsor')?.name || 'Non défini'}
            </Text>
          </View>
          <View style={[styles.box, styles.boxLast]}>
            <Text style={styles.boxTitle}>Mise à jour le :</Text>
            <Text style={styles.boxContent}>{new Date(fip.updatedAt).toLocaleDateString('fr-FR')}</Text>
          </View>
        </View>

        {/* Row 2: Finalité & Périmètre */}
        <View style={[styles.fullWidth, styles.boxOrange]}>
          <View style={styles.twoColumns}>
            <View style={styles.column}>
              <Text style={styles.boxTitle}>Finalité :</Text>
              <Text style={styles.boxContent}>{fip.objectives || 'Non défini'}</Text>
            </View>
            <View style={styles.column}>
              <Text style={styles.boxTitle}>Périmètre :</Text>
              <Text style={styles.boxContent}>{fip.scope || 'Non défini'}</Text>
            </View>
          </View>
        </View>

        {/* Row 3: Input, Attentes client, Output */}
        <View style={styles.gridRow}>
          <View style={styles.col3}>
            <Text style={styles.boxTitle}>Input processus :</Text>
            {inputs.length > 0 ? (
              inputs.slice(0, 3).map((input) => (
                <Text key={input.id} style={styles.listItem}>
                  • {input.title}
                </Text>
              ))
            ) : (
              <Text style={[styles.listItem, { color: '#999' }]}>Aucune entrée définie</Text>
            )}
          </View>
          <View style={[styles.col3, styles.boxOrange]}>
            <Text style={styles.boxTitle}>Attentes client :</Text>
            {customers.length > 0 ? (
              customers.slice(0, 3).map((customer) => (
                <Text key={customer.id} style={styles.listItem}>
                  • {customer.title}
                </Text>
              ))
            ) : (
              <Text style={[styles.listItem, { color: '#999' }]}>Aucune attente définie</Text>
            )}
          </View>
          <View style={[styles.col3, styles.boxLast]}>
            <Text style={styles.boxTitle}>Output processus :</Text>
            {outputs.length > 0 ? (
              outputs.slice(0, 3).map((output) => (
                <Text key={output.id} style={styles.listItem}>
                  • {output.title}
                </Text>
              ))
            ) : (
              <Text style={[styles.listItem, { color: '#999' }]}>Aucune sortie définie</Text>
            )}
          </View>
        </View>

        {/* Row 4: Fournisseurs, Activités principales, Clients */}
        <View style={styles.gridRow}>
          <View style={styles.col3}>
            <Text style={styles.boxTitle}>Fournisseurs processus :</Text>
            {suppliers.length > 0 ? (
              suppliers.slice(0, 3).map((supplier) => (
                <Text key={supplier.id} style={styles.listItem}>
                  • {supplier.title}
                </Text>
              ))
            ) : (
              <Text style={[styles.listItem, { color: '#999' }]}>Aucun fournisseur</Text>
            )}
          </View>
          <View style={styles.curvedBox}>
            <Text style={styles.centerTitle}>Activités principales du processus</Text>
            {processes.length > 0 ? (
              processes.slice(0, 3).map((process) => (
                <Text key={process.id} style={styles.listItem}>
                  • {process.title}
                </Text>
              ))
            ) : fip.objectives ? (
              <Text style={styles.listItem}>• {fip.objectives}</Text>
            ) : (
              <Text style={[styles.listItem, { color: '#999' }]}>Aucune activité définie</Text>
            )}
          </View>
          <View style={[styles.col3, styles.boxLast]}>
            <Text style={styles.boxTitle}>Clients processus :</Text>
            {customers.length > 0 ? (
              customers.slice(0, 3).map((customer) => (
                <Text key={customer.id} style={styles.listItem}>
                  • {customer.title}
                </Text>
              ))
            ) : (
              <Text style={[styles.listItem, { color: '#999' }]}>Aucun client</Text>
            )}
          </View>
        </View>

        {/* Row 5: Risques, Ressources, Acteurs */}
        <View style={styles.gridRow}>
          <View style={styles.col3}>
            <Text style={styles.boxTitle}>Risques majeurs :</Text>
            {fip.risks && fip.risks.length > 0 ? (
              fip.risks.slice(0, 2).map((risk, i) => (
                <Text key={i} style={styles.listItem}>
                  • {risk.description}
                </Text>
              ))
            ) : (
              <Text style={[styles.listItem, { color: '#999' }]}>Aucun risque</Text>
            )}
          </View>
          <View style={styles.col3}>
            <Text style={styles.boxTitle}>Ressources :</Text>
            {fip.resources && fip.resources.length > 0 ? (
              fip.resources.slice(0, 2).map((resource, i) => (
                <Text key={i} style={styles.listItem}>
                  • {resource.description}
                </Text>
              ))
            ) : (
              <Text style={[styles.listItem, { color: '#999' }]}>Aucune ressource</Text>
            )}
          </View>
          <View style={[styles.col3, styles.boxLast]}>
            <Text style={styles.boxTitle}>Acteurs du processus :</Text>
            {fip.stakeholders && fip.stakeholders.length > 0 ? (
              fip.stakeholders.slice(0, 3).map((stakeholder, i) => (
                <View key={i}>
                  <Text style={styles.listItem}>• {stakeholder.name}</Text>
                  <Text style={styles.smallText}>  {stakeholder.role}</Text>
                </View>
              ))
            ) : (
              <Text style={[styles.listItem, { color: '#999' }]}>Aucun acteur</Text>
            )}
          </View>
        </View>

        {/* Row 6: Indicateurs */}
        <View style={styles.gridRow}>
          <View style={[styles.col3, styles.boxOrange]}>
            <Text style={styles.boxTitle}>Indicateurs NME :</Text>
            {fip.indicators && fip.indicators.length > 0 ? (
              fip.indicators
                .filter((ind) => ind.name.toLowerCase().includes('nme') || ind.name.toLowerCase().includes('satisfaction'))
                .slice(0, 2)
                .map((ind, i) => (
                  <Text key={i} style={styles.listItem}>
                    • {ind.name}
                  </Text>
                ))
            ) : (
              <Text style={[styles.listItem, { color: '#999' }]}>Non défini</Text>
            )}
          </View>
          <View style={[styles.col3, styles.boxLast]}>
            <Text style={styles.boxTitle}>Indicateurs de performance :</Text>
            {fip.indicators && fip.indicators.length > 0 ? (
              fip.indicators.slice(0, 2).map((ind, i) => (
                <Text key={i} style={styles.listItem}>
                  • {ind.name}
                </Text>
              ))
            ) : (
              <Text style={[styles.listItem, { color: '#999' }]}>Non défini</Text>
            )}
          </View>
        </View>
      </Page>
    </Document>
  );
};
