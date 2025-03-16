import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/src/firebase/config';
import { colors } from '@/src/components/global';
import { CandidaturaVaga, verification } from '@/src/firebase/functions/interface';

export default function Avisos() {
  const [candidaturas, setCandidaturas] = useState<CandidaturaVaga[]>([]);

  useEffect(() => {
    const userId = verification().uid;

    if (userId) {
      const candidaturasRef = collection(db, 'candidaturas');
      const q = query(candidaturasRef, where('uidCriadorVaga', '==', userId));

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const candidaturasData: CandidaturaVaga[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          console.log('Candidatura recebida:', data); // Log para verificar os dados recebidos
          candidaturasData.push({
            id_candidatura: doc.id,
            uid_candidato: data.userId,
            uid_criadorVaga: data.uidCriadorVaga,
            nome_vaga: data.nome_vaga,
            status: data.status || 'Pendente',
            candidato_name: data.nome_candidato,
            dataCandidatura: data.createdAt ? data.createdAt.toDate() : new Date(),
          });
        }); 
        console.log('Candidaturas processadas:', candidaturasData); // Log para verificar as candidaturas processadas
        setCandidaturas(candidaturasData);
      });

      // Limpeza do listener quando o componente é desmontado
      return () => unsubscribe();
    }
  }, []);

  const renderCandidatura = ({ item }: { item: CandidaturaVaga }) => (
    <View style={styles.candidaturaItem}>
      <Text style={styles.titulo}>{item.nome_vaga}</Text>
      <Text style={styles.info}>
        <Text style={{ color: colors.amarelo2 }}>Status:</Text> {item.status}
      </Text>
      <Text style={styles.info}>
        <Text style={{ color: colors.amarelo2 }}>Candidato:</Text> {item.candidato_name}
      </Text>
      <Text style={styles.info}>
        <Text style={{ color: colors.amarelo2 }}>Data:</Text> {new Date(item.dataCandidatura).toLocaleDateString('pt-BR')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Candidaturas Recebidas</Text>
      {candidaturas.length === 0 ? (
        <Text style={[styles.info, { textAlign: 'center', marginTop: 20 }]}>
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
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 5,
    color: colors.tituloBranco
  },
  info: {
    fontSize: 16,
    color: colors.tituloBranco,
    marginBottom: 4,
  },
});