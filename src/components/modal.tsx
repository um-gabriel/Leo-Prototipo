import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { colors } from '@/src/components/global';

type Item = {
  nome_vaga: string;
  nome_empresa: string;
  salario: number;
  descricaoVaga: string;
  modalidade: string;
  email: string;
  localizacao: string;
};

type MyModalProps = {
  visible: boolean;
  onClose: () => void;
  item: Item | null;
};

const MyModal: React.FC<MyModalProps> = ({ visible, onClose, item }) => {
  return (
    <Modal visible={visible} animationType="slide" transparent={true} onRequestClose={onClose}>
      <View style={styles.modalBackground}>
        <View style={styles.modalContainer}>
          {item ? (
            <>
              <Text style={styles.modalTitle}>{item.nome_vaga}</Text>
              <Text style={styles.modalSubtitle}>{item.nome_empresa}</Text>

              <Text style={styles.modalText}>Salário: R$ {item.salario}</Text>
              <Text style={styles.modalText}>Modalidade: {item.modalidade}</Text>
              <Text style={styles.modalText}>Descrição: {item.descricaoVaga}</Text>
              <Text style={styles.modalText}>Contato: {item.email}</Text>
              <Text style={styles.modalText}>Localização: {item.localizacao}</Text>

              {/* View que empurra os botões pro final */}
              <View style={{ flex: 1 }} />

              {/* Botões lado a lado */}
              <View style={styles.buttonContainer}>
                <TouchableOpacity onPress={onClose} style={styles.button}>
                  <Text style={styles.buttonText}>Fechar</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => console.log('Candidatar-se')} style={styles.button}>
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
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '100%',
    height: '90%',
    backgroundColor: colors.cinza,
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  modalTitle: {
    fontSize: 45,
    fontWeight: 'bold',
    color: colors.tituloBranco,
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    color: colors.amarelo1,
    marginBottom: 20,
  },
  modalText: {
    fontSize: 16,
    color: colors.tituloBranco,
    marginBottom: 10,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  button: {
    flex: 1,
    backgroundColor: colors.amarelo2,
    paddingVertical: 12,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: colors.tituloBranco,
  },
});

export default MyModal;
