// formPessoa.js
import { colors } from '@/src/components/global';
import { Botão, TxtInput } from '@/src/components/objects';
import { auth, db } from '@/src/firebase/config';
import { height, verification, width } from '@/src/firebase/functions/interface';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { addDoc, collection, doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const FormPessoa = () => {
  const router = useRouter();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [telefone, setTelefone] = useState('')
  const [endereco, setEndereco] = useState('')
  const [descricao, setDescricao] = useState('')
  const [links, setLinks] = useState('')
  const [password, setPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function createUser() {
    if (name == "" || email == "" || password == "" || descricao == "" || endereco == "" || links == "") {
      Alert.alert("Preencha todos os campos")
    }
    else {
        createUserWithEmailAndPassword(auth, email, password)
            .then(value => {
                console.log("Cadastrado com sucesso! \n" + value.user.uid);
          
                try {
                  const dadosConta = {
                        uid: auth.currentUser?.uid,
                        email: email,
                        nomeUsuario: name,
                        senha: password,
                        telefone: telefone,
                        endereco: endereco,
                        desc_sobre: descricao,
                        links_externos: links,
                        tipo_conta: 'Pessoa',
                        createdAt: new Date(),
                  };
                  addDoc(collection(db, 'Contas'), dadosConta);
                  Alert.alert('Concluído!', 'Conta criada');
                  router.replace('/(tabs)/Home/Home');
                } catch {
                  console.error("Erro ao configurar no firestore!", Error)
                  Alert.alert("Erro ao cadastrar!", "Verifique as informações")
                }
          })
            .catch((error) => console.log(error.message)); // Corrigido aqui: melhor tratamento de erro
    }
};

if (isLoading) {
  return (
    <View style={card.loadingContainer}>
      <ActivityIndicator size="large" color={colors.amarelo2} />
      <Text style={{color: colors.tituloBranco}}>Carregando vagas...</Text>
    </View>
  );
};

   return (
    <View style={styles.container}>
        <View style={styles.containerMed}>

          <View style={styles.containerMed_AreaInput}>
                <Text style={styles.containerMed_AreaInput_text}>Digite seu nome:</Text>
                <TxtInput
                  value={name}
                  onChangeText={setName}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                />
          </View>
          <View style={styles.containerMed_AreaInput}>
                <Text style={styles.containerMed_AreaInput_text}>Digite seu email:</Text>
                <TxtInput
                  value={email}
                  onChangeText={setEmail}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                />
          </View>
          <View style={styles.containerMed_AreaInput}>
                <Text style={styles.containerMed_AreaInput_text}>Digite seu telefone: (Opcional)</Text>
                <TxtInput
                  value={telefone}
                  onChangeText={setTelefone}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                />
          </View>
          <View style={styles.containerMed_AreaInput}>
                <Text style={styles.containerMed_AreaInput_text}>Digite seu endereço:</Text>
                <TxtInput
                  value={endereco}
                  onChangeText={setEndereco}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                />
          </View>
          <View style={styles.containerMed_AreaInput}>
                <Text style={styles.containerMed_AreaInput_text}>Digite uma descrição sobre você:</Text>
                <TxtInput
                  value={descricao}
                  onChangeText={setDescricao}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                />
          </View>
          <View style={styles.containerMed_AreaInput}>
                <Text style={styles.containerMed_AreaInput_text}>Digite seus links de contato(github, instagram):</Text>
                <TxtInput
                  value={links}
                  onChangeText={setLinks}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                />
          </View>
          <View style={styles.containerMed_AreaInput}>
                <Text style={styles.containerMed_AreaInput_text}>Digite senha:</Text>
                <TxtInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                  secureTextEntry
                />
          </View>

          {isLoading ? (
                    <ActivityIndicator size="large" color={colors.amarelo1} />
                  ) : (
                    <View style={styles.buttonArea}>
                    <Botão onPress={() => createUser()}>  
                        <Text style={styles.textButton}>Cadastrar</Text>
                    </Botão>
              </View>
                  )} 


          <Text style={styles.lowText}>
            Deseja fazer login?
            <Link href='/login' style={{color: colors.amarelo1}}> Clique aqui</Link>
          </Text>
        </View>
          
    </View>
   );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    minHeight: 500,
    alignItems: 'center',
    borderRadius: 20,
    backgroundColor: colors.fundo2
  },
  containerMed: {
    width: width * 0.9,
    minHeight: 800,
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
    // backgroundColor: 'red',
  },
  containerMed_AreaInput: {
    width: width * 0.9,
    maxHeight: 170,
    margin: 10,
    marginLeft: 50,
    justifyContent: 'center',
  },
  containerMed_AreaInput_text: {
    fontSize: 17,
    color: colors.tituloBranco,
    marginBottom: 8,
    marginLeft: 20,
  },
  picker: {
    height: 50,
    width: '100%',
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
  },
  textButton: {
    color: colors.preto,
    fontSize: 20,
    fontWeight: '400',
  },
  buttonArea: {
    width: width * 0.9,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
  lowText: {
    fontSize: 17,
    color: colors.tituloBranco,
    marginBottom: 20,
 },
});