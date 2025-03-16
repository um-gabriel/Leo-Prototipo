// CRIAR CANDIDATURAS

import { addDoc, collection } from "firebase/firestore";
import { Alert } from "react-native";
import { router } from "expo-router";
import { db } from "../../config";

export async function handleAddVagaCLT({ userId, uidCriadorVaga, nome_vaga, nome_candidato, setLoading }) {
    try {
        setLoading(true);
        
        // Estruture o objeto com os dados da candidatura
        const newCandidatura = {
            userId: userId, // UID do usuário que está se candidatando
            // vagaId: vagaId, // ID da vaga
            uidCriadorVaga: uidCriadorVaga, // UID do criador da vaga

            nome_vaga: nome_vaga,
            nome_candidato: nome_candidato,
            createdAt: new Date(), // Data da candidatura
        };
        console.log(newCandidatura)
        // Adiciona a nova candidatura à coleção "Candidaturas"
        await addDoc(collection(db, 'candidaturas'), newCandidatura);
        Alert.alert('Concluído!', 'Candidatura enviada com sucesso!');
        router.replace('/(tabs)/Home/Home'); // Redireciona para a página inicial

    } catch (error) {
        Alert.alert('Erro ao adicionar documento', 'Tente novamente mais tarde.');
        console.error('Erro ao adicionar documento:', error);
    } finally {
        setLoading(false);
    }
}