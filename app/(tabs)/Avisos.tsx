import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/src/firebase/config';
import { colors } from '@/src/components/global';
import { CandidaturaVaga, verification } from '@/src/firebase/functions/interface';

export default function Avisos() {
  const [candidaturas, setCandidaturas] = useState<CandidaturaVaga[]>([]);

  useEffect(() => {
    if (!auth.currentUser?.uid) return;

    const q = query(
      collection(db, 'candidaturas'),
      where('criadorId', '==', auth.currentUser.uid)
    );
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const novasCandidaturas = snapshot.docs.map(doc => ({
        id_candidatura: doc.id,
        ...doc.data()
      })) as CandidaturaVaga[];
      
      setCandidaturas(novasCandidaturas);
    });

    return () => unsubscribe();
  }, []);

  const renderCandidatura = ({ item }: { item: CandidaturaVaga }) => (
    <View style={styles.candidaturaItem}>
      <Text style={styles.titulo}>{item.vaga_name}</Text>
      <Text style={styles.info}>
        <Text style={{color: colors.amarelo2}}>Status:</Text> {item.status}
      </Text>
      <Text style={styles.info}>
        <Text style={{color: colors.amarelo2}}>Candidato:</Text> {item.candidato_name}
      </Text>
      <Text style={styles.info}>
        <Text style={{color: colors.amarelo2}}>Data:</Text> {new Date(item.dataCandidatura).toLocaleDateString()}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Candidaturas Recebidas</Text>
      {candidaturas.length === 0 ? (
        <Text style={[styles.info, {textAlign: 'center', marginTop: 20}]}>
          Nenhuma candidatura recebida
        </Text>
      ) : (
        <FlatList
          data={candidaturas}
          renderItem={renderCandidatura}
          keyExtractor={(item) => item.id_candidatura}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: colors.fundo,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.tituloBranco,
    marginBottom: 16,
  },
  candidaturaItem: {
    backgroundColor: colors.cinza,
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
  },
  titulo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.tituloAmarelo,
    marginBottom: 8,
  },
  info: {
    fontSize: 16,
    color: colors.tituloBranco,
    marginBottom: 4,
  },
});