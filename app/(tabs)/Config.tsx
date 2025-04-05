import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, Alert, TouchableOpacity } from 'react-native';
import { colors } from '@/src/components/global';
import { TxtInput, Botão, BotãoInicio } from '@/src/components/objects';
import { verification, width } from '@/src/firebase/functions/interface';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '@/src/firebase/config';
import { deleteAcount } from '@/src/firebase/functions/delete/deleteAccount';

export default function Config() {
  const [newName, setNewName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmAtualPassword, setConfirmAtualPassword] = useState('');

  const handleUpdate = async () => {
    try {
      const uid = verification()?.uid;
      if (!uid) {
        Alert.alert("Erro", "Usuário não autenticado.");
        return;
      }

      const docRef = doc(db, 'Contas', uid);
      await updateDoc(docRef, { email: newEmail });

      Alert.alert("Sucesso", "Campo atualizado com sucesso!");
    } catch (error) {
      console.error("Erro ao atualizar o documento:", error);
      Alert.alert("Erro", "Não foi possível atualizar o documento.");
    }
  };

  function delet() {
      deleteAcount()
  }

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>Personalize sua experiência</Text>

        {/* Seção de Alteração de Dados */}
        <View style={styles.section}>
          <TxtInput
            value={newName}
            onChangeText={setNewName}
            placeholder="Nome novo"
            placeholderTextColor={colors.tituloBranco}
          />

          <TxtInput
            value={newEmail}
            onChangeText={setNewEmail}
            placeholder="Email novo"
            placeholderTextColor={colors.tituloBranco}
          />

          <TxtInput
            value={newPassword}
            onChangeText={setNewPassword}
            placeholder="Senha nova"
            placeholderTextColor={colors.tituloBranco}
            secureTextEntry
          />

          <TxtInput
            value={confirmAtualPassword}
            onChangeText={setConfirmAtualPassword}
            placeholder="Confirme sua senha"
            placeholderTextColor={colors.tituloBranco}
            secureTextEntry
          />

          <TouchableOpacity onPress={() => handleUpdate} style={styles.button} >
            <Text style={styles.buttonText}>Salvar Alterações</Text>
          </TouchableOpacity>
        </View>

        {/* Seção de Deletar Conta */}
        <View style={styles.section_excluid} >
          <Text style={{fontSize: 20, color: colors.tituloBranco, marginBottom: 20,}} >
              Deseja excluir sua conta
          </Text>
          <Botão onPress={() => delet()}>
            <Text style={styles.deleteText}>Deletar sua conta</Text>
          </Botão>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.preto,
  },
  scrollContainer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  title: {
    fontSize: 40,
    color: colors.amarelo2,
    fontWeight: 'bold',
    marginTop: 40,
  },
  subtitle: {
    fontSize: 18,
    color: colors.amarelo2,
    marginTop: 10,
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    width: width * 0.9,
    maxHeight: 450,
    backgroundColor: colors.fundo,
    borderRadius: 15,
    marginTop: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {        
    width: '90%',
    height: 50,
    backgroundColor: colors.amarelo2,
    borderRadius: 10,
    marginTop: 35,
    marginBottom: 20,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.preto,
  },

  section_excluid: {
    width: width * 0.9,
    minHeight: 150,
    backgroundColor: colors.fundo,
    borderRadius: 15,
    marginTop: 20,
    padding: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  deleteText: {
    fontSize: 18,
    color: colors.fundo2,
    fontWeight: 'bold',
  },
});