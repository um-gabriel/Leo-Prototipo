// detalhesCandidatura.tsx

// detalhesCandidatura.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute, RouteProp, ParamListBase } from '@react-navigation/native'; // Importe RouteProp e ParamListBase
import { db } from '@/src/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { colors } from '@/src/components/global';
import { StatusBarObject } from '@/src/components/objects';

interface RouteParams extends ParamListBase {
    params?: DetalhesCandidaturaParams;
}

interface DetalhesCandidaturaParams {
    idCandidatura?: string;
    uidCandidato?: string;
    uidCriadorVaga?: string;
    nomeVaga?: string;
    status?: string;
    nomeCandidato?: string;
    dataCandidatura?: string;
}

interface CandidaturaDetalhada {
    id_candidatura: string;
    uid_candidato: string;
    uid_criadorVaga: string;
    nome_vaga: string;
    status: string;
    // Adicione aqui outros campos da candidatura
}

interface CandidatoDetalhado {
    nome_conta?: string;
    email?: string;
    desc_sobre?: string;
    telefone?: string;
    // Adicione aqui outros campos do perfil do candidato
}

interface EmpresaDetalhada {
    nome_empresa?: string;
    email?: string;
    cnpj?: string;
    descricao?: string;
    // Adicione aqui outros campos do perfil da empresa
}

interface VagaDetalhada {
    nome_vaga?: string;
    descricao?: string;
    salario?: string;
    modalidade?: string;
    // Adicione aqui outros campos da vaga
}

