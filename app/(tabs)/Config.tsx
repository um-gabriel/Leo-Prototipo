import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Dimensions, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { colors } from '@/src/components/global';
import { MaterialIcons } from '@expo/vector-icons';
import { TxtInput } from '@/src/components/objects';
import { BotãoInicio, BotãoRedondo } from '@/src/components/objects';
import { auth } from '@/src/firebase/config';
import { width } from '@/src/firebase/functions/interface';

export default function Config() {
  const [filteredUsersData, setFilteredUsersData] = useState([]);
  const [usersData, setUsersData] = useState([]);
  const [changeText, setChangeText] = useState("");
  const [Loading, setLoading] = useState([]);
  const router = useRouter()
  // Função para atualizar o campo "idade"
  const handleChangeText = async () => {
  };

  const logout = async () => {
    try {
      await auth.signOut();
      Alert.alert("Logout com sucesso!", "Entre novamente ou crie outra conta para continuar.")
      console.log('Usuário desconectado com sucesso!');
      router.replace('/');
    } catch (error) {
      console.error('Erro ao desconectar usuário:', error);
    }
  };

  return (
    <View style={styles.Container} >
      
      <View style={styles.containerTop}>
        <Text style={styles.containerTop_title}>Configurações</Text>
      </View>

      {usersData.map(usersData => (
      <View key={usersData.id}>
      <View style={styles.containerMed} >
        <Text style={styles.containerMed_title}>Configurações de perfil</Text>
          <View style={styles.containerMed_area} >
              <Text style={styles.containerMed_textConfig}>Nome: 
                  <Text style={{color: colors.amarelo2}}> {usersData.name} </Text>
                  <MaterialIcons name="published-with-changes" size={24} color={colors.amarelo2} />
              </Text>
              <Text style={styles.containerMed_textConfig}>E-mail: 
                   <Text style={{color: colors.amarelo2}}> {usersData.email} </Text>
              </Text>
              <Text style={styles.containerMed_textConfig}>Senha: 
                  <Text style={{color: colors.amarelo2}}> {usersData.password} </Text>
              </Text>
              <Text style={styles.containerMed_textConfig}>Região: 
                  <Text style={{color: colors.amarelo2}}> {usersData.regiao} </Text>
              </Text>
              <Text style={styles.containerMed_textConfig}>Telefone: 
                  <Text style={{color: colors.amarelo2}}> {usersData.fone} </Text>
              </Text>
              <Text style={styles.containerMed_textConfig}>Tipo de conta: 
                  <Text style={{color: colors.amarelo2}}> {usersData.tipoConta} </Text>
              </Text>
          </View>
      </View>

      <View style={styles.areaChange}>
        
          <View style={styles.areaChange_Input} >
            <TxtInput 
                value={changeText}
                onChangeText={setChangeText}
                placeholder="Altere o campo que quiser"
                placeholderTextColor={colors.amarelo2} 
            />
          </View>
            <BotãoRedondo onPress={() => handleChangeText()} />
      </View>
      <View style={styles.areaButtons}>
          <TouchableOpacity style={styles.button}
            onPress={() => logout()}
          >
            <Text style={{color: colors.tituloBranco, fontSize: 18}}>Logout</Text>
          </TouchableOpacity>
          <View style={[styles.button, styles.red]}>
            <Text style={{color: colors.tituloBranco, fontSize: 18}}>Deletar conta</Text>
          </View>
      </View>
      </View>
      ))}
    </View>

  );
};


const styles = StyleSheet.create({
  Container: {
    flex: 1,
    backgroundColor: colors.fundo,
    alignItems: "center"
  },
  containerTop: {
    width: width * 1,
    minHeight: 90,
    justifyContent: "center",
    alignItems: "center",
    //backgroundColor: "blue"
  },
  containerTop_title: {
    fontSize: 32,
    color: colors.amarelo2,
    fontWeight: '600',
  },
  containerMed: {
    width: width * 1,
    minHeight: 300,
    //backgroundColor: "red"
    alignItems: "center"
  },
  containerMed_title: {
    fontSize: 22,
    color: colors.tituloBranco,
    marginLeft: 10,
  },
  containerMed_area: {
    marginTop: 13,
    width: width * 1,
    height: 220,
    //backgroundColor: "green",
    justifyContent: "space-between"
  },
  containerMed_textConfig: {
    fontSize: 18,
    color: colors.tituloBranco,
    fontWeight: "bold",
    marginLeft: 20,
  },
  areaChange: {
    width: width * 1,
    maxHeight: 90,
    //backgroundColor: "red",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center"
  },
  areaChange_Input: {
    width: width * 0.7,
    marginRight: 20,
  },
  areaButtons: {
    width: width * 1,
    height: 70,
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    marginTop: 100,
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
})
