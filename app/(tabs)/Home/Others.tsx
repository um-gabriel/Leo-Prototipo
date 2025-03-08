import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, ActivityIndicator,
          Alert, TouchableOpacity, ScrollView, FlatList, 
          Modal
} from 'react-native';
import { collection, doc, getDocs, increment, limit, query, updateDoc, where } from 'firebase/firestore';
import {  Ionicons, MaterialCommunityIcons } from '@expo/vector-icons'; 
import { db } from '@/src/firebase/config';
import { colors } from '@/src/components/global';
import { Empresas, Freelancer, height, Users, width } from '@/src/firebase/functions/interface';
import { useRouter } from 'expo-router';
import { BotãoInicio } from '@/src/components/objects';
import { fetchEmpresas } from '@/src/firebase/functions/get/getCompany';
import { getFreelancerVagas } from '@/src/firebase/functions/get/getJobs';


export default function Others() {
  const [jobs, setJobs] = useState([]);
  const [empresas, setEmpresas] = useState([]);
  const [freelancer, setFreelancer] = useState([]);
  const [filteredFreelancer, setFilteredFreelancer] = useState([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [currentJobIndex, setCurrentJobIndex] = useState(0); // Índice do cartão atual
  const [loading, setLoading] = useState(true);
  const [abrirModal, setAbrirModal] = useState(false);
  const [selectedEmpresa, setSelectedEmpresa] = useState<Empresas | null>(null);

  const router = useRouter()

  function handleAlert() {
    Alert.alert("Carrosel de vagas", "Este recurso foi feito para as pessoas a qual ainda não escolheram um ramo a seguir fixamente, e estão dispostas a observar vagas ao acaso.")
  }

  // Função para buscar vagas do Firestore
  const fetchJobs = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, 'Vagas-trabalhos'));
      const jobsArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setJobs(jobsArray); // Atualiza o estado com todas as vagas
      setCurrentJobIndex(0); // Inicia no primeiro trabalho
    } catch (error) {
      console.error('Erro ao buscar vagas:', error);
      Alert.alert('Erro', 'Não foi possível carregar as vagas.');
    } finally {
      setLoading(false);
    }
  };
  // Função chamada ao gostar da vaga
  async function handleLike() {
    if (currentJobIndex < jobs.length) {
      const job = jobs[currentJobIndex];
      console.log('Gostou da vaga:', job);
      Alert.alert('Gostou!', `Você curtiu a vaga: ${job.name}`);
      try {
        const jobRef = doc(db, 'Vagas-trabalho', job.id);
        await updateDoc(jobRef, {
          likes: increment(1) // Aumenta o número de likes no Firestore
        });
  
        console.log('Vaga curtida:', job);
        nextJob(); // Vai para o próximo cartão
      } catch (error) {
        console.error('Erro ao dar like:', error);
        Alert.alert('Erro', 'Não foi possível curtir a vaga.');
      }
      nextJob(); // Vai para o próximo cartão
    }
  };
  // Função chamada ao não gostar da vaga
  const handleDislike = () => {
    if (currentJobIndex < jobs.length) {
      const job = jobs[currentJobIndex];
      console.log('Não gostou da vaga:', job);
      Alert.alert('Não gostou', `Você rejeitou a vaga: ${job.name}`);
      nextJob(); // Vai para o próximo cartão
    }
  };
  // Função para ir para o próximo cartão
  const nextJob = () => {
    if (currentJobIndex < jobs.length - 1) {
      setCurrentJobIndex(currentJobIndex + 1);
    } else {
      Alert.alert('Fim', 'Você já viu todas as vagas disponíveis.');
    }
  };

  // Carregar as vagas ao iniciar
  useEffect(() => {

    fetchJobs();
    const fetchEmpresasData = {setEmpresas, setFilteredEmpresas, setLoading} 
    fetchEmpresas(fetchEmpresasData)
    const DadosFreelancer = {setFreelancer, setFilteredFreelancer, setLoading}
    getFreelancerVagas(DadosFreelancer)

  }, []);

  const renderItem = ({ item } : {item: Empresas}) => (
      <View style={styles.BoxContainerEmpresas}>
          <TouchableOpacity onPress={() => {
              setSelectedEmpresa(item);
              setAbrirModal(true);
          }}>
              <Text style={styles.BoxContainerEmpresas_Title}>{item.name_conta}</Text>
              <Text style={styles.BoxContainerEmpresas_text}>{item.gmail}</Text>
              <Text style={styles.BoxContainerEmpresas_text}>{item.setor}</Text>
          </TouchableOpacity>
      </View>
  );

  // Função para renderizar cada item da lista de freelancers
  const renderItemFreelancer = ({ item }: { item: Freelancer }) => (
    <View style={stylesVagas.item}>
      <View style={{maxWidth: "100%"}}>
      <Text style={stylesVagas.title}>{item.name}</Text>
      <Text style={stylesVagas.text}>Responsável: {item.responsavel}</Text>
      <Text style={stylesVagas.text}>Preço: R$ {item.preco}</Text>
      <Text style={stylesVagas.text}>E-mail: {item.gmail}</Text>
      <Text style={stylesVagas.text}>Localização: {item.localizacao}</Text>
      <Text style={stylesVagas.text}>Competências: {item.Competencias}</Text>
      <Text style={stylesVagas.text}>Descrição: {item.descricao}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={card.loadingContainer}>
        <ActivityIndicator size="large" color={colors.amarelo2} />
        <Text style={{color: colors.tituloBranco}}>Carregando vagas...</Text>
      </View>
    );
  };
  if (jobs.length === 0) {
    return <Text style={card.noJobs}>Nenhuma vaga disponível</Text>;
  };

  const currentJob = jobs[currentJobIndex];

  return (
    <View style={card.container}>
      <ScrollView showsVerticalScrollIndicator={false}>

        <View style={styles.AreaContainerEmpresas}>  

            <Text style={styles.AreaContainerEmpresas_Title}>Empresas</Text>
            <ScrollView  showsHorizontalScrollIndicator={false}>
              <TouchableOpacity onPress={() => setAbrirModal(true)}>
                    <FlatList
                      data={filteredEmpresas}
                      keyExtractor={(item) => item.id}
                      renderItem={renderItem}
                      horizontal={true}
                      scrollEnabled={false} // Previne conflitos de rolagem com o ScrollView
                    />
              </TouchableOpacity>
            </ScrollView>
        </View>

        <View style={card.ViewCard}>

        <Text style={card.ViewCard_title}>Carrosel de vagas</Text>  
          <View style={card.ViewCard_areaText}>
            <Text style={card.ViewCard_areaText_subTitle}>Veja vagas aleatoriamente</Text>  
            <TouchableOpacity onPress={ handleAlert} >
              <MaterialCommunityIcons name="information-outline" size={30} color="white"
              style={{top: -5}} 
              />
            </TouchableOpacity>        
          </View>
        <View style={card.card}>
          <Text style={card.title}>{currentJob.name_vaga}</Text>
          <Text style={card.description}>{currentJob.empresa}</Text>
          <View style={card.box_mode}>
              <Text style={card.mode}>Modalidades:</Text>
              <Text style={card.mode}>{currentJob.modalidades}</Text>
          </View>
          <View style={card.box_mode}>
              <Text style={card.mode}>Localização:</Text>
              <Text style={card.mode}>{currentJob.localizacao}</Text>
          </View>
          <View style={card.box_mode}>
              <Text style={card.mode}>Salario: R$</Text>
              <Text style={card.mode}>{currentJob.salario}</Text>
          </View>
        //    Botões para controle 
        <View style={card.buttonsContainer}>
          <TouchableOpacity
            style={[card.button, card.dislikeButton]}
            onPress={handleDislike} // Não gostou
          >
            <Ionicons name="arrow-back" size={30} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[card.button]}
            onPress={() => setAbrirModal(true)}
            // INFROMAÇÕES DA VAGA
          >
            <Modal
              visible={abrirModal}
              onRequestClose={() => setAbrirModal(false)} 
              animationType="slide"
              transparent={true}
            >
              <View style={stylesModal.modalContainer}>
                {currentJob && (
                    <View style={stylesModal.modalContent}>

                      <View style={stylesModal.modalContent_topArea}>
                        <Text style={stylesModal.modalTitle}>{currentJob.name_vaga}</Text>
                        <Text style={stylesModal.modalSubTitle}>Empresa: {currentJob.empresa}</Text>
                      </View>modalTitle
                      <View style={stylesModal.modalContent_MediaArea}>
                        <Text style={stylesModal.modalText}>Salario: 
                          <Text style={stylesModal.modal_subtext}> R$ {currentJob.salario}</Text>
                        </Text>
                        <Text style={stylesModal.modalText}>Contato: 
                          <Text style={stylesModal.modal_subtext}> {currentJob.gmail}</Text>
                        </Text>
                        <Text style={stylesModal.modalText}>Localização: 
                          <Text style={stylesModal.modal_subtext}> {currentJob.localizacao}</Text>
                        </Text>
                        <Text style={stylesModal.modalText}>Modalidades: 
                          <Text style={stylesModal.modal_subtext}> {currentJob.modalidades}</Text>
                        </Text>
                        <Text style={stylesModal.modalText}>Setor da vaga: 
                          <Text style={stylesModal.modal_subtext}> {currentJob.setor}</Text>
                        </Text>
                        <Text style={stylesModal.modalText}>Descrição: 
                          <Text style={stylesModal.modal_subtext}> {currentJob.descricao}</Text>
                        </Text>
                      </View>
                    </View>
                )}
                <View style={stylesModal.button}>
                    <BotãoInicio onPress={() => setAbrirModal(false)} >
                        <Text style={stylesModal.closeButtonText}>Fechar</Text>
                    </BotãoInicio>
                </View>
              </View>
            </Modal>

            <MaterialCommunityIcons name="information-outline" size={45} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            style={[card.button, card.likeButton]}
            onPress={handleLike} // Gostou
          >
            <Ionicons name="arrow-forward" size={30} color="white" />
          </TouchableOpacity>
        </View>
        </View>
        </View> 

        <View style={stylesVagas.ViewFree}>
            <View style={stylesVagas.AreaTitle}>
                <Text style={stylesVagas.Title}>Serviços Freelancer</Text>
                <Text style={stylesVagas.subTitle}>Serviços disponiveis para requicição</Text>
            </View>

                  {loading ? (
                    <ActivityIndicator size="large" color={colors.amarelo1} />
                  ) : (
                    <FlatList
                      data={filteredFreelancer}
                      keyExtractor={(item) => item.id}
                      renderItem={renderItemFreelancer}
                      scrollEnabled={false} // Previne conflitos de rolagem com o ScrollView
                    />
                  )}
        </View>
        {/* <View style={stylesVagas.areaButtons}>
          <TouchableOpacity style={stylesVagas.button} onPress={() => router.replace("/(tabs)/vagas/CLT")}>
            <Text style={{color: colors.tituloBranco, fontSize: 18}}>CLT</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[stylesVagas.button, stylesVagas.red]} onPress={() => router.replace('/(tabs)/vagas/Freelancer')}>
            <Text style={{color: colors.tituloBranco, fontSize: 18}}>Freelancer</Text>
          </TouchableOpacity>
        </View>
        <View style={stylesVagas.areaButtons}>
          <TouchableOpacity style={stylesVagas.button} onPress={() => router.replace("/(tabs)/avisos/avisos")}>
            <Text style={{color: colors.tituloBranco, fontSize: 18}}>Avisos</Text>
          </TouchableOpacity>
        </View>   */}
      

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  AreaContainerEmpresas: {
    width: width * 1,
    minHeight: 140,
    alignItems: "center",
    marginTop: 15,
    justifyContent: "center"
  },
  AreaContainerEmpresas_Title:{    
    fontSize: 35,
    fontWeight: '900',
    color: colors.tituloAmarelo,
    marginBottom: 10
  },
  BoxContainerEmpresas: {
    width: 190,
    height: 120,
    backgroundColor: colors.cinza,
    borderRadius: 20,
    marginLeft: 10,
    padding: 10,
    alignItems: "center",
  },
  BoxContainerEmpresas_Title: {    
    fontSize: 22,
    fontWeight: 'bold',
    color: colors.tituloBranco,
    marginTop: 7,
    textAlign: 'center',
  },
  BoxContainerEmpresas_text: {
    fontSize: 14,
    textAlign: 'center',
    color: colors.tituloBranco,
    marginTop: 1,
  },
})
const card = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ViewCard: {
    width: "100%",
    maxHeight: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 40,
  },
  ViewCard_areaText: {
    width: width * 0.9,
    padding: 10,
    justifyContent: "space-between",
    flexDirection: "row",
    paddingHorizontal: 40,
  },  
  ViewCard_title: {
    fontSize: 35,
    fontWeight: '900',
    color: colors.tituloAmarelo,
  },
  ViewCard_areaText_subTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.cinza2,
  },
  card: {
    width: width * 0.9,
    maxHeight: height * 0.57,
    borderRadius: 20,
    backgroundColor: colors.cinza,
    shadowColor: '#000',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 4,
    padding: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: colors.tituloAmarelo,
    marginTop: 7,
  },
  description: {
    fontSize: 20,
    color: colors.cinza2,
    marginBottom: 15,
  },
  box_mode: {
    width: '80%',
    minHeight: 35,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  mode: {
    fontSize: 18,
    color: colors.tituloBranco,
  },
  loadingContainer: {
    width: width * 1,
    backgroundColor: colors.fundo,
    height: height * 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noJobs: {
    fontSize: 18,
    color: '#555',
    textAlign: 'center',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
    marginBottom: 10,
    width: width * 0.6,
  },
  button: {
    width: 45,
    height: 45,
    borderRadius: 35,
    justifyContent: 'center',
    alignItems: 'center',
  },
  dislikeButton: {
    backgroundColor: 'red',
  },
  likeButton: {
    backgroundColor: 'green',
  },
});

