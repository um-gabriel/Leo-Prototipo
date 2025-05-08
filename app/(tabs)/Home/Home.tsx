// Home.tsx

import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { Feather, FontAwesome6, MaterialIcons } from '@expo/vector-icons';
import { colors } from '@/src/components/global';
import { BotãoInicio, StatusBarObject } from '@/src/components/objects';
import { useRouter } from 'expo-router';
import { width, height, Vagas, verification } from '@/src/firebase/functions/interface';
import { getVagas } from '@/src/firebase/functions/get/getJobs';
import { createApplication } from '@/src/firebase/functions/create/createCandidatura';

export default function Home() {
  const [jobs, setJobs] = useState<Vagas[]>([]);
  const [loading, setLoading] = useState(true); // Estado de loading para carregar as vagas
  const [isApplying, setIsApplying] = useState(false); // NOVO: Estado de loading para a candidatura
  const router = useRouter();

  // ... (outras funções como boxSetores, CriarVagas, TextInfo)

  useEffect(() => {
    getVagas({ setJobs, setFilteredJobs: setJobs, setLoading });
  }, []);

  // ... (restante do código JSX)
  const boxSetores = (coleção: string, campo: string, valor: string) => {
    router.push(`../Geral?coleção=${coleção}&campo=${campo}&valor=${valor}`);
  };

  const CriarVagas = (coleçãoUnica: string) => {
    router.push(`../Geral?coleção=${coleçãoUnica}`);
  };

  useEffect(() => {
    getVagas({ setJobs, setFilteredJobs: setJobs, setLoading });
  }, []);

  const TextInfo = ({ label, value }: { label: string; value: string }) => (
    <View style={stylesVaga.box_mode}>
      <Text style={stylesVaga.mode}>{label}</Text>
      <Text style={stylesVaga.mode}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* ... (StatusBarObject, AreaTop) ... */}
      <StatusBarObject />

      <ScrollView>
        {/* ... (Áreas de vagas) ... */}
        <View style={styles.AreaTop}>
          <Text style={styles.AreaTop_Title}>Go 2 Work</Text>
          <Text style={styles.AreaTop_subTitle}>
            Encontre uma experiência que pode mudar sua vida bem aqui.
          </Text>
        </View>

        <View style={styles.content}>
        <Text style={styles.SubTitle}>Áreas de vagas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          
          <TouchableOpacity style={styles.BoxContainerEmpresas} onPress={() => boxSetores('Vagas-trabalho', 'setor', 'Saude')} >
            <View style={styles.boxImage}> <MaterialIcons name="health-and-safety" size={27} color={colors.amarelo2} /> </View>
            <Text style={styles.BoxContainerEmpresas_text}>Saúde</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.BoxContainerEmpresas} onPress={() => boxSetores('Vagas-trabalho', 'setor', 'Magia e produção')} >
            <View style={styles.boxImage}> <MaterialIcons name="computer" size={27} color={colors.amarelo2} /> </View>
            <Text style={styles.BoxContainerEmpresas_text}>TI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.BoxContainerEmpresas} onPress={() => boxSetores('Vagas-trabalho', 'setor', 'Engenharia')} >
            <View style={styles.boxImage}> <FontAwesome6 name="house-chimney" size={22} color={colors.amarelo2} /> </View>
            <Text style={styles.BoxContainerEmpresas_text}>Engenharia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.BoxContainerEmpresas} onPress={() => boxSetores('Vagas-trabalho', 'setor', 'Educacao')} >
            <View style={styles.boxImage}>
              <Feather name="book" size={24} color={colors.amarelo2} />
            </View>
            <Text style={styles.BoxContainerEmpresas_text}>Educação</Text>
          </TouchableOpacity>

        </ScrollView>

        <View style={styles.AreaVagas}>
          <Text style={styles.SubTitle}>Vagas relacionadas a tecnologia</Text>
          {loading ? ( // Loading das vagas
            <ActivityIndicator size="large" color={colors.amarelo1} />
          ) : (
            jobs.map((item) => (
              // Certifique-se de que 'item' tem um campo 'id' que é o ID do documento
              <View key={item.id} style={stylesVaga.item}>
                <Text style={stylesVaga.title}>{item.nome_vaga}</Text>
                <Text style={stylesVaga.subTitle}>{item.nome_empresa}</Text>
                <TextInfo label="Salário: R$" value={item.salario} />
                <TextInfo label="Modalidades:" value={item.modalidade} />
                <TextInfo label="Contato:" value={item.email} />
                <TextInfo label="Localização:" value={item.localizacao} />

                <TouchableOpacity
                  style={stylesVaga.buttonCandidatar}
                  // Desabilita o botão enquanto uma candidatura está sendo processada
                  onPress={async () => {
                    const user = verification(); // Assumindo que verification() retorna { uid: string, name_conta: string } | null
                    if (!user?.uid) {
                      alert('Erro: Usuário não autenticado');
                      return;
                    }

                    // NOVO: Inicia o estado de applying
                    setIsApplying(true);

                    try {
                      // CHAMA A NOVA FUNÇÃO
                      await createApplication(item.id, item.uid_criadorVaga); // Usa item.id para jobId
                      alert('Candidatura realizada com sucesso!');
                      // Opcional: Desabilitar o botão para esta vaga após candidatar
                    } catch (error) {
                      alert('Erro ao realizar candidatura.');
                      console.error(error);
                    } finally {
                      // NOVO: Finaliza o estado de applying
                      setIsApplying(false);
                    }
                  }}
                  // NOVO: Propriedade disabled para desabilitar o botão
                  disabled={isApplying}
                >
                   {/* NOVO: Mostra um indicador de loading no botão enquanto está aplicando */}
                  {isApplying ? (
                    <ActivityIndicator size="small" color={colors.tituloBranco} />
                  ) : (
                    <Text style={stylesVaga.buttonText}>Candidatar-se</Text>
                  )}
                </TouchableOpacity>
              </View>
            ))
          )}
          {/* ... (BotãoInicio) ... */}
          <BotãoInicio onPress={() => CriarVagas('Vagas-trabalho')}>
            <Text style={styles.TextButton}>Clique aqui para ver mais</Text>
          </BotãoInicio>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

