import React, { useEffect, useState } from 'react';
import {
  View, Text, StyleSheet, Dimensions, ActivityIndicator,
  Alert, TouchableOpacity, ScrollView, FlatList, Modal
} from 'react-native';
import { collection, doc, getDocs, increment, updateDoc } from 'firebase/firestore';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { db } from '@/src/firebase/config';
import { colors } from '@/src/components/global';
import { Empresas, Freelancer, height, Users, width } from '@/src/firebase/functions/interface';
import { useRouter } from 'expo-router';
import { BotaoInicio } from '@/src/components/objects';
import { fetchEmpresas } from '@/src/firebase/functions/get/getCompany';
import { getFreelancerVagas } from '@/src/firebase/functions/get/getJobs';

export default function Others() {
  const [jobs, setJobs] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [freelancer, setFreelancer] = useState([]);
  const [filteredFreelancer, setFilteredFreelancer] = useState([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [currentJobIndex, setCurrentJobIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [abrirModal, setAbrirModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState(null);

  const router = useRouter();

  function handleAlert() {
    Alert.alert("Carrossel de vagas", "Este recurso foi feito para as pessoas que ainda não escolheram um ramo fixo e estão abertas a novas oportunidades.");
  }

  const fetchJobs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Vagas-trabalhos'));
      const jobsArray = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
      setJobs(jobsArray);
      setCurrentJobIndex(0);
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as vagas.');
    } finally {
      setLoading(false);
    }
  };

  async function handleLike() {
    if (currentJobIndex < jobs.length) {
      const job = jobs[currentJobIndex];
      Alert.alert('Gostou!', `Você curtiu a vaga: ${job.name}`);
      try {
        const jobRef = doc(db, 'Vagas-trabalho', job.id);
        await updateDoc(jobRef, {
          likes: increment(1)
        });
        nextJob();
      } catch (error) {
        console.error('Erro ao dar like:', error);
        Alert.alert('Erro', 'Não foi possível curtir a vaga.');
      }
    }
  }

  const handleDislike = () => {
    if (currentJobIndex < jobs.length) {
      const job = jobs[currentJobIndex];
      Alert.alert('Não gostou', `Você rejeitou a vaga: ${job.name}`);
      nextJob();
    }
  };

  const nextJob = () => {
    if (currentJobIndex < jobs.length - 1) {
      setCurrentJobIndex(currentJobIndex + 1);
    } else {
      Alert.alert('Fim', 'Você já viu todas as vagas disponíveis.');
    }
  };

  useEffect(() => {
    fetchJobs();
    fetchEmpresas({ setEmpresas, setFilteredEmpresas, setLoading });
    getFreelancerVagas({ setFreelancer, setFilteredFreelancer, setLoading });
  }, []);

  const renderItemEmpresa = ({ item }) => (
    <TouchableOpacity style={styles.cardEmpresa} onPress={() => { setSelectedEmpresa(item); setAbrirModal(true); }}>
      <Text style={styles.empresaTitulo}>{item.name_conta}</Text>
      <Text style={styles.empresaTexto}>{item.gmail}</Text>
      <Text style={styles.empresaTexto}>{item.setor}</Text>
    </TouchableOpacity>
  );

  const renderItemFreelancer = ({ item }) => (
    <View style={styles.cardFreelancer}>
      <Text style={styles.freelancerTitulo}>{item.name}</Text>
      <Text style={styles.freelancerTexto}>Responsável: {item.responsavel}</Text>
      <Text style={styles.freelancerTexto}>Preço: R$ {item.preco}</Text>
      <Text style={styles.freelancerTexto}>E-mail: {item.gmail}</Text>
      <Text style={styles.freelancerTexto}>Localização: {item.localizacao}</Text>
      <Text style={styles.freelancerTexto}>Competências: {item.Competencias}</Text>
      <Text style={styles.freelancerTexto}>Descrição: {item.descricao}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.amarelo2} />
        <Text style={styles.loadingText}>Carregando...</Text>
      </View>
    );
  }

  const currentJob = jobs[currentJobIndex];

  return (
    <ScrollView style={{ backgroundColor: colors.fundo }}>
      <View style={styles.container}>

        <Text style={styles.sectionTitle}>Empresas</Text>
        <FlatList
          data={filteredEmpresas}
          horizontal
          keyExtractor={item => item.id}
          renderItem={renderItemEmpresa}
        />

        <Text style={styles.sectionTitle}>Carrossel de Vagas</Text>
        <TouchableOpacity onPress={handleAlert} style={styles.infoIcon}>
          <MaterialCommunityIcons name="information-outline" size={30} color="white" />
        </TouchableOpacity>

        {currentJob && (
          <View style={styles.cardVaga}>
            <Text style={styles.cardTitle}>{currentJob.name_vaga}</Text>
            <Text style={styles.cardText}>{currentJob.empresa}</Text>
            <Text style={styles.cardText}>Local: {currentJob.localizacao}</Text>
            <Text style={styles.cardText}>Modalidade: {currentJob.modalidades}</Text>
            <Text style={styles.cardText}>Salário: R$ {currentJob.salario}</Text>
            <View style={styles.cardButtons}>
              <TouchableOpacity style={styles.buttonDislike} onPress={handleDislike}>
                <Ionicons name="arrow-back" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonInfo} onPress={() => setAbrirModal(true)}>
                <MaterialCommunityIcons name="information-outline" size={24} color="white" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.buttonLike} onPress={handleLike}>
                <Ionicons name="arrow-forward" size={24} color="white" />
              </TouchableOpacity>
            </View>
          </View>
        )}

        <Text style={styles.sectionTitle}>Serviços Freelancer</Text>
        <FlatList
          data={filteredFreelancer}
          keyExtractor={item => item.id}
          renderItem={renderItemFreelancer}
          scrollEnabled={false}
        />

        <Modal visible={abrirModal} animationType="slide" transparent={true} onRequestClose={() => setAbrirModal(false)}>
          <View style={styles.modalContainer}>
            {currentJob && (
              <View style={styles.modalContent}>
                <Text style={styles.modalTitle}>{currentJob.name_vaga}</Text>
                <Text style={styles.modalText}>Empresa: {currentJob.empresa}</Text>
                <Text style={styles.modalText}>Salário: R$ {currentJob.salario}</Text>
                <Text style={styles.modalText}>Contato: {currentJob.gmail}</Text>
                <Text style={styles.modalText}>Localização: {currentJob.localizacao}</Text>
                <Text style={styles.modalText}>Modalidade: {currentJob.modalidades}</Text>
                <Text style={styles.modalText}>Setor: {currentJob.setor}</Text>
                <Text style={styles.modalText}>Descrição: {currentJob.descricao}</Text>
              </View>
            )}
            <BotaoInicio onPress={() => setAbrirModal(false)}>
              <Text style={styles.closeButtonText}>Fechar</Text>
            </BotaoInicio>
          </View>
        </Modal>

      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingBottom: 80,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.tituloAmarelo,
    marginTop: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.fundo,
  },
  loadingText: {
    color: colors.tituloBranco,
    marginTop: 10,
  },
  cardEmpresa: {
    width: 180,
    backgroundColor: colors.cinza,
    borderRadius: 12,
    padding: 10,
    marginRight: 10,
    marginTop: 10,
  },
  empresaTitulo: {
    color: colors.tituloBranco,
    fontSize: 20,
    fontWeight: 'bold',
  },
  empresaTexto: {
    color: colors.tituloBranco,
    fontSize: 14,
  },
  cardFreelancer: {
    backgroundColor: colors.cinza,
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
  },
  freelancerTitulo: {
    color: colors.tituloAmarelo,
    fontSize: 20,
    fontWeight: 'bold',
  },
  freelancerTexto: {
    color: colors.tituloBranco,
    fontSize: 14,
  },
  cardVaga: {
    backgroundColor: colors.cinza,
    padding: 16,
    borderRadius: 12,
    marginVertical: 15,
  },
  cardTitle: {
    fontSize: 22,
    color: colors.tituloAmarelo,
    fontWeight: 'bold',
  },
  cardText: {
    color: colors.tituloBranco,
    marginTop: 4,
  },
  cardButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 15,
  },
  buttonLike: {
    backgroundColor: 'green',
    padding: 10,
    borderRadius: 30,
  },
  buttonDislike: {
    backgroundColor: 'red',
    padding: 10,
    borderRadius: 30,
  },
  buttonInfo: {
    backgroundColor: colors.amarelo2,
    padding: 10,
    borderRadius: 30,
  },
  modalContainer: {
    backgroundColor: colors.cinza,
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  modalContent: {
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 24,
    color: colors.tituloAmarelo,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: colors.tituloBranco,
    marginBottom: 6,
  },
  closeButtonText: {
    fontSize: 18,
    color: colors.tituloBranco,
    textAlign: 'center',
    marginTop: 10,
  },
  infoIcon: {
    alignSelf: 'flex-end',
    marginRight: 10,
  }
});