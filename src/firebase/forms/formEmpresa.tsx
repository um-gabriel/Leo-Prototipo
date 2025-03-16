// formPessoa.js
import { colors } from '@/src/components/global';
import { Botão, TextArea, TxtInput } from '@/src/components/objects';
import { auth, db } from '@/src/firebase/config';
import { height, width } from '@/src/firebase/functions/interface';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';

export const FormEmpresa = () => {
  const router = useRouter();
  const [name, setName] = useState('');
  const [cnpj , setCnpj] = useState('');
  const [setor, setSetor] = useState('');
  const [regiao, setRegiao] = useState('');
  const [descricao, setDescricao] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onRegisterPress = async () => {
    setIsLoading(true);
    if (!name || !email || !password || !descricao) {
      Alert.alert("Erro", "Por favor, preencha todos os campos."); 
        if (password !== confirmarPassword) {
          Alert.alert('As senhas não são iguais.')
        }
    } 
    if (password !== confirmarPassword) {
      Alert.alert('As senhas não são iguais.')
    }
    else {
    try {
       const userCredential = await createUserWithEmailAndPassword(auth, email, password);
       const uid = userCredential.user.uid;
       const tipo_conta = 'Empresa';
       const data = {
          uid: uid,
          gmail: email,
          name_conta: name,
          password,
          descricao,
          cnpj,
          setor,
          tipo_conta,
          createdAt: new Date(),
       };
       const pessoasSubCollectionRef = doc(db, 'Contas', uid);
       await setDoc(pessoasSubCollectionRef, data);
       Alert.alert("Conta Criada com sucesso!");
       router.replace('/(tabs)/dashboard');
    } catch (error) {
       console.error("Erro ao criar a conta:", error);
       Alert.alert("Erro", "erro ao criar a conta");
    } finally {
       setIsLoading(false);
    }
  }
  };

   return (
    <View style={styles.container}>
        <View style={styles.containerMed}>
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Digite o nome da empresa:</Text>
            <TxtInput
              value={name}
              onChangeText={setName}
              placeholder="..."
              placeholderTextColor={colors.amarelo2}
            />
          </View>
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Digite o seu gmail:</Text>
            <TxtInput
              value={email}
              onChangeText={setEmail}
              placeholder="..."
              placeholderTextColor={colors.amarelo2}
            />
          </View>
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Digite uma descrição sobre a empresa:</Text>
            <TextArea 
              value={descricao}
              onChangeText={setDescricao}
              placeholder='...'
              placeholderTextColor={colors.amarelo2}
            />
          </View>
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Digite seu cnpj:</Text>
            <TextArea 
              value={cnpj}
              onChangeText={setCnpj}
              placeholder='...'
              placeholderTextColor={colors.amarelo2}
            />
          </View>          
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Digite seu setor da empresa:</Text>
            <TextArea 
              value={setor}
              onChangeText={setSetor}
              placeholder='...'
              placeholderTextColor={colors.amarelo2}
            />
          </View>
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Digite sua senha:</Text>
            <TxtInput
              value={password}
              onChangeText={setPassword}
              placeholder="..."
              secureTextEntry={true}
              placeholderTextColor={colors.amarelo2}
            />
          </View>
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>Confirme sua senha:</Text>
            <TxtInput
              value={confirmarPassword}
              onChangeText={setConfirmarPassword}
              placeholder="..."
              secureTextEntry={true}
              placeholderTextColor={colors.amarelo2}
            />
          </View>
          <View style={styles.buttonArea}>
          <Botão onPress={onRegisterPress}> 
              <Text style={styles.textButton}>Cadastrar</Text>
          </Botão>
          </View>
        </View>
    </View>
   );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    maxHeight: height * 1.2,
    backgroundColor: '#242424',
    alignItems: 'center',
  },
  containerMed: {
    width: width * 1,
    maxHeight: 900,
    alignItems: 'center',
  },
  containerMed_subTitle: {
    fontSize: 17,
    color: colors.tituloBranco,
  },
  containerMed_AreaInput: {
    width: width * 0.9,
    maxHeight: 170,
    marginTop: 10,
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
    width: width * 1,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 0,
  },
});