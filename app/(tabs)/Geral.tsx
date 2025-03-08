import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput,  ScrollView } from 'react-native';
import { colors } from '@/src/components/global';
import { useGlobalSearchParams } from 'expo-router';
import { height, Vagas, width } from '@/src/firebase/functions/interface';
import { fetchJobs_Geral } from '@/src/firebase/functions/get/getJobs';

export default function Geral() {
  const { coleção, campo, valor, coleçãoUnica } = useGlobalSearchParams(); // Obtém o valor passado da tela anterior Home
  const dataBox = {coleção, campo, valor}
  const dataBox2 = {coleçãoUnica}

  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const valueData = {setJobs, setFilteredJobs, setLoading }
    fetchJobs_Geral(valueData, dataBox, dataBox2); //Envia a função os valores que vc ecolheu na home como parametros
  }, []);

  useEffect(() => {
    if (searchQuery === '') {
      setFilteredJobs(filteredJobs);
    } else {
      const filtered = jobs.filter(job =>
        (job.name && job.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (job.empresa && job.empresa.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredJobs(filteredJobs);
    }
  }, [searchQuery, jobs]);

  const renderItem = ({ item }: {item: Vagas}) => {
    console.log('Item da lista:', item); // Debug para ver os dados que estão chegando
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
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">

       <View style={styles.containerTop}>
          <TextInput
            style={styles.searchBar}
            placeholder="Buscar vagas..."
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={(text) => setSearchQuery(text)}
          />
          <Text style={styles.titleTop}> {campo} {valor}</Text>
      </View>

      <View style={styles.containerBottom}>
        
               {loading ? (
                 <ActivityIndicator size="large" color={colors.amarelo1} />
               ) : (
                 <FlatList
                   data={filteredJobs}
                   keyExtractor={(item) => item.id}
                   renderItem={renderItem}
                   nestedScrollEnabled={true} // Permite rolar dentro do ScrollView
                   showsVerticalScrollIndicator={false}
                 />
               )}
      </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,

  },
  containerTop: {
    width: width * 1,
    height: 110,
    padding: 20,
    justifyContent: 'space-around',
    textAlign: "center",
    // backgroundColor: "red"
  },
  containerBottom: {
    padding: 20,
    width: width * 1,
    height: height * 0.86,
    //backgroundColor: "red"
  },
  titleTop :{
    color: colors.tituloBranco,
    fontSize: 25,
    marginLeft: 130,
    fontWeight: "400"
  },
  searchBar: {
    height: 50,
    backgroundColor: colors.cinza,
    borderRadius: 15,
    paddingHorizontal: 20,
    color: colors.tituloBranco,
    fontSize: 18,
  },

  item: {
    padding: 7,
    paddingBottom: 14,
    marginVertical: 8,
    backgroundColor: colors.cinza,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: "center"
  },
  title: {
    fontSize: 30,
    marginBottom: 2,
    fontWeight: 'bold',
    color: colors.tituloAmarelo,
  },
  text: {
    fontSize: 16,
    color: colors.tituloBranco,
  },
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

