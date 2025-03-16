import React, { useState }  from 'react';
import { Text, View, StyleSheet, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Link, useRouter } from 'expo-router';
import { TxtInput } from '../src/components/objects';
import { Botão } from '../src/components/objects';
import { colors } from '@/src/components/global';
import { width } from '@/src/firebase/functions/interface';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/src/firebase/config';
import { connectFirestoreEmulator } from 'firebase/firestore';

export default function Login() {
  const router = useRouter(); // Rotas
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  async function login() {
      try {
        setIsLoading(true)
        signInWithEmailAndPassword(auth, email, password)
          .then(value => {
              console.log("Login realizado com sucesso! Seja bem vindo \n" + value.user.uid + " - " + email);
              Alert.alert("Login bem sucedido!", "Seja bem vindo de volta")
              router.replace('/(tabs)/Home/Home')
          })
          .catch((error) => console.log(error.message)); // Corrigido aqui: melhor tratamento de erro 
      } 
      catch(erro) {
        console.error("Erro antes de iniciar  a função")
        Alert.alert("Erro no login")
      } 
      finally {
        console.log("Função login realizada")
        setIsLoading(false)
      }
  };

  // const handleRecoveryPress = async () => {
  //   const valueRecovery = { email };
  //   await handleRecovery(valueRecovery);
  // };

  return (
    <View style={Style.container}>
      <View style={Style.cardTop}>
          <Text style={Style.cardTop_Title}>Go 2 Work</Text>
          <Text style={Style.cardTop_subTitle}>Volte a para encontrar novos interreses.</Text>
      </View>

      <View style={Style.cardBottom}>
        <Text style={Style.cardBottom_text}>Digite seu email:</Text>
        <TxtInput 
          placeholder="Email"
          value={email}
          placeholderTextColor={colors.tituloBranco}
          onChangeText={setEmail}
        />
        <Text style={Style.cardBottom_text}>Digite sua senha:</Text>
        <TxtInput
          placeholder="Senha"
          placeholderTextColor={colors.tituloBranco}
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <TouchableOpacity /*onPress={() => RecuperarSenha}*/>
           <Text style={Style.cardBottom_recovery}>Deseja recuperar sua senha?</Text>
        </TouchableOpacity>
        {isLoading ? (
          <ActivityIndicator size="large" color={colors.amarelo1} />
        ) : (
          <Botão activeOpacity={0.8} onPress={login} >
            <Text style={{ fontSize: 18, color: colors.tituloBranco }}>Entrar</Text>
          </Botão>
        )} 
        <Text style={Style.textBottom}>
          Não tem conta? 
          <Link href="/" style={Style.links}>
            crie aqui agora!
          </Link>
        </Text>
      </View>
    </View>
  );
}

const Style = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: colors.preto,
  },
  cardTop: {
    height: '24%',
    width: width * 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    // backgroundColor: 'red'
  },
  cardTop_Title: {
    fontSize: 50,
    color: colors.amarelo2,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  cardTop_subTitle: {
    fontSize: 17,
    color: colors.tituloBranco,
    marginBottom: 20,
  },
  cardBottom: {
    minHeight: '65%',
    width: "90%",
    backgroundColor: colors.fundo2,
    alignItems: "center",
    padding: 10,
    borderRadius: 20,
    marginTop: 20,
  },
  cardBottom_text: {
    fontSize: 18,
    marginBottom: 10,
    marginTop: 20,
    color: colors.tituloBranco,
  },
  cardBottom_recovery: {
    fontSize: 18,
    marginBottom: 35,
    marginTop: 35,
    color: colors.tituloBranco,
  },
  textBottom: {
    fontSize: 18,
    top: 80,
    color: colors.tituloBranco,
    justifyContent: "space-around",
  },
  links: {
    color: colors.amarelo1,
  },
});