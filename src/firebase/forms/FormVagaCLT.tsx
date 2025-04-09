import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Alert, ScrollView } from 'react-native';
import { Botão } from '@/src/components/objects';
import { colors } from '@/src/components/global';
import { auth, db } from '../config';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { verification } from '@/src/firebase/functions/interface'

export default function FormVagaCLT() {
  const [loading, setLoading] = useState(false);

  const [nome_vaga, setNome_vaga] = useState("");
  const [nome_empresa, setNome_empresa] = useState("");
  const [email, setEmail] = useState("");
  const [salario, setSalario] = useState("");
  const [modalidade, setModalidade] = useState("");
  const [localizacao, setLocalizacao] = useState("");
  const [descricao, setDescricao] = useState("");
  const [regime, setRegime] = useState("");
  const [setor, setSetor] = useState("");

  async function createVagaCLT() {
    if (!nome_vaga || !descricao || !regime || !nome_empresa || !email) {
      Alert.alert("Preencha todos os campos obrigatórios.");
      return;
    }

    setLoading(true);
    try {
      await addDoc(collection(db, "Vagas-trabalhos"), {
        nome_vaga,
        // vaga_id,
        uid_criadorVaga: auth.currentUser?.uid,
        nome_empresa,
        email,
        salario,
        modalidade,
        localizacao,
        descricao,
        regime,
        setor,
        createdAt: serverTimestamp(),
      });

      Alert.alert("Vaga CLT criada com sucesso!");
      setNome_vaga("");
      setNome_empresa("");
      setEmail("");
      setSalario("");
      setModalidade("");
      setLocalizacao("");
      setDescricao("");
      setRegime("");
      setSetor("");
    } catch (error) {
      console.error("Erro ao criar vaga CLT:", error);
      Alert.alert("Erro ao criar vaga.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView style={styles.form} contentContainerStyle={{ paddingBottom: 40 }}>
      <Input label="Título da vaga" value={nome_vaga} onChangeText={setNome_vaga} />
      <Input label="Empresa contratante" value={nome_empresa} onChangeText={setNome_empresa} />
      <Input label="Email para contato" value={email} onChangeText={setEmail} />
      <Input label="Descrição da vaga" value={descricao} onChangeText={setDescricao} multiline />
      <Input label="Regime de contratação (ex: CLT, PJ)" value={regime} onChangeText={setRegime} />
      <Input label="Setor (ex: Vendas, Tecnologia)" value={setor} onChangeText={setSetor} />
      <Input label="Salário (opcional)" value={salario} onChangeText={setSalario} keyboardType="numeric" />
      <Input label="Modalidade (ex: Presencial, Remoto)" value={modalidade} onChangeText={setModalidade} />
      <Input label="Localização" value={localizacao} onChangeText={setLocalizacao} />

      <View style={styles.buttonArea}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.amarelo1} />
        ) : (
          <Botão onPress={createVagaCLT}>
            <Text style={styles.textButton}>Criar Vaga</Text>
          </Botão>
        )}
      </View>
    </ScrollView>
  );
}

function Input({ label, value, onChangeText, multiline = false, keyboardType = 'default' }) {
  return (
    <View style={styles.inputArea}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[styles.input, multiline && { height: 100, textAlignVertical: 'top' }]}
        placeholder=""
        placeholderTextColor={colors.placeholder}
        value={value}
        onChangeText={onChangeText}
        multiline={multiline}
        keyboardType={keyboardType}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 20,
    backgroundColor: colors.fundo,
    flex: 1,
  },
  inputArea: {
    marginBottom: 15,
  },
  label: {
    color: colors.tituloBranco,
    marginBottom: 5,
    fontSize: 16,
    fontWeight: '500',
  },
  input: {
    backgroundColor: colors.fundo2,
    color: colors.tituloBranco,
    padding: 12,
    borderRadius: 12,
    fontSize: 16,
  },
  buttonArea: {
    marginTop: 30,
    alignItems: 'center',
  },
  textButton: {
    fontSize: 18,
    color: colors.texto,
  },
});
