import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/src/firebase/config';
import { addDoc, collection } from 'firebase/firestore';
import { width } from '@/src/firebase/functions/interface';
import { Picker } from '@react-native-picker/picker';
import { colors } from '@/src/components/global';
import { FormPessoa } from '@/src/firebase/forms/formPessoa';
import { FormEmpresa } from '@/src/firebase/forms/formEmpresa';
import { StatusBarObject } from '@/src/components/objects';
import { AntDesign } from '@expo/vector-icons';

export default function CreateAccount() {
  const router = useRouter();
  const [tipoConta, setTipoConta] = useState('');

  // Esses dados devem vir dos formulários filhos depois:
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  async function createUser() {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const { uid } = userCredential.user;

      await addDoc(collection(db, 'Contas'), {
        uid,
        email,
        tipoConta,
      });

      Alert.alert('Concluído!', 'Conta criada com sucesso!');
      router.replace('/(tabs)/Home/Home');
    } catch (error: any) {
      console.error("Erro ao criar conta:", error.message);
      Alert.alert('Erro', error.message);
    }
  }

  function Back() {
    router.replace('/')
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.preto }}>
      <StatusBarObject />
      
      <ScrollView contentContainerStyle={{ paddingBottom: 40 }}>
        <View style={Style.cardTop}>
          <AntDesign name="caretleft" size={30} color={colors.amarelo2} onPress={ () => Back()} style={{ right: 160, marginBottom: 10 }} />
          <Text style={Style.Title}>Criar Conta</Text>
        </View>

        <View style={Style.cardQuestionForm}>
          <Text style={Style.cardQuestionForm_title}>Selecione o tipo de conta:</Text>
          <Picker
            selectedValue={tipoConta}
            onValueChange={setTipoConta}
            style={Style.picker}
            dropdownIconColor={colors.tituloBranco}
          >
            <Picker.Item label="Selecione..." value="" />
            <Picker.Item label="Pessoa" value="Pessoa" />
            <Picker.Item label="Empresa" value="Empresa" />
          </Picker>
        </View>

        <View style={Style.formContainer}>
          {tipoConta === 'Pessoa' && <FormPessoa setEmail={setEmail} setPassword={setPassword} onSubmit={createUser} />}
          {tipoConta === 'Empresa' && <FormEmpresa setEmail={setEmail} setPassword={setPassword} onSubmit={createUser} />}
          {tipoConta === '' && (
            <Text style={Style.selectText}>Por favor, selecione um tipo de conta acima</Text>
          )}
        </View>
      </ScrollView>
    </View>
  );
}

const Style = StyleSheet.create({
  cardTop: {
    marginTop: 60,
    justifyContent: 'center',
    alignItems: 'center'
  },
  Title: {
    fontSize: 50,
    fontWeight: "bold",
    color: colors.amarelo2
  },
  cardQuestionForm: {
    minHeight: 120,
    alignItems: "center",
    justifyContent: "space-around",
    marginBottom: 20
  },
  cardQuestionForm_title: {
    fontSize: 18,
    color: colors.tituloBranco,
    marginBottom: 10
  },
  picker: {
    height: 50,
    width: '90%',
    backgroundColor: colors.cinza,
    color: colors.tituloBranco
  },
  formContainer: {
    width: width,
    alignItems: 'center',
  },
  selectText: {
    fontSize: 16,
    color: colors.tituloBranco,
    textAlign: 'center',
    marginTop: 20
  },
});