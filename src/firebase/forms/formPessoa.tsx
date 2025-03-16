// formPessoa.js
import { colors } from '@/src/components/global';
import { Botão, TxtInput } from '@/src/components/objects';
import { auth, db } from '@/src/firebase/config';
import { height, width } from '@/src/firebase/functions/interface';
import { Link, useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export const FormPessoa = () => {
  const router = useRouter();
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('');
  const [descricao, setDescricao] = useState('');
  const [confirmarPassword, setConfirmarPassword] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const tipo_conta = 'Pessoa'

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
                  value={name}
                  onChangeText={setName}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                />
          </View>
          <View style={styles.containerMed_AreaInput}>
                <Text style={styles.containerMed_AreaInput_text}>Digite seu telefone: (Opcional)</Text>
                <TxtInput
                  value={name}
                  onChangeText={setName}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                />
          </View>
          <View style={styles.containerMed_AreaInput}>
                <Text style={styles.containerMed_AreaInput_text}>Digite seu endereço:</Text>
                <TxtInput
                  value={name}
                  onChangeText={setName}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                />
          </View>
          <View style={styles.containerMed_AreaInput}>
                <Text style={styles.containerMed_AreaInput_text}>Digite uma descrição sobre você:</Text>
                <TxtInput
                  value={name}
                  onChangeText={setName}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                />
          </View>
          <View style={styles.containerMed_AreaInput}>
                <Text style={styles.containerMed_AreaInput_text}>Digite seus links de contato(github, instagram):</Text>
                <TxtInput
                  value={name}
                  onChangeText={setName}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                />
          </View>
          <View style={styles.containerMed_AreaInput}>
                <Text style={styles.containerMed_AreaInput_text}>Digite senha:</Text>
                <TxtInput
                  value={name}
                  onChangeText={setName}
                  placeholder="..."
                  placeholderTextColor={colors.amarelo2}
                />
          </View>

          <View style={styles.buttonArea}>
                <Botão>  
                    <Text style={styles.textButton}>Cadastrar</Text>
                </Botão>
          </View>

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