const stylesVagas = StyleSheet.create({
  ViewFree: {
    flex: 1,
    alignItems: 'center',
    padding: 30,
    marginTop: 10,
    justifyContent: 'center',
  },
  AreaTitle: {
    width: "100%",
    height: 80,
    //backgroundColor: "red",
    alignItems: 'center'
  },
  Title: {
    fontSize: 35,
    fontWeight: '900',
    color: colors.tituloAmarelo,
  },
  subTitle: {
    color: colors.cinza2,
    fontSize: 18,
    marginTop: 4
  },
  item: {
    padding: 7,
    paddingTop: 10,
    paddingBottom: 14,
    maxWidth: width * 1,
    backgroundColor: colors.cinza,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    marginTop: 20,
    alignItems: "flex-start",
    justifyContent: "space-evenly",
  },
  title: {
    fontSize: 30,
    marginBottom: 2,
    marginLeft: 15,
    fontWeight: 'bold',
    color: colors.tituloAmarelo,
  },
  text: {
    fontSize: 16,
    maxWidth: width * 0.85,
    marginLeft: 15,
    color: colors.tituloBranco,
  },

  areaButtons: {
    width: width * 1,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginBottom: 80,
    //backgroundColor: "white"
  },
  button: {
    width: width * 0.4,
    height: 60,
    backgroundColor: colors.amarelo1,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    color: colors.tituloBranco,
    flexDirection: "row",
  },
  red: {
    backgroundColor: "red",
  }
});
const stylesModal = StyleSheet.create({
  modalContainer: {
    alignItems: "center",
    backgroundColor: colors.cinza,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    height: "70%",
    width: "100%",
    position: "absolute",
    bottom: 0,
    padding: 20,
  },
  modalContent: {
    width: "100%",
    alignItems: "center",
  },
  modalContent_topArea: {
    width: '100%',
    minHeight: 80,
    justifyContent: 'space-between',
    //backgroundColor: 'red',
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 40,
    fontWeight: "bold",
    color: colors.tituloAmarelo,
  },
  modalSubTitle: {
    fontSize: 25,
    fontWeight: '500',
    color: colors.tituloBranco,
  },
  modalContent_MediaArea: {
    maxWidth: '100%',
    minHeight: 200,
    justifyContent: 'space-between',
    //backgroundColor: 'red',
    marginTop: 20,
    textAlign: 'justify'
  },
  modalText: {
    fontSize: 20,
    color: colors.tituloBranco,
    marginBottom: 10,
  },
  modal_subtext: {
    color: colors.cinza2,
  },
  button: {
    width: width * 0.9,
    marginTop: 20,
    marginLeft: 60,
  },
  closeButton: {
    backgroundColor: colors.amarelo1,
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  closeButtonText: {
    color: colors.tituloBranco,
    fontSize: 16,
    fontWeight: "bold",
  },

})

