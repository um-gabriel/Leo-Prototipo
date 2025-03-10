import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { colors } from '@/src/components/global';
import { BotãoInicio } from '@/src/components/objects';
import { useRouter } from 'expo-router';
import { height, Vagas, width } from '@/src/firebase/functions/interface';
import { Feather, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { getVagas } from '@/src/firebase/functions/get/getJobs';


export default function Home() {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  
  //Essa função ela envia atraves das telas "router.push" os valores q vc selecionou ao clicar na box
  const boxSetores = (coleção: any, campo: any, valor: any) => {
    router.push(`../Geral?coleção=${coleção}&campo=${campo}&valor=${valor}`); // Passa ambos os valores como parâmetros
  };
  const CriarVagas = (coleçãoUnica: any) => {
    router.push(`../Geral?coleção=${coleçãoUnica}`);
  };

  useEffect(() => {
    const DadosJobs = {setJobs, setFilteredJobs, setLoading }
    getVagas(DadosJobs);
  }, []);
  
  // CONST DOS ITEMS DAS VAGAS
  const renderItem = ({ item }: {item: Vagas}) => {
    return (
      <View style={stylesVagas.item}>
        <Text style={stylesVagas.title}>{item.name_vaga}</Text>
        <Text style={stylesVagas.subTitle}>{item.empresa}</Text>
        <View style={stylesVagas.box_mode}>
            <Text style={stylesVagas.mode}>Salario: R$</Text>
            <Text style={stylesVagas.mode}>{item.salario}</Text>
        </View>
        <View style={stylesVagas.box_mode}>
            <Text style={stylesVagas.mode}>Modalidades: R$</Text>
            <Text style={stylesVagas.mode}> {item.modalidades}</Text>
        </View>    
        <View style={stylesVagas.box_mode}>
            <Text style={stylesVagas.mode}>Contato:</Text>
            <Text style={stylesVagas.mode}>{item.gmail}</Text>
        </View>
        <View style={stylesVagas.box_mode}>
            <Text style={stylesVagas.mode}>Loclização:</Text>
            <Text style={stylesVagas.mode}> {item.localizacao}</Text>
        </View>   
        <TouchableOpacity 
          style={stylesVagas.buttonCandidatar}
          // onPress={() => handleCandidatura(item)}      
        >
          <Text style={stylesVagas.buttonText}>Candidatar-se</Text>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.scrollArea}>

        <View style={styles.AreaTop}>
          <View style={styles.AreaTop_container}>
              <Text style={styles.AreaTop_Title}>Go 2 Work</Text>
              <Text style={styles.AreaTop_subTitle}>Encontre uma experiençia que pode mudar sua vida bem aqui.</Text>
          </View>
        </View>
        
        <View style={styles.containerBoxs}> //Area de box para setores
            <View style={styles.containerBoxs_Areas}> //Generos de vagas
            <Text style={styles.SubTitle}>Areas de vagas</Text>
            <View style={styles.AreaContainerEmpresas}>

              <ScrollView  showsVerticalScrollIndicator={false}>
                  <TouchableOpacity style={styles.BoxContainerEmpresas} onPress={
                    //Ao clicar no box, vc envia a função boxSetores um 3 valores para servir na busca da pesquisa q vc clicou
                    () => boxSetores('Vagas-trabalho', 'setor', 'Saude')
                  } >
                    <View style={styles.boxImage}>
                        <MaterialIcons name="health-and-safety" size={27} color={colors.amarelo2} />
                    </View>
                    <Text style={styles.BoxContainerEmpresas_text}>Saúde</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.BoxContainerEmpresas} onPress={() => boxSetores('Vagas-trabalho', 'setor', 'Magia e produção')}  >
                    <View style={styles.boxImage}>
                        <MaterialIcons name="computer" size={27} color={colors.amarelo2} />
                    </View>
                    <Text style={styles.BoxContainerEmpresas_text}>TI</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.BoxContainerEmpresas} onPress={() => boxSetores('Vagas-trabalho', 'setor', 'Engenharia')} >
                    <View style={styles.boxImage}>
                        <FontAwesome6 name="house-chimney" size={22} color={colors.amarelo2} />
                    </View>
                    <Text style={styles.BoxContainerEmpresas_text}>Engenharia</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.BoxContainerEmpresas} onPress={() => boxSetores('Vagas-trabalho', 'setor', 'Educacao')} >
                    <View style={styles.boxImage}>
                        <Feather name="book" size={24} color={colors.amarelo2} />
                    </View>
                    <Text style={styles.BoxContainerEmpresas_text}>Educação</Text>
                  </TouchableOpacity>
              </ScrollView>
            </View>
            </View>

            <View style={styles.BoxContainer}>
              <View style={styles.FlatListBox}> //VAGAS DE EMPREGO
                  <Text style={styles.SubTitle}>Vagas de emprego</Text>
                  {loading ? (
                    <ActivityIndicator size="large" color={colors.amarelo1} />
                  ) : (
                    <FlatList
                      data={filteredJobs}
                      keyExtractor={(item) => item.id}
                      renderItem={renderItem}
                      scrollEnabled={false} // Previne conflitos de rolagem com o ScrollView
                    />
                  )}
              </View>
              <View style={styles.areaButton}>  //BOTÃO DE VER MAIS
                  <BotãoInicio onPress={() => CriarVagas('Vagas-trabalho')} > 
                      <Text style={styles.TextButton}>Clique aqui para ver mais</Text>
                  </BotãoInicio>
              </View>
            </View>

            <View style={styles.BoxContainer}> //SEGUNDA PARTE DE VAGAS
              <View style={styles.FlatListBox}>
                  <Text style={styles.SubTitle}>Vagas de relacionadas a tecnologia:</Text>
                  {loading ? (
                    <ActivityIndicator size="large" color={colors.amarelo1} />
                  ) : (
                    <FlatList
                      data={filteredJobs}
                      keyExtractor={(item) => item.id}
                      renderItem={renderItem}
                      scrollEnabled={false} // Previne conflitos de rolagem com o ScrollView
                    />
                  )}
              </View>
              <View style={styles.areaButton}>
                  <BotãoInicio onPress={() => CriarVagas('Vagas-trabalho')} >
                      <Text style={styles.TextButton}>Clique aqui para ver mais</Text>
                  </BotãoInicio>
              </View>
            </View>
          
            <View style={styles.fim}></View>

        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
    alignItems: 'center',
  },
  scrollArea: {
    flex: 1,
  },
  //TOP AREA
  AreaTop:{
    width: width * 1,
    borderBottomLeftRadius: 50,
    borderBottomRightRadius: 50,
    height: height * 0.17,
    backgroundColor: colors.fundo2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  AreaTop_container: {
    maxWidth: width * 0.9,
    alignItems: 'center',
    justifyContent: 'center',
  },
  AreaTop_Title: {
    fontSize: 40,
    marginBottom: 5,
    color: colors.amarelo2,
    fontWeight: '600'
  },
  AreaTop_subTitle: {
    fontSize: 15,
    textAlign: 'center',
    color: colors.tituloBranco,
  },

  //OUTROS ELEMENTOS
  containerBoxs: {
    padding: 15,
    width: width * 1,
    alignItems: 'center'
  },
  BoxContainer: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  containerBoxs_Areas: {
    width: '94%',
    minHeight: 120,
    backgroundColor: colors.fundo,
    alignItems: 'center',
  },
  SubTitle: {
    fontSize: 25,
    marginTop: 15,
    marginBottom: 10,
    fontWeight: 'bold',
    color: colors.tituloBranco,
  },
  AreaContainerEmpresas: {
    width: "100%",
    minHeight: 270,
    alignItems: 'center',
    backgroundColor: colors.cinza,
    marginTop: 10,
    borderRadius: 30,
  },
  BoxContainerEmpresas: {
    width: '100%',
    height: 70,
    flexDirection: 'row',
    alignItems: "center",
  },
  BoxContainerEmpresas_text: {
    fontSize: 22,
    marginRight: 130,
    left: 20,
    color: colors.tituloBranco,
  },
  boxImage: {
    width: 50,
    backgroundColor: colors.fundo,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    borderRadius: 100,
  },
  FlatListBox: {
    width: "100%",
    marginTop: 20,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: 'center'
  },

  //BOTÃO VER MAIS
  areaButton: {
    width: '100%',
    height: 80,
    top: -10,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: colors.cinza,
  },
  TextButton: {
    fontSize: 17,
    color: colors.tituloBranco,
    right: 10
  },
  fim: {
    width: width * 1,
    height: 100
  }
});

//VAGAS STYLES
const stylesVagas = StyleSheet.create({ 
  item: {
    width: width * 0.9,
    padding: 12,
    paddingBottom: 14,
    marginVertical: 8,
    backgroundColor: colors.cinza,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center'
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: colors.tituloBranco,
  },
  subTitle: {
    fontSize: 21,
    marginBottom: 10,
    color: colors.tituloAmarelo,
  },
  text: {
    fontSize: 16,
    marginBottom: 2,
    color: colors.tituloBranco,
  },
  box_mode: {
    width: '90%',
    minHeight: 28,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
  mode: {
    fontSize: 18,
    color: colors.tituloBranco,
  },

  buttonCandidatar: {
    backgroundColor: colors.amarelo2,
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    width: '70%',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.tituloBranco,
    fontSize: 16,
    //fontWeight: 'bold',
  },
});
