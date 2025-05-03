// src/screens/CompanyApplicationsScreen.tsx

// import React, { useEffect, useState } from 'react';
// import { View, Text, StyleSheet, ActivityIndicator, FlatList } from 'react-native';
// import { auth } from '../../src/firebase/config.js'; // Ajuste o caminho
// import { subscribeCompanyApplications } from '../../src/firebase/functions/get/getCompanyApplication'; // Ajuste o caminho
// // Você precisará de funções para buscar dados de Vagas-trabalhos e Contas
// // import { getJobById } from '../../src/firebase/functions/get/getJobs.js'; // Exemplo 
// // import { getUserById } from '../firebase/functions/get/getUsers'; // Exemplo
// import { colors } from '@/src/components/global'; // Importe suas cores
// import { StatusBarObject } from '@/src/components/objects'; // Importe seus objetos de UI

// interface ApplicationDocument {
//   id: string;
//   userId: string;
//   jobId: string;
//   companyId: string;
//   status: 'pendente' | 'aceita' | 'rejeitada';
//   appliedAt: any;
//   respondedAt?: any;
//   responseMessage?: string;
// }

// // Opcional: Interface para os dados de candidatura com info adicional (nome da vaga, nome do candidato)
// interface ApplicationWithDetails extends ApplicationDocument {
//   jobTitle: string;
//   applicantName: string;
// }


// export default function Avisos() {
//   const [applications, setApplications] = useState<ApplicationDocument[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [companyId, setCompanyId] = useState<string | null>(null); // Para armazenar o UID da empresa logada

//   useEffect(() => {
//     // Obtém o UID da empresa logada
//     const currentUser = auth.currentUser;
//     if (currentUser) {
//       setCompanyId(currentUser.uid);
//     } else {
//       setError("Usuário da empresa não autenticado.");
//       setLoading(false);
//       return;
//     }

//     let unsubscribe: (() => void) | undefined;

//     if (companyId) {
//       // Inicia o listener das candidaturas
//       unsubscribe = subscribeCompanyApplications(
//         companyId,
//         (fetchedApplications) => {
//           setApplications(fetchedApplications);
//           setLoading(false);
//           setError(null); // Limpa erros anteriores em caso de sucesso
//         },
//         (err) => {
//           setError(err.message);
//           setLoading(false);
//         }
//       );
//     }

//     // Função de limpeza para cancelar o listener quando o componente desmontar
//     return () => {
//       if (unsubscribe) {
//         unsubscribe();
//       }
//     };
//   }, [companyId]); // Roda o efeito novamente se o companyId mudar (embora geralmente não mude após o login)

//   // Renderiza um item da lista de candidaturas
//   const renderApplicationItem = ({ item }: { item: ApplicationDocument }) => (
//     <View style={styles.applicationItem}>
//       <Text style={styles.jobTitle}>Vaga ID: {item.jobId}</Text> {/* Temporário: Mostra o ID da vaga */}
//       <Text style={styles.applicantName}>Candidato ID: {item.userId}</Text> {/* Temporário: Mostra o ID do usuário */}
//       <Text style={styles.status}>Status: {item.status}</Text>
//       <Text style={styles.appliedAt}>Candidatou-se em: {item.appliedAt ? new Date(item.appliedAt.toDate()).toLocaleString() : 'N/A'}</Text>
//       {/* Adicionar botão/lógica para Aceitar/Rejeitar depois */}
//     </View>
//   );

//   if (loading) {
//     return (
//       <View style={[styles.container, styles.centered]}>
//         <ActivityIndicator size="large" color={colors.amarelo1} />
//         <Text style={styles.loadingText}>Carregando candidaturas...</Text>
//       </View>
//     );
//   }

//   if (error) {
//     return (
//       <View style={[styles.container, styles.centered]}>
//         <Text style={styles.errorText}>Ocorreu um erro: {error}</Text>
//       </View>
//     );
//   }

//   if (applications.length === 0) {
//     return (
//       <View style={[styles.container, styles.centered]}>
//          <StatusBarObject />
//         <Text style={styles.noApplicationsText}>Nenhuma candidatura recebida até agora.</Text>
//       </View>
//     );
//   }

//   return (
//     <View style={styles.container}>
//       <StatusBarObject />
//       <Text style={styles.screenTitle}>Candidaturas Recebidas</Text>
//       <FlatList
//         data={applications}
//         renderItem={renderApplicationItem}
//         keyExtractor={(item) => item.id}
//         contentContainerStyle={styles.listContent}
//       />
//     </View>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: colors.preto,
//     paddingTop: 20, // Espaço para a StatusBar
//   },
//   centered: {
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   loadingText: {
//     marginTop: 10,
//     color: colors.tituloBranco,
//     fontSize: 16,
//   },
//   errorText: {
//     marginTop: 10,
//     color: 'red',
//     fontSize: 16,
//     textAlign: 'center',
//     marginHorizontal: 20,
//   },
//   noApplicationsText: {
//     color: colors.tituloBranco,
//     fontSize: 18,
//     textAlign: 'center',
//   },
//   screenTitle: {
//     fontSize: 24,
//     fontWeight: 'bold',
//     color: colors.tituloBranco,
//     textAlign: 'center',
//     marginVertical: 20,
//   },
//   listContent: {
//     paddingHorizontal: 15,
//     paddingBottom: 20, // Espaço no final da lista
//   },
//   applicationItem: {
//     backgroundColor: colors.cinza,
//     padding: 15,
//     borderRadius: 10,
//     marginBottom: 10,
//   },
//   jobTitle: {
//     fontSize: 18,
//     fontWeight: 'bold',
//     color: colors.tituloBranco,
//   },
//   applicantName: {
//     fontSize: 16,
//     color: colors.tituloAmarelo,
//     marginTop: 5,
//   },
//   status: {
//     fontSize: 16,
//     color: colors.tituloBranco,
//     marginTop: 5,
//   },
//   appliedAt: {
//     fontSize: 14,
//     color: colors.tituloBranco,
//     marginTop: 5,
//     fontStyle: 'italic',
//   },
// });

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/src/firebase/config';
import { colors } from '@/src/components/global';
import { CandidaturaVaga, verification } from '@/src/firebase/functions/interface';
import { StatusBarObject } from '@/src/components/objects';

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
            nome_candidato: data.nome_candidato,
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
        <Text style={{ color: colors.amarelo2 }}>Candidato:</Text> {item.nome_candidato}
      </Text>
      <Text style={styles.info}>
        <Text style={{ color: colors.amarelo2 }}>Data:</Text> {new Date(item.dataCandidatura).toLocaleDateString('pt-BR')}
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBarObject />

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
