import { View, Text, Button, StyleSheet, Alert, ScrollView } from 'react-native';
import { useRouter } from 'expo-router'; // Importar o hook useRouter
import React, { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth, db } from '@/src/firebase/config';
import { TxtInput } from '@/src/components/objects';
import { addDoc, collection } from 'firebase/firestore';
import { height, verification, width } from '@/src/firebase/functions/interface';
import { Picker } from '@react-native-picker/picker';
import { colors } from '@/src/components/global';
import { FormPessoa } from '@/src/firebase/forms/formPessoa';
import { FormEmpresa } from '@/src/firebase/forms/formEmpresa';


export default function createAccount() {
  const router = useRouter(); // Inicializar o router
  const [tipoConta, setTipoConta] = useState('');

  async function createUser() {
      createUserWithEmailAndPassword(auth, email, password)
          .then(value => {
              console.log("Cadastrado com sucesso! \n" + value.user.uid);
        
              try {
                const dadosConta = {
                      uid: verification().uid,
                      email: email,
                };
                addDoc(collection(db, 'Contas'), dadosConta);
                Alert.alert('Concluído!', 'Conta criada');
                router.replace('/(tabs)/Home/Home');
              } catch {
                console.error("Erro ao configurar no firestore!", Error)
              }
        })
          .catch((error) => console.log(error.message)); // Corrigido aqui: melhor tratamento de erro
  };

  const handleValueChange = (value) => {
    setTipoConta(value);
  };

  return (
    <View style={{flex:1, backgroundColor: colors.preto}}>
      <ScrollView style={{flex: 1}}>
        <View style={Style.cardTop}>
          <Text style={Style.Title}>Criar Conta</Text>
        </View>
        
        <View style={Style.cardQuestionForm}>
          <Text style={Style.cardQuestionForm_title}>
            Selecione o tipo de conta:
          </Text>
          <Picker
            selectedValue={tipoConta}
            onValueChange={handleValueChange}
            style={Style.picker}
            dropdownIconColor={colors.tituloBranco}
          >
            <Picker.Item label="Selecione..." value="" />
            <Picker.Item label="Pessoa" value="Pessoa" />
            <Picker.Item label="Empresa" value="Empresa" />
          </Picker>
        </View>

        <View style={Style.formContainer}>
          {tipoConta === 'Pessoa' && <FormPessoa />}
          {tipoConta === 'Empresa' && <FormEmpresa />}
          {tipoConta === '' && (
            <Text style={Style.selectText}>
              Por favor, selecione um tipo de conta acima
            </Text>
          )}
        </View>


      </ScrollView>
    </View>
  );
}


const Style = StyleSheet.create({
  container: {
     flex: 1,
     width: width * 1,
     height: height * 2,
     alignItems: 'center',
     backgroundColor: "#242424",
  },
  cardTop: {
     minHeight: 10,
     width: width * 1,
     marginTop: 60,
     //backgroundColor: 'red',
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
     width: width * 1,
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
     width: width * 1,
     alignItems: 'center',
     paddingBottom: 40,
   },
   selectText: {
     fontSize: 16,
     color: colors.tituloBranco,
     textAlign: 'center',
     marginTop: 20
   },

});
