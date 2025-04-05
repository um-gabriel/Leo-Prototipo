import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, ActivityIndicator, Alert } from 'react-native';
import { Botão } from '@/src/components/objects';
import { colors } from '@/src/components/global';
import { width } from '@/src/firebase/functions/interface';

export default function FormVagaCLT() {
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      Alert.alert('Sucesso!', 'Vaga CLT cadastrada com sucesso.');
    }, 1500);
  };

  return (
    <View style={styles.form}>
      <Campo label="Nome da Vaga" valor="Auxiliar Administrativo" />
      <Campo label="Empresa" valor="Tech Solutions Ltda." />
      <Campo label="Salário" valor="R$ 2.500" />
      <Campo label="Localização" valor="Belo Horizonte - MG" />
      <Campo label="Setor" valor="Administrativo" />
      <Campo label="E-mail para contato" valor="rh@techsolutions.com" />
      <Campo label="Descrição" valor="Auxiliar em rotinas administrativas e atendimento ao cliente." />

      <View style={styles.buttonArea}>
        {loading ? (
          <ActivityIndicator size="large" color={colors.amarelo1} />
        ) : (
          <Botão onPress={handleSubmit}>
            <Text style={styles.textButton}>Criar Vaga</Text>
          </Botão>
        )}
      </View>
    </View>
  );
}

const Campo = ({ label, valor }: { label: string; valor: string }) => (
  <View style={styles.inputArea}>
    <Text style={styles.label}>{label}</Text>
    <TextInput style={styles.input} defaultValue={valor} placeholderTextColor="#888" />
  </View>
);

const styles = StyleSheet.create({
  form: {
    paddingHorizontal: 20,
  },
  inputArea: {
    marginBottom: 15,
  },
  label: {
    color: colors.tituloBranco,
    marginBottom: 5,
  },
  input: {
    backgroundColor: colors.fundo2,
    color: colors.tituloBranco,
    padding: 10,
    borderRadius: 10,
  },
  buttonArea: {
    marginTop: 20,
    alignItems: 'center',
  },
  textButton: {
    fontSize: 18,
    color: colors.texto,
  },
});
