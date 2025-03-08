import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet, TextInput, Alert, ActivityIndicator } from 'react-native';
import { addDoc, collection, updateDoc } from 'firebase/firestore';
import {  db } from '@/src/firebase/config';
import { Botão } from '@/src/components/objects';
import { Picker } from '@react-native-picker/picker';
import { colors } from '@/src/components/global';
import { useRouter } from 'expo-router';
import { TxtInput } from '@/src/components/objects';
import { height, verification, width } from '@/src/firebase/functions/interface';
import { ScrollView } from 'react-native';

export default function CreateJob() {
  const router = useRouter();
  const [localizacao, setLocalizacao] = useState('');
  const [name, setName] = useState('');
  const [empresa, setEmpresa] = useState('');
  const [salario, setSalario] = useState('');
  const [descricao, setDescricao] = useState('');
  const [gmail, setGmail] = useState('');
  const [selectedOption, setSelectedOption] = useState('');
  const [setor, setSetor] = useState('');
  const [Loading, setLoading] = useState(false);
  
  async function handleAddVagaCLT() {
    try {
      setLoading(true);
      const newJob = {
        
        uid_criadorVaga: verification().uid,
        name_vaga: name,
        name_criadorVaga: verification().displayName,

        salario,
        gmail,
        empresa,
        modalidades: selectedOption,
        localizacao,
        descricao,
        setor,
       
        createdAt: new Date(),
      };
      const docRef = await addDoc(collection(db, 'Vagas-trabalhos'), newJob);
      await updateDoc(docRef, {
        id: docRef.id
      });

      setName('');
      setEmpresa('');
      setSalario('');
      setGmail('');
      setSelectedOption('');
      setLocalizacao('');
      Alert.alert('Concluído!', 'Vaga criada');
      router.replace('/(tabs)/Home/Home');
    } catch (error) {
      Alert.alert('Erro ao adicionar documento');
      console.error('Erro ao adicionar documento:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <View style={styles.containerTop}>
          <Text style={styles.containerTop_title}>CRIE SUA PRÓPRIA VAGA</Text>
          <Text style={styles.containerTop_subtitle}>Aqui você pode criar suas vagas</Text>
        </View>


        <View style={styles.containerMed}>

          <View style={styles.containerMed_AreaInput}>
            <TxtInput
              value={name}
              onChangeText={setName}
              placeholder="Digite o nome da vaga:"
              placeholderTextColor={colors.tituloBranco}
            />
          </View>
          <View style={styles.containerMed_AreaInput}>
            <TxtInput
              onChangeText={setEmpresa}
              placeholder="Digite o nome da empresa:"
              placeholderTextColor={colors.tituloBranco}
            />
          </View>
          <View style={styles.containerMed_AreaInput}>
            <TxtInput
              value={salario}
              onChangeText={setSalario}
              placeholder="Digite o salário previsto:"
              placeholderTextColor={colors.tituloBranco}
            />
          </View>
          <View style={styles.containerMed_AreaInput}>
            <TxtInput
              value={localizacao}
              onChangeText={setLocalizacao}
              placeholder="Localização da vaga se houver:"
              placeholderTextColor={colors.tituloBranco}
            />
          </View>
          <View style={styles.containerMed_AreaInput}>
            <TxtInput
              value={setor}
              onChangeText={setSetor}
              placeholder="genero da vaga:"
              placeholderTextColor={colors.tituloBranco}
            />
          </View>
          <View style={styles.containerMed_AreaInput}>
            <Text style={styles.containerMed_AreaInput_text}>O modelo de trabalho:</Text>
            <Picker
              selectedValue={selectedOption}
              onValueChange={setSelectedOption}
              style={styles.picker}
            >
              <Picker.Item label="Selecione uma modalidade" value="" />
              <Picker.Item label="Integral" value="Integral" />
              <Picker.Item label="Híbrido" value="Hibrido" />
              <Picker.Item label="Home-office" value="Home-office" />
            </Picker>
          </View>
          <View style={styles.containerMed_AreaInput}>
            <TxtInput
              onChangeText={setGmail}
              placeholder="E-mail correspondente:"
              placeholderTextColor={colors.tituloBranco}
            />
          </View>
          <View style={styles.containerMed_AreaInput}>
            <TxtInput
              value={descricao}
              onChangeText={setDescricao}
              placeholder="Digite uma descrição"
              placeholderTextColor={colors.tituloBranco}
            />
          </View>
          <View style={styles.containerMed_AreaButton}>
          {Loading ? (
              <ActivityIndicator size="large" color={colors.amarelo1} />
          ) : (
              <Botão onPress={handleAddVagaCLT}>
                <Text style={styles.textButton}>Criar</Text>
              </Botão> 
          )}    </View>
          </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    height: height * 3,
    backgroundColor: '#242424',
    alignItems: 'center',
  },
  containerTop: {
    width: width * 1,
    height: height * 0.15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerTop_title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 5,
    color: colors.amarelo2,
  },
  containerTop_subtitle: {
    fontSize: 17,
    color: colors.tituloBranco,
  },
  containerMed: {
    width: width * 0.9,
    maxHeight: 1200,
    left: 20,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'space-around',
    borderRadius: 20,
    backgroundColor: colors.fundo2
  },
  containerMed_AreaInput: {
    width: width * 0.9,
    height: 90,
    justifyContent: 'center',
    alignItems: "center"
  },
  containerMed_AreaInput_text: {
    fontSize: 17,
    color: colors.tituloBranco,
    marginBottom: 8,
  },
  containerMed_AreaButton: {
    width: width * 0.9,
    height: 90,
    marginTop: 10,
    justifyContent: 'center',
    alignItems: "center"
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
    color: colors.texto,
    fontSize: 20,
    fontWeight: '400',
  },
  buttonArea: {
    width: width * 1,
    height: height * 0.25,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerAreaText: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  textArea: {
    height: 130,
    width: '100%',
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 7,
    marginTop: 5,
    textAlignVertical: 'top',
    fontSize: 16,
    color: '#333',
  },
});