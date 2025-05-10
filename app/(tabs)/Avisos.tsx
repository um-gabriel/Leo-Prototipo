// Avisos.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot, getDocs, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '@/src/firebase/config';
import { colors } from '@/src/components/global';
import { StatusBarObject } from '@/src/components/objects';
import { useRouter } from 'expo-router';

interface Candidatura {
    id: string;
    jobId?: string;
    userId?: string;
    status?: string;
    companyId?: string;
    appliedAt?: string;
}

interface Vaga {
    id: string;
    nome_vaga?: string;
    nome_empresa?: string;
    regime?: string;
    setor?: string;
    // Adicione outros campos relevantes da sua coleção 'Vagas-trabalhos'
}

interface CandidatoInfo {
    [userId: string]: { nome_conta?: string };
}

export default function Avisos() {
    const [candidaturas, setCandidaturas] = useState<Candidatura[]>([]);
    const [vagasDaEmpresa, setVagasDaEmpresa] = useState<Vaga[]>([]);
    const [infoCandidatos, setInfoCandidatos] = useState<CandidatoInfo>({});
    const [isEmpresa, setIsEmpresa] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const verificarTipoUsuario = async () => {
            const user = auth.currentUser;
            if (user) {
                const userDoc = await getDoc(doc(db, 'Contas', user.uid));
                if (userDoc.exists() && userDoc.data()?.tipo_conta === 'Empresa') {
                    setIsEmpresa(true);
                } else {
                    setIsEmpresa(false);
                    // Se não for empresa, buscar vagas (como na implementação anterior)
                    const vagasCollection = collection(db, 'Vagas-trabalhos');
                    const qVagas = query(vagasCollection);
                    const unsubscribeVagas = onSnapshot(qVagas, (snapshot) => {
                        const vagasList: Vaga[] = [];
                        snapshot.forEach((doc) => {
                            vagasList.push({ id: doc.id, ...doc.data() } as Vaga);
                        });
                        setVagasDaEmpresa(vagasList); // Reutilizando o estado 'vagasDaEmpresa' para exibir vagas para candidatos
                    });
                    return () => unsubscribeVagas();
                }
            }
        };

        verificarTipoUsuario();
    }, []);

    useEffect(() => {
        if (isEmpresa) {
            const fetchCandidaturasEmpresa = async () => {
                const empresaUid = auth.currentUser?.uid;
                if (empresaUid) {
                    const vagasCollection = collection(db, 'Vagas-trabalhos');
                    const qVagasEmpresa = query(vagasCollection, where('uid_criadorVaga', '==', empresaUid));
                    const snapshotVagasEmpresa = await getDocs(qVagasEmpresa);
                    const idsVagasEmpresa = snapshotVagasEmpresa.docs.map(doc => doc.id);
                    setVagasDaEmpresa(snapshotVagasEmpresa.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vaga)));

                    if (idsVagasEmpresa.length > 0) {
                        const applicationsCollection = collection(db, 'applications');
                        const qCandidaturas = query(applicationsCollection, where('jobId', 'in', idsVagasEmpresa));
                        const unsubscribeCandidaturas = onSnapshot(qCandidaturas, async (snapshotCandidaturas) => {
                            const candidaturasList: Candidatura[] = [];
                            const candidatosIds = new Set<string>();
                            snapshotCandidaturas.forEach((doc) => {
                                const candidaturaData = { id: doc.id, ...doc.data() } as Candidatura;
                                candidaturasList.push(candidaturaData);
                                if (candidaturaData.userId) {
                                    candidatosIds.add(candidaturaData.userId);
                                }
                            });
                            setCandidaturas(candidaturasList);

                            // Buscar informações dos candidatos
                            const candidatosInfo: CandidatoInfo = {};
                            for (const userId of candidatosIds) {
                                const candidatoDoc = await getDoc(doc(db, 'Contas', userId));
                                if (candidatoDoc.exists()) {
                                    candidatosInfo[userId] = candidatoDoc.data();
                                }
                            }
                            setInfoCandidatos(candidatosInfo);
                        });
                        return () => unsubscribeCandidaturas();
                    } else {
                        setCandidaturas([]);
                    }
                }
            };

            fetchCandidaturasEmpresa();
        }
    }, [isEmpresa]);

    const renderCandidatura = ({ item }: { item: Candidatura }) => {
        const nomeCandidato = infoCandidatos[item.userId || '']?.nome_conta || 'Nome não disponível';
        const vagaRelacionada = vagasDaEmpresa.find(vaga => vaga.id === item.jobId)?.nome_vaga || 'Vaga não encontrada';

        return (
            <TouchableOpacity style={styles.candidaturaItem} onPress={() => {
                // Aqui você pode adicionar a lógica para navegar para os detalhes da candidatura
                console.log('Candidatura selecionada:', item.id);
                router.push({
                    pathname: '/(tabs)/detalhesCandidatura',
                    params: {
                        idCandidatura: item.id,
                        uidCandidato: item.userId,
                        jobId: item.jobId,
                        nomeVaga: vagaRelacionada,
                        status: item.status,
                        nomeCandidato: nomeCandidato,
                        // Outros parâmetros relevantes da candidatura
                    },
                });
            }}>
                <Text style={styles.tituloCandidatura}>Candidato: {nomeCandidato}</Text>
                <Text style={styles.infoCandidatura}>Vaga: {vagaRelacionada}</Text>
                <Text style={styles.infoCandidatura}>Status: {item.status || 'Pendente'}</Text>
                {/* Adicione aqui outros detalhes da candidatura que você quer exibir */}
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            <StatusBarObject />
            <Text style={styles.header}>{isEmpresa ? 'Candidaturas Recebidas' : 'Vagas Disponíveis'}</Text>
            {isEmpresa ? (
                candidaturas.length === 0 ? (
                    <Text style={[styles.infoCandidatura, { textAlign: 'center', marginTop: 20 }]}>
                        Nenhuma candidatura recebida para suas vagas.
                    </Text>
                ) : (
                    <FlatList
                        data={candidaturas}
                        renderItem={renderCandidatura}
                        keyExtractor={(item) => item.id}
                    />
                )
            ) : (
                vagasDaEmpresa.length === 0 ? (
                    <Text style={[styles.infoCandidatura, { textAlign: 'center', marginTop: 20 }]}>
                        Nenhuma vaga disponível no momento.
                    </Text>
                ) : (
                    <FlatList
                        data={vagasDaEmpresa}
                        renderItem={({ item }) => (
                            <TouchableOpacity style={styles.vagaItem} onPress={() => {
                                // Lógica para candidatos verem detalhes da vaga
                                console.log('Vaga selecionada (candidato):', item.id);
                            }}>
                                <Text style={styles.titulo}>{item.nome_vaga || 'Título não disponível'}</Text>
                                {/* Outras informações da vaga para candidatos */}
                            </TouchableOpacity>
                        )}
                        keyExtractor={(item) => item.id}
                    />
                )
            )}
        </View>
    );
}

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
    // Estilos para a visualização de vagas por candidatos (reutilizados)
    vagaItem: {
        backgroundColor: colors.cinza,
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
    },
    titulo: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.tituloBranco,
    },
    info: {
        fontSize: 16,
        color: colors.tituloBranco,
        marginBottom: 3,
    },
    // Estilos para a visualização de candidaturas por empresas
    candidaturaItem: {
        backgroundColor: colors.fundo2,
        padding: 16,
        marginBottom: 12,
        borderRadius: 8,
        borderColor: colors.amarelo2,
        borderWidth: 1,
    },
    tituloCandidatura: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
        color: colors.amarelo2,
    },
    infoCandidatura: {
        fontSize: 16,
        color: colors.tituloBranco,
        marginBottom: 3,
    },
});

