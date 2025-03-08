import { collection, getDocs, limit, query } from "firebase/firestore";
import { db } from "./../../config";

interface Vagas {
  criadorId: string;
}

export const getVagas = async (DadosJobs: any) => {
    const {setJobs, setFilteredJobs, setLoading} =  DadosJobs;

    try {
        const q = query(
        collection(db, "Vagas-trabalhos"),
        limit(3) // Limita a 2 resultados
        );
        const querySnapshot = await getDocs(q);
        const jobsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        }));
        setJobs(jobsArray);
        setFilteredJobs(jobsArray); // Inicializa com todos os dados
    } catch (error) {
        console.error("Erro ao buscar as vagas:", error);
    } finally {
        setLoading(false);
    }
};