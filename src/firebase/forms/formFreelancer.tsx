// formEmpresa.js
import { colors } from '@/src/components/global';
import { Botão, TxtInput } from '@/src/components/objects';
import { auth, db } from '@/src/firebase/config';
import { height, width } from '@/src/firebase/functions/interface';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';

export const FormFreelancer = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState('');
  const [setor, setSetor] = useState('');
  const [regiao, setRegiao] = useState('');
  const [links, setLinks] = useState('');
  const [descricao, setDescricao] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('');
  const tipo_conta = 'Freelancer';

  const onRegisterPress = async () => {
    if (!name || !email || !password || !descricao || !links || !setor) {
      Alert.alert("Erro", "Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    if (password !== confirmarPassword) {
      Alert.alert('Erro', 'As senhas não coincidem.');
      return;
    }

    setIsLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;
      const data = {
        uid: auth.currentUser?.uid,
        email: email,
        nomeFree: name,
        senha: password,
        descricao,
        setor,
        regiao,
        links,
        tipo_conta,
        createdAt: new Date(),
      };
      await setDoc(doc(db, 'Contas', uid), data);
      console.log("Novo usuario: ", uid)
      Alert.alert("Sucesso", "Conta criada com sucesso!");
      router.replace('/(tabs)/Home/Home');
    } catch (error) {
      console.error("Erro ao criar a conta:", error);
      Alert.alert("Erro", "Falha ao criar a conta.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerMed}>

        <View style={styles.containerMed_AreaInput}>
          <Text style={styles.containerMed_AreaInput_text}>Nome da free:</Text>
          <TxtInput
            value={name}
            onChangeText={setName}
            placeholder="..."
            placeholderTextColor={colors.amarelo2}
          />
        </View>

        <View style={styles.containerMed_AreaInput}>
          <Text style={styles.containerMed_AreaInput_text}>Email:</Text>
          <TxtInput
            value={email}
            onChangeText={setEmail}
            placeholder="..."
            placeholderTextColor={colors.amarelo2}
          />
        </View>

        <View style={styles.containerMed_AreaInput}>
          <Text style={styles.containerMed_AreaInput_text}>Descrição do agente:</Text>
          <TxtInput
            value={descricao}
            onChangeText={setDescricao}
            placeholder="..."
            placeholderTextColor={colors.amarelo2}
          />
        </View>

        <View style={styles.containerMed_AreaInput}>
          <Text style={styles.containerMed_AreaInput_text}>Setor:</Text>
          <TxtInput
            value={setor}
            onChangeText={setSetor}
            placeholder="..."
            placeholderTextColor={colors.amarelo2}
          />
        </View>

        <View style={styles.containerMed_AreaInput}>
          <Text style={styles.containerMed_AreaInput_text}>Região:</Text>
          <TxtInput
            value={regiao}
            onChangeText={setRegiao}
            placeholder="..."
            placeholderTextColor={colors.amarelo2}
          />
        </View>

        <View style={styles.containerMed_AreaInput}>
          <Text style={styles.containerMed_AreaInput_text}>Links de contato:</Text>
          <TxtInput
            value={links}
            onChangeText={setLinks}
            placeholder="..."
            placeholderTextColor={colors.amarelo2}
          />
        </View>

        <View style={styles.containerMed_AreaInput}>
          <Text style={styles.containerMed_AreaInput_text}>Senha:</Text>
          <TxtInput
            value={password}
            onChangeText={setPassword}
            placeholder="..."
            secureTextEntry
            placeholderTextColor={colors.amarelo2}
          />
        </View>

        <View style={styles.containerMed_AreaInput}>
          <Text style={styles.containerMed_AreaInput_text}>Confirmar senha:</Text>
          <TxtInput
            value={confirmarPassword}
            onChangeText={setConfirmarPassword}
            placeholder="..."
            secureTextEntry
            placeholderTextColor={colors.amarelo2}
          />
        </View>

        {isLoading ? (
          <ActivityIndicator size="large" color={colors.amarelo1} />
        ) : (
          <View style={styles.buttonArea}>
            <Botão onPress={onRegisterPress}>
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
