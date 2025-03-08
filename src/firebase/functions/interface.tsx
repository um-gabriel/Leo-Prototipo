import { Dimensions } from "react-native";
import { auth, db } from "../config";
import { doc, getDoc } from "firebase/firestore";

export interface Users {
    id?: string,
    uid: string,
    gmail: string,
    password: string,
    name_conta: string,
    tipo_conta: string,
}
export interface Empresas {
    id?: string,
    uid: string,
    gmail: string,
    name_conta: string,
    password: string,
    setor: string,
    descricao: string,
    cnpj: number,
    tipo_conta: string,
}

export interface Vagas {
    vaga_id: string,
    name_vaga: string,
    uid_criadorVaga: string,
    candidato_id: string,
    salario: number,
    gmail: string,
    empresa: string,
    modalidades: string,
    localizacao: string,
    descricao: string,
    setor: string,
    createdAt: Date,
};

export interface Freelancer {
    name: string;
    descricao: string;
    Competencias: string;
    localizacao: string;
    responsavel: string;
    preco: string; // ou number, dependendo de como você armazena
    gmail: string;
};

export interface CandidaturaVaga {
    id_candidatura: string,
    vaga_id: string;
    vaga_name: string;
    candidatoId: string;
    candidato_name: string,
    criadorId: string;
    dataCandidatura: string;
    status: 'pendente' | 'aprovado' | 'rejeitado';
};

export interface CandidaturaError {
    code: string;
    message: string;
    details?: any;
}

export const handleCandidaturaError = (error: any): CandidaturaError => {
    if (error.code) {
        switch (error.code) {
            case 'already-applied':
                return {
                    code: 'already-applied',
                    message: 'Você já se candidatou para esta vaga'
                };
            case 'permission-denied':
                return {
                    code: 'permission-denied',
                    message: 'Você não tem permissão para se candidatar a esta vaga'
                };
            default:
                return {
                    code: 'unknown',
                    message: 'Ocorreu um erro ao processar sua candidatura. Tente novamente.',
                    details: error
                };
        }
    }
    return {
        code: 'unknown',
        message: 'Erro inesperado ao realizar candidatura',
        details: error
    };
};

export const { width, height } = Dimensions.get('window');


export const verification = () => {
    const user = auth.currentUser;
    if (!user) {
        console.log("Usuário não logado");
        return {
            isAuthenticated: false,
            uid: null,
            email: null,
            tipo_conta: null
        };
    }
    return {
        isAuthenticated: true,
        uid: user.uid,
        email: user.email,
        name_conta: user.name_conta,
    };
}

export const verification_tipo_conta = async () => {
    const { isAuthenticated, uid } = verification();
    if (!isAuthenticated) {
        return {
            isAuthenticated: false,
            tipo_conta: null,
            userData: null
        };
    }

    try {
        const userDoc = await getDoc(doc(db, 'Contas', uid));
        if (!userDoc.exists()) {
            return {
                isAuthenticated: true,
                tipo_conta: null,
                userData: null
            };
        }
        const userData = userDoc.data();
        return {
            isAuthenticated: true,
            tipo_conta: userData.tipo_conta,
            userData: userData
        };
        
    } catch (error) {
        console.error("Erro ao buscar tipo de conta:", error);
        return {
            isAuthenticated: true,
            tipo_conta: null,
            userData: null,
            error
        };
    }

}