/*
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot, doc, getDoc } from 'firebase/firestore'; // Importe doc e getDoc
import { db, auth } from '@/src/firebase/config';
import { colors } from '@/src/components/global';
import { StatusBarObject } from '@/src/components/objects';
import { useRouter } from 'expo-router';
import { verification } from '@/src/firebase/functions/interface';

interface CandidaturaVagaApp { // Interface para os dados da coleção 'applications'
    id_candidatura: string;
    userId: string;
    uidCriadorVaga: string;
    jobId: string;
    status?: string;
    appliedAt?: Date;
    // Adicione outros campos da sua coleção 'applications'
}

interface CandidatoInfo { // Interface para os dados do candidato
    nome_conta?: string;
    // Adicione aqui outros campos que você queira buscar do perfil do candidato
}

interface CandidaturaComInfo extends CandidaturaVagaApp { // Nova interface combinando candidatura e info do candidato
    infoCandidato?: CandidatoInfo;
    nome_vaga?: string; // Podemos buscar o nome da vaga também, se necessário
}

export default function Avisos() {
    const [candidaturas, setCandidaturas] = useState<CandidaturaComInfo[]>([]); // Use a nova interface

    useEffect(() => {
        const userId = verification().uid;

        if (userId) {
            const applicationsRef = collection(db, 'applications'); // Referência à coleção 'applications'
            const q = query(applicationsRef, where('uidCriadorVaga', '==', userId)); // Filtra por uidCriadorVaga

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const candidaturasData: CandidaturaComInfo[] = [];

                const fetchCandidatoInfo = async (uidCandidato: string): Promise<CandidatoInfo | undefined> => {
                    try {
                        const candidatoDoc = await getDoc(doc(db, 'Contas', uidCandidato));
                        if (candidatoDoc.exists()) {
                            return candidatoDoc.data() as CandidatoInfo;
                        } else {
                            console.warn(`Dados do candidato com UID ${uidCandidato} não encontrados.`);
                            return undefined;
                        }
                    } catch (error) {
                        console.error("Erro ao buscar dados do candidato:", error);
                        return undefined;
                    }
                };

                const fetchVagaInfo = async (jobId: string): Promise<string | undefined> => {
                    try {
                        const vagaDoc = await getDoc(doc(db, 'Vagas-trabalho', jobId));
                        if (vagaDoc.exists()) {
                            return vagaDoc.data()?.nome_vaga as string | undefined;
                        } else {
                            console.warn(`Dados da vaga com ID ${jobId} não encontrados.`);
                            return undefined;
                        }
                    } catch (error) {
                        console.error("Erro ao buscar nome da vaga:", error);
                        return undefined;
                    }
                };

                const processCandidaturas = async () => {
                    for (const doc of querySnapshot.docs) {
                        const data = doc.data() as CandidaturaVagaApp;
                        const candidatoInfo = await fetchCandidatoInfo(data.userId);
                        const nomeVaga = await fetchVagaInfo(data.jobId);

                        candidaturasData.push({
                            id_candidatura: doc.id,
                            userId: data.userId,
                            uidCriadorVaga: data.uidCriadorVaga,
                            jobId: data.jobId,
                            status: data.status || 'Pendente',
                            appliedAt: data.appliedAt ? data.appliedAt : new Date(),
                            infoCandidato: candidatoInfo,
                            nome_vaga: nomeVaga,
                        });
                    }
                    setCandidaturas(candidaturasData);
                    console.log('Candidaturas (da applications) processadas com info:', candidaturasData);
                };

                processCandidaturas();
            });

            return () => unsubscribe();
        }
    }, []);

    const router = useRouter();

    const verDetalhesCandidatura = (candidatura: CandidaturaComInfo) => {
        router.push({
            pathname: '/(tabs)/detalhesCandidatura',
            params: {
                idCandidatura: candidatura.id_candidatura,
                uidCandidato: candidatura.userId,
                uidCriadorVaga: candidatura.uidCriadorVaga,
                nomeVaga: candidatura.nome_vaga || 'Vaga não disponível',
                status: candidatura.status,
                nomeCandidato: candidatura.infoCandidato?.nome_conta || 'Nome não disponível',
                dataCandidatura: candidatura.appliedAt?.toISOString() || new Date().toISOString(),
            },
        });
    };

    const renderCandidatura = ({ item }: { item: CandidaturaComInfo }) => (
        <TouchableOpacity style={styles.candidaturaItem} onPress={() => verDetalhesCandidatura(item)}>
            <Text style={styles.titulo}>{item.nome_vaga || 'Vaga não disponível'}</Text>
            <Text style={styles.info}>
                <Text style={{ color: colors.amarelo2 }}>Status:</Text> {item.status}
            </Text>
            <Text style={styles.info}>
                <Text style={{ color: colors.amarelo2 }}>Candidato:</Text> {item.infoCandidato?.nome_conta || 'Nome não disponível'}
            </Text>
            <Text style={styles.info}>
                <Text style={{ color: colors.amarelo2 }}>Data:</Text> {item.appliedAt?.toLocaleDateString('pt-BR') || 'Data não disponível'}
            </Text>
        </TouchableOpacity>
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
*/

