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
    id_candidatura: string;
    uid_candidato: string;
    uid_criadorVaga: string;
    nome_vaga: string;
    status: string;
    nome_candidato: string;
    dataCandidatura: Date;
}

export interface CandidaturaError {
    code: string;
    message: string;
    details?: any;
}


export const { width, height } = Dimensions.get('window');


export const verification = () => {
    const user = auth.currentUser ; // Obtém o usuário atual

    if (!user) {
        console.log("Usuário não logado");
        return {
            isAuthenticated: false,
            uid: null,
            email: null,
            name_conta: null,
            tipo_conta: null,
        };
    }

    return {
        isAuthenticated: true,
        uid: user.uid,
        email: user.email,
        name_conta: user.displayName || null, // Use displayName se disponível
    };
};