/*
export default function Home() {
  const [jobs, setJobs] = useState<Vagas[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const boxSetores = (coleção: string, campo: string, valor: string) => {
    router.push(`../Geral?coleção=${coleção}&campo=${campo}&valor=${valor}`);
  };

  const CriarVagas = (coleçãoUnica: string) => {
    router.push(`../Geral?coleção=${coleçãoUnica}`);
  };

  useEffect(() => {
    getVagas({ setJobs, setFilteredJobs: setJobs, setLoading });
  }, []);

  const TextInfo = ({ label, value }: { label: string; value: string }) => (
    <View style={stylesVaga.box_mode}>
      <Text style={stylesVaga.mode}>{label}</Text>
      <Text style={stylesVaga.mode}>{value}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBarObject />
      
      <ScrollView>
        <View style={styles.AreaTop}>
          <Text style={styles.AreaTop_Title}>Go 2 Work</Text>
          <Text style={styles.AreaTop_subTitle}>
            Encontre uma experiência que pode mudar sua vida bem aqui.
          </Text>
        </View>

        <View style={styles.content}>
        <Text style={styles.SubTitle}>Áreas de vagas</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          
          <TouchableOpacity style={styles.BoxContainerEmpresas} onPress={() => boxSetores('Vagas-trabalho', 'setor', 'Saude')} >
            <View style={styles.boxImage}> <MaterialIcons name="health-and-safety" size={27} color={colors.amarelo2} /> </View>
            <Text style={styles.BoxContainerEmpresas_text}>Saúde</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.BoxContainerEmpresas} onPress={() => boxSetores('Vagas-trabalho', 'setor', 'Magia e produção')} >
            <View style={styles.boxImage}> <MaterialIcons name="computer" size={27} color={colors.amarelo2} /> </View>
            <Text style={styles.BoxContainerEmpresas_text}>TI</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.BoxContainerEmpresas} onPress={() => boxSetores('Vagas-trabalho', 'setor', 'Engenharia')} >
            <View style={styles.boxImage}> <FontAwesome6 name="house-chimney" size={22} color={colors.amarelo2} /> </View>
            <Text style={styles.BoxContainerEmpresas_text}>Engenharia</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.BoxContainerEmpresas} onPress={() => boxSetores('Vagas-trabalho', 'setor', 'Educacao')} >
            <View style={styles.boxImage}>
              <Feather name="book" size={24} color={colors.amarelo2} />
            </View>
            <Text style={styles.BoxContainerEmpresas_text}>Educação</Text>
          </TouchableOpacity>

        </ScrollView>
        
        <View style={styles.AreaVagas}>
            <Text style={styles.SubTitle}>Vagas relacionadas a tecnologia</Text>
            {loading ? (
              <ActivityIndicator size="large" color={colors.amarelo1} />
            ) : (
              jobs.map((item) => (
                <View key={item.id} style={stylesVaga.item}>
                  <Text style={stylesVaga.title}>{item.nome_vaga}</Text>
                  <Text style={stylesVaga.subTitle}>{item.nome_empresa}</Text>
                  <TextInfo label="Salário: R$" value={item.salario} />
                  <TextInfo label="Modalidades:" value={item.modalidade} />
                  <TextInfo label="Contato:" value={item.email} />
                  <TextInfo label="Localização:" value={item.localizacao} />
                  <TouchableOpacity
                    style={stylesVaga.buttonCandidatar}
                    onPress={async () => {
                      const user = verification();
                      if (!user?.uid) return alert('Erro: Usuário não autenticado');
                      try {
                        await handleAddVagaCLT({
                          userId: user.uid,
                          uidCriadorVaga: item.uid_criadorVaga,
                          nome_vaga: item.nome_vaga,
                          nome_candidato: user.name_conta,
                          setLoading,
                        });
                        alert('Candidatura realizada com sucesso!');
                      } catch (error) {
                        alert('Erro ao realizar candidatura.');
                        console.error(error);
                      }
                    }}
                  >
                    <Text style={stylesVaga.buttonText}>Candidatar-se</Text>
                  </TouchableOpacity>
                </View>
              ))
            )}
            <BotãoInicio onPress={() => CriarVagas('Vagas-trabalho')}>
              <Text style={styles.TextButton}>Clique aqui para ver mais</Text>
            </BotãoInicio>
          </View>
      </View>

      </ScrollView>
    </View>
  );
}
*/

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: colors.preto 
  },

  AreaTop: {
    padding: 22,
    // backgroundColor: colors.fundo2,
    borderBottomLeftRadius: 50, 
    borderBottomRightRadius: 50,
    alignItems: 'center', 
    justifyContent: 'center'
  },

  AreaTop_Title: { 
    fontSize: 50, 
    color: colors.amarelo2, 
    fontWeight: '600' 
  },

  AreaTop_subTitle: { 
    fontSize: 17, 
    color: colors.tituloBranco, 
    textAlign: 'center' 
  },

  content: { 
    padding: 15, 
    alignItems: 'center' 
  },

  BoxContainerEmpresas: {
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
    backgroundColor: colors.fundo2,
    borderRadius: 15,
    padding: 10,
    width: 100,
    height: 100,
  },

  BoxContainerEmpresas_text: {
    color: colors.tituloBranco,
    fontSize: 14,
    marginTop: 5,
    textAlign: 'center',
  },

  SubTitle: { 
    fontSize: 25, 
    fontWeight: 'bold', 
    color: colors.tituloBranco, 
    marginVertical: 15 
  },

  BoxSetor: {
    width: '100%', 
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 10
  },

  AreaVagas: { 
    width: width * 1, 
    alignItems: 'center', 
    marginTop: 20 
  },

  boxImage: {
    width: 50, 
    height: 50, 
    borderRadius: 25,
    alignItems: 'center', 
    justifyContent: 'center'
  },

  BoxText: { 
    fontSize: 20, 
    color: colors.tituloBranco, 
    marginLeft: 20 
  },

  TextButton: { 
    fontSize: 17, 
    color: colors.tituloBranco, 
    textAlign: 'center', 
    justifyContent: 'center', 
    alignItems: 'center', 
    fontWeight: 'bold'
  },
});

const stylesVaga = StyleSheet.create({
  item: {
    backgroundColor: colors.cinza,
    padding: 15, 
    borderRadius: 15, 
    marginVertical: 8,
    width: width * 0.9, 
    alignSelf: 'center', 
    alignItems: 'center',
  },

  title: { 
    fontSize: 35, 
    fontWeight: 'bold', 
    color: colors.tituloBranco 
  },

  subTitle: { 
    fontSize: 21, 
    color: colors.tituloAmarelo, 
    marginBottom: 10 
  },

  box_mode: {
    flexDirection: 'row', 
    justifyContent: 'space-between',
    width: '100%', 
    marginBottom: 2,
  },

  mode: { 
    fontSize: 17, 
    color: colors.tituloBranco, 
    paddingInline: 10, 
  },

  buttonCandidatar: {
    backgroundColor: colors.amarelo2,
    padding: 10, 
    borderRadius: 10, 
    marginTop: 20,
    alignItems: 'center'
  },

  buttonText: { 
    fontSize: 16, 
    color: colors.tituloBranco 
  },
});
