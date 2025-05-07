import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, ScrollView } from 'react-native';
import { colors } from '@/src/components/global';

type Item = {
  id: string;
  nome_vaga: string;
  nome_empresa: string;
  salario: number;
  descricaoVaga: string;
  modalidade: string;
  email: string;
  localizacao: string;
  setor: string;
  regime: string;
  uid_criadorVaga: string; // Supondo que também use isso em outros lugares
};

type MyModalProps = {
  visible: boolean;
  onClose: () => void;
  item: Item | null;
};

const MyModal: React.FC<MyModalProps> = ({ visible, onClose, item }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {item ? (
            <>
              <ScrollView contentContainerStyle={styles.content}>
                <Text style={styles.modalTitle}>{item.nome_vaga}</Text>
                <Text style={styles.modalSubtitle}>{item.nome_empresa}</Text>

                <Text style={styles.modalText}>Salário: R$ {item.salario}</Text>
                <Text style={styles.modalText}>Email de contato: {item.email}</Text>
                <Text style={styles.modalText}>Modalidade: {item.modalidade}</Text>
                <Text style={styles.modalText}>Localização: {item.localizacao}</Text>
                <Text style={styles.modalText}>Setor social: {item.setor}</Text>
                <Text style={styles.modalText}>Regime da vaga: {item.regime}</Text>
                <Text style={styles.modalText}>Descrição: {item.descricaoVaga}</Text>
              </ScrollView>

              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.button}>
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  // onPress={async () => {
                  //   const user = verification();
                  //   if (!user?.uid) return alert('Erro: Usuário não autenticado');
                  //   try {
                  //     await handleAddVagaCLT({
                  //       userId: user.uid,
                  //       uidCriadorVaga: item.uid_criadorVaga,
                  //       nome_vaga: item.nome_vaga,
                  //       nome_candidato: user.name_conta,
                  //       setLoading,
                  //     });
                  //     alert('Candidatura realizada com sucesso!');
                  //   } catch (error) {
                  //     alert('Erro ao realizar candidatura.');
                  //     console.error(error);
                  //   }
                  // }}
                >
                  <Text style={styles.buttonText}>Candidatar</Text>
                </TouchableOpacity>
              </View>
            </>
          ) : (
            <Text style={styles.modalText}>Nenhum item selecionado.</Text>
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '90%',
    height: '70%',
    backgroundColor: colors.cinza,
    borderRadius: 16,
    padding: 20,
    justifyContent: 'center',
  },
  content: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  modalTitle: {
    fontSize: 36,
    fontWeight: 'bold',
    color: colors.tituloAmarelo,
    marginBottom: 4,
    textAlign: 'center',
  },
  modalSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.tituloAmarelo,
    marginBottom: 16,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    color: colors.tituloBranco,
    textAlign: 'center',
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
    gap: 12,
  },
  button: {
    flex: 1,
    backgroundColor: colors.tituloAmarelo,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  buttonText: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.tituloBranco,
  },
});

export default MyModal;
