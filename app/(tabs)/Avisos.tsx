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
    name_conta?: string;
}

interface Vaga {
    id: string;
    nome_vaga?: string;
    nome_empresa?: string;
    regime?: string;
    setor?: string;
    name_conta?: string;
    // Adicione outros campos relevantes da sua coleção 'Vagas-trabalhos'
}

interface CandidatoInfo {
    [userId: string]: { name_conta?: string };
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
                            console.log('Buscando info do candidato com ID:', userId);
                            const candidatoDoc = await getDoc(doc(db, 'Contas', userId));
                            if (candidatoDoc.exists()) {
                                console.log('Dados do candidato encontrado:', candidatoDoc.data()); // NOVO LOG
                                candidatosInfo[userId] = candidatoDoc.data();
                            } else {
                                console.log('Documento do candidato NÃO encontrado para o ID:', userId); // NOVO LOG
                            }
                        }
                        console.log('Informações dos candidatos carregadas:', candidatosInfo); // NOVO LOG
                        setInfoCandidatos(candidatosInfo);
                    });
                    return () => unsubscribeCandidaturas();
                } else {
                    setCandidaturas([]);
                    setInfoCandidatos({}); // Limpar o estado se não houver candidaturas
                }
            }
        };

        fetchCandidaturasEmpresa();
    }
}, [isEmpresa]);

    // useEffect(() => {
    //     if (isEmpresa) {
    //         const fetchCandidaturasEmpresa = async () => {
    //             const empresaUid = auth.currentUser?.uid;
    //             if (empresaUid) {
    //                 const vagasCollection = collection(db, 'Vagas-trabalhos');
    //                 const qVagasEmpresa = query(vagasCollection, where('uid_criadorVaga', '==', empresaUid));
    //                 const snapshotVagasEmpresa = await getDocs(qVagasEmpresa);
    //                 const idsVagasEmpresa = snapshotVagasEmpresa.docs.map(doc => doc.id);
    //                 setVagasDaEmpresa(snapshotVagasEmpresa.docs.map(doc => ({ id: doc.id, ...doc.data() } as Vaga)));

    //                 if (idsVagasEmpresa.length > 0) {
    //                     const applicationsCollection = collection(db, 'applications');
    //                     const qCandidaturas = query(applicationsCollection, where('jobId', 'in', idsVagasEmpresa));
    //                     const unsubscribeCandidaturas = onSnapshot(qCandidaturas, async (snapshotCandidaturas) => {
    //                         const candidaturasList: Candidatura[] = [];
    //                         const candidatosIds = new Set<string>();
    //                         snapshotCandidaturas.forEach((doc) => {
    //                             const candidaturaData = { id: doc.id, ...doc.data() } as Candidatura;
    //                             candidaturasList.push(candidaturaData);
    //                             if (candidaturaData.userId) {
    //                                 candidatosIds.add(candidaturaData.userId);
    //                             }
    //                         });
    //                         setCandidaturas(candidaturasList);

    //                         // Buscar informações dos candidatos
    //                         const candidatosInfo: CandidatoInfo = {};
    //                         for (const userId of candidatosIds) {
    //                             console.log('Buscando info do candidato com ID:', userId); // ADICIONE ESTE LOG
    //                             const candidatoDoc = await getDoc(doc(db, 'Contas', userId));
    //                             if (candidatoDoc.exists()) {
    //                                 candidatosInfo[userId] = candidatoDoc.data();
    //                             }
    //                         }
    //                         setInfoCandidatos(candidatosInfo);
    //                     });
    //                     return () => unsubscribeCandidaturas();
    //                 } else {
    //                     setCandidaturas([]);
    //                 }
    //             }
    //         };

    //         fetchCandidaturasEmpresa();
    //     }
    // }, [isEmpresa]);

    const renderCandidatura = ({ item }: { item: Candidatura }) => {
        const nomeCandidato = infoCandidatos[item.userId || '']?.name_conta || 'Nome não disponível';
        const vagaRelacionada = vagasDaEmpresa.find(vaga => vaga.id === item.jobId)?.nome_vaga || 'Vaga não encontrada';

        return (
            <TouchableOpacity style={styles.candidaturaItem} onPress={() => {
                // Aqui você pode adicionar a lógica para navegar para os detalhes da candidatura
                console.log('Candidatura selecionada:', item.id);
                router.push({
                    pathname: '/detalhesCandidatura',
                    params: {
                        idCandidatura: item.id, // ID do documento da candidatura
                        uidCandidato: item.userId, // UID do candidato (da candidatura)
                        jobId: item.jobId, // ID da vaga (da candidatura)
                        nomeVaga: vagaRelacionada, // Passa o nome da vaga (já resolvido em Avisos)
                        status: item.status, // Passa o status (já resolvido em Avisos)
                        nomeCandidato: nomeCandidato, // Passa o nome do candidato (já resolvido em Avisos)
                        // Não é estritamente necessário passar nomeVaga, status, nomeCandidato
                        // pois eles serão buscados novamente aqui, mas pode servir como fallback
                        // ou para exibição imediata antes da busca completa.
                    },
                });
            }}>
                <Text style={styles.tituloCandidatura}>Candidato: {nomeCandidato}</Text>
                <Text style={styles.infoCandidatura}>Vaga: {vagaRelacionada}</Text>
                <Text style={styles.infoCandidatura}>Status: {item.status || 'Pendente'}</Text>
                {/* <Text style={styles.infoCandidatura}>Descricao: {item.appliedAt}</Text> */}
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