import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { AntDesign, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '@/src/components/global';
import { Users, Vagas, width, height, Empresas } from '@/src/firebase/functions/interface';
import { useRouter } from 'expo-router';
import { dados_usuario, userVagas } from '@/src/firebase/functions/get/getInforUser';
import { handleDeleteVaga } from '@/src/firebase/functions/delete/deleteJob';
import { StatusBarObject } from '@/src/components/objects';
import { signOut } from 'firebase/auth';
import { auth } from '@/src/firebase/config';

export default function Account() {
  const [usersData, setUsersData] = useState<Users[]>([]);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userVagasList, setUserVagasList] = useState<Vagas[]>([]);
  const [filteredVagas, setFilteredVagas] = useState<Vagas[]>([]);
  const [filteredUsersData, setFilteredUsersData] = useState<Users[]>([]);
  const [tipoConta, setTipoConta] = useState<string | null>(null);

  useEffect(() => {
    const userVagaData = { setUserVagasList, setFilteredVagas, setLoading }
    userVagas(userVagaData);

    const passData = { setUsersData, setFilteredUsersData, setTipoConta, setLoading }
    dados_usuario(passData);

    const vagaId = { filteredVagas }
    handleDeleteVaga(vagaId);
  }, []);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.amarelo1} />
        <Text>Loading...</Text>
      </View>
    );
  }

  const renderUserEmpresa = ({ item }: { item: Empresas }) => (
    <View style={styles.data}>
      <View style={styles.areaTop}>
        <Text style={styles.title}>{item.nomeUsuario}</Text>
        <Text style={styles.subTitle}>{item.email}</Text>
      </View>
      <View style={styles.areaLow}>
        <View style={styles.areaLow_top}>
          <View style={styles.areaLow_areaInfor}>
            <Text style={styles.areaLow_top_text}>Informações da conta</Text>
            <AntDesign name="rightcircle" size={30} color={colors.amarelo2} />
          </View>
        </View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Contato: </Text><Text style={styles.areaLow_low_text2}>{item.email}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Setor: </Text><Text style={styles.areaLow_low_text2}>{item.setor}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Cnpj: </Text><Text style={styles.areaLow_low_text2}>{item.cnpj}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Descrição: </Text><Text style={styles.areaLow_low_text2}>{item.descricao}</Text></View>
      </View>
    </View>
  );

  const renderUserPessoa = ({ item }: { item: Users }) => (
    <View style={styles.data}>
      <View style={styles.areaTop}>
        <Text style={styles.title}>{item.name_conta}</Text>
        <Text style={styles.subTitle}>{item.email}</Text>
      </View>
      <View style={styles.areaLow}>
        <View style={styles.areaLow_top}>
          <View style={styles.areaLow_areaInfor}>
            <Text style={styles.areaLow_top_text}>Informações da conta</Text>
            <TouchableOpacity onPress={() => router.replace('/(tabs)/Config')} >
                <AntDesign name="rightcircle" size={30} color={colors.amarelo2} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Contato: </Text><Text style={styles.areaLow_low_text2}>{item.email}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Senha: </Text><Text style={styles.areaLow_low_text2}>{item.senha}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Numero de telefone: </Text><Text style={styles.areaLow_low_text2}>{item.telefone}</Text></View>
        <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Links: </Text><Text style={styles.areaLow_low_text2}>{item.links_externos}</Text></View>
      </View>
    </View>
  );

  const renderVagaCard = ({ item }: { item: Vagas }) => (
    <View style={stylesVagas.item}>
      <View style={stylesVagas.item_areaTitle}>
        <MaterialCommunityIcons name="information-outline" size={30} color="white" />
        <Text style={stylesVagas.title}>{item.nome_vaga}</Text>
        <MaterialCommunityIcons
          name="delete"
          size={30}
          color="red"
          onPress={() => {
            Alert.alert(
              "Delete Job Position",
              `Are you sure you want to delete "${item.name}"?`,
              [
                { text: "Cancel", style: "cancel" },
                { text: "Delete", onPress: () => handleDeleteVaga(item.id), style: "destructive" }
              ]
            );
          }}
        />
      </View>
      <Text style={stylesVagas.text}>Salario: R$ {item.salario}</Text>
      <Text style={stylesVagas.text}>Empresa: {item.nome_empresa}</Text>
      <Text style={stylesVagas.text}>Gmail: {item.email}</Text>
      <Text style={stylesVagas.text}>Localização: {item.localizacao}</Text>
      <Text style={stylesVagas.text}>Setor: {item.setor}</Text>
    </View>
  );

  const handleSignOut = async () => {
    try {
      await signOut(auth);  
      router.replace('/');  
    } catch (error) {
      console.error('Erro ao deslogar:', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBarObject />
      
      <ScrollView>
        {tipoConta === 'Empresa' ? (
          <FlatList data={filteredUsersData} keyExtractor={(item) => item.uid} renderItem={renderUserEmpresa} scrollEnabled={false} />
        ) : tipoConta === 'Pessoa' ? (
          <FlatList data={filteredUsersData} keyExtractor={(item) => item.uid} renderItem={renderUserPessoa} scrollEnabled={false} />
        ) : (
          <Text>Tipo de conta desconhecido</Text>
        )}

        <Text style={styles.sectionTitle}>Suporte</Text>
        <View style={styles.areaLow}>
          <View style={styles.areaLow_areaInfor}>
            <Text style={styles.areaLow_top_text}>Opções de suporte</Text>
          </View>
          <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Central de Ajuda</Text><AntDesign name="caretright" size={24} color={colors.tituloBranco} /></View>
          <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Fale Conosco</Text><AntDesign name="caretright" size={24} color={colors.tituloBranco} /></View>
          <TouchableOpacity onPress={() => {
            Alert.alert(
              "Voce esta saindo da conta",
              `Tem certeza que deseja sair?`,
              [
                { text: "Cancelar" },
                { text: "Sim", onPress: () => handleSignOut()}
              ]
            );
          }}>
              <View style={styles.areaLow_low}><Text style={styles.areaLow_low_text}>Sair do aplicativo</Text><AntDesign name="caretright" size={24} color={colors.tituloBranco} /></View>
          </TouchableOpacity>
        </View>

        <Text style={styles.sectionTitle}>Suas vagas criadas:</Text>
        <View style={stylesVagas.AreaVagasView}>
          {filteredVagas.length > 0 ? (
            <FlatList data={filteredVagas} keyExtractor={(item) => item.uid} renderItem={renderVagaCard} scrollEnabled={false} />
          ) : (
            <Text style={stylesVagas.emptyMessage}>Você não tem vagas postadas ainda.</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.fundo,
    textAlign: 'center'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.preto
  },
  sectionTitle: {
    fontSize: 30,
    color: colors.amarelo2,
    marginLeft: 20,
    marginTop: 30,
  },
  data: {
    maxWidth: width * 1,
    minHeight: height * 0.10,
    alignItems: 'center',
  },
  areaTop: {
    backgroundColor: colors.fundo2,
    width: width * 1,
    height: 130,
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
    maxHeight: 800,
    padding: 15,
    backgroundColor: colors.fundo2,
    borderRadius: 20,
    marginTop: 20,
    flexWrap: "wrap",
    alignItems: 'center',
  },
  areaLow_top: {
    width: '100%',
    minHeight: 40,
    alignItems: 'center',

  },
  areaLow_areaInfor: {
    width: '92%',
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
    fontSize: 16,
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
