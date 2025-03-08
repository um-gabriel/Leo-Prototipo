import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView, Alert } from 'react-native';
import { AntDesign, MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/src/components/global';
import { Users, Vagas, width, height, verification, Empresas } from '@/src/firebase/functions/interface';
import { db } from '@/src/firebase/config';
import { collection, getDocs, query, where, doc, deleteDoc } from 'firebase/firestore';
import { useRouter } from 'expo-router';

export default function Account() {
  const [usersData, setUsersData] = useState<Users[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userVagasList, setUserVagasList] = useState<Vagas[]>([]);
  const [filteredVagas, setFilteredVagas] = useState<Vagas[]>([]);
  const [filteredUsersData, setFilteredUsersData] = useState<Users[]>([]);
  const [tipoConta, setTipoConta] = useState<string | null>(null);

  useEffect(() => {
    userVagas();
    dados_usuario();
  }, []);

  async function dados_usuario() {
    const userAuth = verification();
    if (!userAuth.isAuthenticated) {
      console.error("User is not authenticated");
      setLoading(false);
      return;
    }
    try {
      const q = query(
        collection(db, "Contas"),
        where("uid", "==", userAuth.uid)
      );
      const querySnapshot = await getDocs(q);      
      const usersDataArray = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setUsersData(usersDataArray);
      setFilteredUsersData(usersDataArray);

      if (usersDataArray.length > 0) {
        setTipoConta(usersDataArray[0].tipo_conta);
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
    } finally {
      setLoading(false);
    }
  };
  // Função para buscar as vagas do usuário
  async function userVagas () {
  const userAuth = verification();
  try {
      const q = query(
          collection(db, "Vagas-trabalhos"),
          where("uid_criadorVaga", "==", userAuth.uid)
      );
      const querySnapshot = await getDocs(q);      
      const UsersVagasArray = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
      }));
      setUserVagasList(UsersVagasArray);
      setFilteredVagas(UsersVagasArray); // Inicializa com todos os dados
  } catch (error) {
      console.error("Erro vc não esta logado:", error);
  } finally {
      setLoading(false);
  }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.amarelo1} />
        <Text>Loading...</Text>
      </View>
    );
  };

  const renderUserEmpresa = ({ item }: { item: Empresas }) => (
    <View style={styles.data}>
      <View style={styles.areaTop}>
        <Text style={styles.title}>{item.name_conta}</Text>
        <Text style={styles.subTitle}>{item.gmail}</Text>
      </View>
      <View style={styles.areaLow}>
        <View style={styles.areaLow_top}>
        <View style={styles.areaLow_areaInfor}>
            <Text style={styles.areaLow_top_text}>Informações da conta</Text>
            <AntDesign name="rightcircle" size={30} color={colors.amarelo2} style={{left: 4}} /*onPress={() => router.replace('/(tabs)/configurações/Perfil')}*//>
          </View>
        </View>
        <View style={styles.areaLow_low}>
            <Text style={styles.areaLow_low_text}>Contato: </Text>
            <Text style={styles.areaLow_low_text2}>{item.gmail}</Text>
        </View>
        <View style={styles.areaLow_low}>
            <Text style={styles.areaLow_low_text}>Setor: </Text>
            <Text style={styles.areaLow_low_text2}>{item.setor}</Text>
        </View>
        <View style={styles.areaLow_low}>
            <Text style={styles.areaLow_low_text}>Cnpj: </Text>
            <Text style={styles.areaLow_low_text2}>{item.cnpj}</Text>
        </View>
        <View style={styles.areaLow_low}>
            <Text style={styles.areaLow_low_text}>Descrição: </Text>
            <Text style={styles.areaLow_low_text2}>{item.cnpj}</Text>
        </View>
      </View>
    </View>
  );
  const renderUserPessoa = ({ item }: { item: Users }) => (
    <View style={styles.data}>
      <View style={styles.areaTop}>
        <Text style={styles.title}>{item.name_conta}</Text>
        <Text style={styles.subTitle}>{item.gmail}</Text>
      </View>
      <View style={styles.areaLow}>
        <View style={styles.areaLow_top}>
          <View style={styles.areaLow_areaInfor}>
            <Text style={styles.areaLow_top_text}>Informações da conta</Text>
            <AntDesign name="rightcircle" size={30} color={colors.amarelo2} style={{left: 4}} /*onPress={() => router.replace('/(tabs)/configurações/Perfil')}*/ />
          </View>
        </View>
        <View style={styles.areaLow_low}>
            <Text style={styles.areaLow_low_text}>Contato: </Text>
            <Text style={styles.areaLow_low_text2}>{item.gmail}</Text>
        </View>
        <View style={styles.areaLow_low}>
            <Text style={styles.areaLow_low_text}>Senha: </Text>
            <Text style={styles.areaLow_low_text2}>{item.password}</Text>
        </View>
  
      </View>
    </View>
  );

  const renderVagaCard = ({ item }: { item: Vagas }) => (
    <View style={stylesVagas.item}>
      <View style={stylesVagas.item_areaTitle}>
        <MaterialCommunityIcons name="information-outline" size={30} color="white" />
        <Text style={stylesVagas.title}>{item.name_vaga}</Text>
        <MaterialCommunityIcons 
          name="delete" 
          size={30} 
          color="red" 
          onPress={() => {
            Alert.alert(
              "Delete Job Position",
              `Are you sure you want to delete "${item.name}"?`,
              [
                {
                  text: "Cancel",
                  style: "cancel"
                },
                { 
                  text: "Delete", 
                  onPress: () => handleDeleteVaga(item.id),
                  style: "destructive"
                }
              ]
            );
          }} 
        /> 
      </View>
      <Text style={stylesVagas.text}>Salario: R$ {item.salario}</Text>
      <Text style={stylesVagas.text}>Empresa: {item.empresa}</Text>
      <Text style={stylesVagas.text}>Gmail: {item.gmail}</Text>
      <Text style={stylesVagas.text}>Localização: {item.localizacao}</Text>
      <Text style={stylesVagas.text}>Setor: {item.setor}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <ScrollView>
      {tipoConta === 'Empresa' ? (
          <FlatList
            data={filteredUsersData}
            keyExtractor={(item) => item.uid}
            renderItem={renderUserEmpresa}
            scrollEnabled={false}
          />
        ) : tipoConta === 'Pessoa' ? (
          <FlatList
            data={filteredUsersData}
            keyExtractor={(item) => item.uid}
            renderItem={renderUserPessoa}
            scrollEnabled={false}
        />
        ) : (
          <Text>Tipo de conta desconhecido</Text>
        )}
        
        <Text style={styles.sectionTitle}>Suas vagas criadas: </Text>
        
        <View style={stylesVagas.AreaVagasView}>
          {filteredVagas.length > 0 ? (
            <FlatList
              data={filteredVagas}
              keyExtractor={(item) => item.uid}
              renderItem={renderVagaCard}
              scrollEnabled={false}
            />
          ) : (
            <Text style={stylesVagas.emptyMessage}>You haven't posted any job positions yet.</Text>
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
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionTitle: {
    fontSize: 20,
    color: colors.tituloBranco,
    marginLeft: 20,
    marginTop: 30,
  },
  data: {
    width: width * 1,
    minHeight: height * 0.10,
    alignItems: 'center',
  },
  areaTop: {
    backgroundColor: colors.fundo2,
    width: '100%',
    height: height * 0.23,
    justifyContent: 'flex-end'
  },
  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.tituloBranco,
    marginLeft: 30,
  },
  subTitle: {
    fontSize: 20,
    color: colors.cinza2,
    marginLeft: 40,
    marginBottom: 23,
  },

  areaLow: {
    width: '90%',
    padding: 15,
    maxHeight: 300,
    backgroundColor: colors.fundo2,
    borderRadius: 20,
    marginTop: 20,
    alignItems: 'center',
  },
  areaLow_top: {
    width: '100%',
    minHeight: 40,
    //backgroundColor: 'blue',
    alignItems: 'center',
    justifyContent: 'center'
  },
  areaLow_areaInfor: {
    width: '93%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  areaLow_top_text: {
    fontSize: 28,
    color: colors.tituloBranco,
  },

  areaLow_low: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 4,
    padding: 5,
  },
  areaLow_low_text: {
    fontSize: 18,
    color: colors.cinza2,
  },
  areaLow_low_text2: {
    fontSize: 18,
    color: colors.tituloAmarelo,
  },
});

const stylesVagas = StyleSheet.create({
  AreaVagasView: {
    padding: 20,
    width: width,
    minHeight: '2%',
  },
  item: {
    padding: 5,
    marginVertical: 8,
    backgroundColor: colors.cinza,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
    alignItems: 'center',
  },
  item_areaTitle: {
    width: width * 0.88,
    height: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.tituloAmarelo,
  },
  text: {
    fontSize: 16,
    color: colors.tituloBranco,
    marginBottom: 5,
  },
  emptyMessage: {
    fontSize: 16,
    color: colors.tituloBranco,
    textAlign: 'center',
    marginTop: 20,
  },
});

export async function handleDeleteVaga(vagaId: string) {
  try {
    const userAuth = verification();
    if (!userAuth.isAuthenticated) {
      console.error("User is not authenticated");
      return;
    }

    // Deletar o documento da coleção Vagas-trabalhos
    const vagaRef = doc(db, "Vagas-trabalhos", vagaId);
    await deleteDoc(vagaRef);
    
    // Atualizar a lista de vagas após a exclusão
    filteredVagas();
  } catch (error) {
    console.error("Error deleting job posting:", error);
  }
};

export default Account;