export default function DetalhesCandidatura() {
    const navigation = useNavigation();
    const route = useRoute<RouteProp<RouteParams, 'params'>>();
    const { idCandidatura, uidCandidato, uidCriadorVaga, nomeVaga, status, nomeCandidato, dataCandidatura } = route.params || {};
    const [candidatura, setCandidatura] = useState<CandidaturaDetalhada | null>(null);
    const [candidato, setCandidato] = useState<CandidatoDetalhado | null>(null);
    const [empresa, setEmpresa] = useState<EmpresaDetalhada | null>(null);
    const [vaga, setVaga] = useState<VagaDetalhada | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetalhes = async () => {
            setLoading(true);
            setError(null);
            try {
                if (idCandidatura) {
                    const candidaturaDoc = await getDoc(doc(db, 'applications', idCandidatura));
                    if (candidaturaDoc.exists()) {
                        setCandidatura({ id_candidatura: candidaturaDoc.id, ...candidaturaDoc.data() } as CandidaturaDetalhada);
                        if (candidaturaDoc.data()?.jobId) {
                            const vagaDoc = await getDoc(doc(db, 'Vagas-trabalho', candidaturaDoc.data().jobId));
                            if (vagaDoc.exists()) {
                                setVaga(vagaDoc.data() as VagaDetalhada);
                            } else {
                                console.warn('Vaga não encontrada:', candidaturaDoc.data().jobId);
                            }
                        }
                    } else {
                        setError('Candidatura não encontrada.');
                    }
                }

                if (uidCandidato) {
                    const candidatoDoc = await getDoc(doc(db, 'Contas', uidCandidato));
                    if (candidatoDoc.exists()) {
                        setCandidato(candidatoDoc.data() as CandidatoDetalhado);
                    } else {
                        setError('Informações do candidato não encontradas.');
                    }
                }

                if (uidCriadorVaga) {
                    const empresaDoc = await getDoc(doc(db, 'Contas', uidCriadorVaga));
                    if (empresaDoc.exists()) {
                        setEmpresa(empresaDoc.data() as EmpresaDetalhada);
                    } else {
                        setError('Informações da empresa não encontradas.');
                    }
                }
            } catch (e: any) {
                setError('Erro ao carregar detalhes: ' + e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetalhes();
    }, [idCandidatura, uidCandidato, uidCriadorVaga]);

    if (loading) {
        return (
            <View style={styles.container}>
                <StatusBarObject />
                <ActivityIndicator size="large" color={colors.amarelo1} />
                <Text style={styles.loadingText}>Carregando detalhes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <StatusBarObject />
                <Text style={styles.errorText}>Erro: {error}</Text>
            </View>
        );
    }

    if (!candidatura || !candidato || !empresa) {
        return (
            <View style={styles.container}>
                <StatusBarObject />
                <Text style={styles.infoText}>Detalhes não encontrados.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <StatusBarObject />
            <Text style={styles.header}>Detalhes da Candidatura</Text>

            <View style={styles.detailItem}>
                <Text style={styles.label}>Vaga:</Text>
                <Text style={styles.value}>{vaga?.nome_vaga || nomeVaga}</Text>
            </View>

            <View style={styles.detailItem}>
                <Text style={styles.label}>Empresa:</Text>
                <Text style={styles.value}>{empresa.nome_empresa || 'Nome da Empresa não disponível'}</Text>
                {empresa.email && <Text style={styles.subValue}>Email: {empresa.email}</Text>}
                {empresa.cnpj && <Text style={styles.subValue}>CNPJ: {empresa.cnpj}</Text>}
                {empresa.descricao && <Text style={styles.subValue}>Descrição: {empresa.descricao}</Text>}
            </View>

            <View style={styles.detailItem}>
                <Text style={styles.label}>Candidato:</Text>
                <Text style={styles.value}>{candidato.nome_conta || nomeCandidato || 'Nome não disponível'}</Text>
                {candidato.email && <Text style={styles.subValue}>Email: {candidato.email}</Text>}
                {candidato.telefone && <Text style={styles.subValue}>Telefone: {candidato.telefone}</Text>}
                {candidato.desc_sobre && <Text style={styles.subValue}>Sobre: {candidato.desc_sobre}</Text>}
            </View>

            <View style={styles.detailItem}>
                <Text style={styles.label}>Status da Candidatura:</Text>
                <Text style={styles.value}>{status}</Text>
            </View>

            <View style={styles.detailItem}>
                <Text style={styles.label}>Data da Candidatura:</Text>
                <Text style={styles.value}>{dataCandidatura ? new Date(dataCandidatura).toLocaleDateString('pt-BR') : 'Data não disponível'}</Text>
            </View>

            {vaga?.descricao && (
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Descrição da Vaga:</Text>
                    <Text style={styles.value}>{vaga.descricao}</Text>
                </View>
            )}

            {vaga?.salario && (
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Salário:</Text>
                    <Text style={styles.value}>{vaga.salario}</Text>
                </View>
            )}

            {vaga?.modalidade && (
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Modalidade:</Text>
                    <Text style={styles.value}>{vaga.modalidade}</Text>
                </View>
            )}

            {/* Adicione aqui mais detalhes da candidatura e do candidato */}
        </ScrollView>
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
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        color: colors.tituloBranco,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    infoText: {
        color: colors.tituloBranco,
        textAlign: 'center',
        marginTop: 20,
    },
    detailItem: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.cinza,
        paddingBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.amarelo2,
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: colors.tituloBranco,
    },
    subValue: {
        fontSize: 14,
        color: colors.tituloBranco,
        marginTop: 2,
    },
});

/*
import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native'; // Importe useNavigation e useRoute
import { db } from '@/src/firebase/config';
import { doc, getDoc } from 'firebase/firestore';
import { colors } from '@/src/components/global';
import { StatusBarObject } from '@/src/components/objects';

interface RouteParams {
    params?: DetalhesCandidaturaParams;
}

interface DetalhesCandidaturaParams {
    idCandidatura?: string;
    uidCandidato?: string;
    uidCriadorVaga?: string;
    nomeVaga?: string;
    status?: string;
    nomeCandidato?: string;
    dataCandidatura?: string;
}

interface CandidaturaDetalhada {
    id_candidatura: string;
    uid_candidato: string;
    uid_criadorVaga: string;
    nome_vaga: string;
    status: string;
    // Adicione aqui outros campos da candidatura
}

interface CandidatoDetalhado {
    nome_conta?: string;
    email?: string;
    desc_sobre?: string;
    telefone?: string;
    // Adicione aqui outros campos do perfil do candidato
}

interface EmpresaDetalhada {
    nome_empresa?: string;
    email?: string;
    cnpj?: string;
    descricao?: string;
    // Adicione aqui outros campos do perfil da empresa
}

interface VagaDetalhada {
    nome_vaga?: string;
    descricao?: string;
    salario?: string;
    modalidade?: string;
    // Adicione aqui outros campos da vaga
}

export default function DetalhesCandidatura() {
    const navigation = useNavigation();
    const route = useRoute<RouteParams>();
    const { idCandidatura, uidCandidato, uidCriadorVaga, nomeVaga, status, nomeCandidato, dataCandidatura } = route.params || {};
    const [candidatura, setCandidatura] = useState<CandidaturaDetalhada | null>(null);
    const [candidato, setCandidato] = useState<CandidatoDetalhado | null>(null);
    const [empresa, setEmpresa] = useState<EmpresaDetalhada | null>(null);
    const [vaga, setVaga] = useState<VagaDetalhada | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchDetalhes = async () => {
            setLoading(true);
            setError(null);
            try {
                if (idCandidatura) {
                    const candidaturaDoc = await getDoc(doc(db, 'applications', idCandidatura));
                    if (candidaturaDoc.exists()) {
                        setCandidatura({ id_candidatura: candidaturaDoc.id, ...candidaturaDoc.data() } as CandidaturaDetalhada);
                        if (candidaturaDoc.data()?.jobId) {
                            const vagaDoc = await getDoc(doc(db, 'Vagas-trabalho', candidaturaDoc.data().jobId));
                            if (vagaDoc.exists()) {
                                setVaga(vagaDoc.data() as VagaDetalhada);
                            } else {
                                console.warn('Vaga não encontrada:', candidaturaDoc.data().jobId);
                            }
                        }
                    } else {
                        setError('Candidatura não encontrada.');
                    }
                }

                if (uidCandidato) {
                    const candidatoDoc = await getDoc(doc(db, 'Contas', uidCandidato));
                    if (candidatoDoc.exists()) {
                        setCandidato(candidatoDoc.data() as CandidatoDetalhado);
                    } else {
                        setError('Informações do candidato não encontradas.');
                    }
                }

                if (uidCriadorVaga) {
                    const empresaDoc = await getDoc(doc(db, 'Contas', uidCriadorVaga));
                    if (empresaDoc.exists()) {
                        setEmpresa(empresaDoc.data() as EmpresaDetalhada);
                    } else {
                        setError('Informações da empresa não encontradas.');
                    }
                }
            } catch (e: any) {
                setError('Erro ao carregar detalhes: ' + e.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDetalhes();
    }, [idCandidatura, uidCandidato, uidCriadorVaga]);

    if (loading) {
        return (
            <View style={styles.container}>
                <StatusBarObject />
                <ActivityIndicator size="large" color={colors.amarelo1} />
                <Text style={styles.loadingText}>Carregando detalhes...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <StatusBarObject />
                <Text style={styles.errorText}>Erro: {error}</Text>
            </View>
        );
    }

    if (!candidatura || !candidato || !empresa) {
        return (
            <View style={styles.container}>
                <StatusBarObject />
                <Text style={styles.infoText}>Detalhes não encontrados.</Text>
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            <StatusBarObject />
            <Text style={styles.header}>Detalhes da Candidatura</Text>

            <View style={styles.detailItem}>
                <Text style={styles.label}>Vaga:</Text>
                <Text style={styles.value}>{vaga?.nome_vaga || nomeVaga}</Text>
            </View>

            <View style={styles.detailItem}>
                <Text style={styles.label}>Empresa:</Text>
                <Text style={styles.value}>{empresa.nome_empresa || 'Nome da Empresa não disponível'}</Text>
                {empresa.email && <Text style={styles.subValue}>Email: {empresa.email}</Text>}
                {empresa.cnpj && <Text style={styles.subValue}>CNPJ: {empresa.cnpj}</Text>}
                {empresa.descricao && <Text style={styles.subValue}>Descrição: {empresa.descricao}</Text>}
            </View>

            <View style={styles.detailItem}>
                <Text style={styles.label}>Candidato:</Text>
                <Text style={styles.value}>{candidato.nome_conta || nomeCandidato || 'Nome não disponível'}</Text>
                {candidato.email && <Text style={styles.subValue}>Email: {candidato.email}</Text>}
                {candidato.telefone && <Text style={styles.subValue}>Telefone: {candidato.telefone}</Text>}
                {candidato.desc_sobre && <Text style={styles.subValue}>Sobre: {candidato.desc_sobre}</Text>}
            </View>

            <View style={styles.detailItem}>
                <Text style={styles.label}>Status da Candidatura:</Text>
                <Text style={styles.value}>{status}</Text>
            </View>

            <View style={styles.detailItem}>
                <Text style={styles.label}>Data da Candidatura:</Text>
                <Text style={styles.value}>{new Date(dataCandidatura).toLocaleDateString('pt-BR')}</Text>
            </View>

            {vaga?.descricao && (
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Descrição da Vaga:</Text>
                    <Text style={styles.value}>{vaga.descricao}</Text>
                </View>
            )}

            {vaga?.salario && (
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Salário:</Text>
                    <Text style={styles.value}>{vaga.salario}</Text>
                </View>
            )}

            {vaga?.modalidade && (
                <View style={styles.detailItem}>
                    <Text style={styles.label}>Modalidade:</Text>
                    <Text style={styles.value}>{vaga.modalidade}</Text>
                </View>
            )}

        </ScrollView>
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
        marginBottom: 20,
    },
    loadingText: {
        marginTop: 10,
        color: colors.tituloBranco,
        textAlign: 'center',
    },
    errorText: {
        color: 'red',
        textAlign: 'center',
        marginTop: 20,
    },
    infoText: {
        color: colors.tituloBranco,
        textAlign: 'center',
        marginTop: 20,
    },
    detailItem: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: colors.cinza,
        paddingBottom: 10,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.amarelo2,
        marginBottom: 5,
    },
    value: {
        fontSize: 16,
        color: colors.tituloBranco,
    },
    subValue: {
        fontSize: 14,
        color: colors.tituloBranco,
        marginTop: 2,
    },
});
*/