/*
import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from 'react-native';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db, auth } from '@/src/firebase/config';
import { colors } from '@/src/components/global';
import { CandidaturaVaga, verification } from '@/src/firebase/functions/interface';
import { StatusBarObject } from '@/src/components/objects';
import { useRouter } from 'expo-router';

export default function Avisos() {
    const [candidaturas, setCandidaturas] = useState<CandidaturaVaga[]>([]);
    const router = useRouter();

    useEffect(() => {
        const userId = verification().uid;
        console.log("ID da empresa logada em Avisos:", userId); // LOG DO ID DA EMPRESA

        if (userId) {
            const candidaturasRef = collection(db, 'candidaturas');
            const q = query(candidaturasRef, where('uidCriadorVaga', '==', userId));

            const unsubscribe = onSnapshot(q, (querySnapshot) => {
                const candidaturasData: CandidaturaVaga[] = [];
                querySnapshot.forEach((doc) => {
                    const data = doc.data();
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
                setCandidaturas(candidaturasData);
                console.log("Candidaturas encontradas:", candidaturasData); // LOG DAS CANDIDATURAS ENCONTRADAS
            });

            return () => unsubscribe();
        }
    }, []);

    const verDetalhesCandidatura = (candidatura: CandidaturaVaga) => {
        router.push({
            pathname: '/detalhesCandidatura',
            params: {
                idCandidatura: candidatura.id_candidatura,
                uidCandidato: candidatura.uid_candidato,
                uidCriadorVaga: candidatura.uid_criadorVaga,
                nomeVaga: candidatura.nome_vaga,
                status: candidatura.status,
                nomeCandidato: candidatura.nome_candidato,
                dataCandidatura: candidatura.dataCandidatura.toISOString(),
            },
        });
    };

    const renderCandidatura = ({ item }: { item: CandidaturaVaga }) => (
        <TouchableOpacity style={styles.candidaturaItem} onPress={() => verDetalhesCandidatura(item)}>
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
        </TouchableOpacity>
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
*/

/*
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
*/

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
