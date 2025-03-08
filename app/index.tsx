// 'PAGINA INICIAL'
import React, { useEffect, useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { Link, useRouter } from 'expo-router'; // TENTANDO FAZER A NAVEGAÇÃO
import { colors } from '../src/components/global';
import { BotãoInicio } from '../src/components/objects';
import { Dimensions } from 'react-native';

// DIMENSÕES DA TELA Q CONVERSAMOS
const { width, height } = Dimensions.get('window');

export default function Index() {
  const router = useRouter();
  const [loading, setLoading] = useState(true); // Estado para controlar a tela de carregamento

  const handleLoginPress = () => router.replace('/login');
  const handleCreateAccountPress = () => router.replace('/createAccount');

  // Efeito para animar a entrada ao montar o componente
    useEffect(() => {
    // Simula um carregamento
    const loadData = async () => {
      // Simule um atraso para a tela de carregamento
      await new Promise(resolve => setTimeout(resolve, 4000)); // 2 segundos
      setLoading(false); // Oculta a tela de carregamento
    }; loadData();
    })


  // if (loading) {
  //   // Tela de carregamento
  //   return (
  //     <View style={styles.loadingContainer}>
  //       <ActivityIndicator size="large" color={colors.amarelo1} />
  //       <Text style={styles.loadingText}>Carregando...</Text>
  //     </View>
  //   );
  // }

  return (
    <View style={styles.container}>
      <View style={styles.topContainer}></View>

      <View style={styles.bottomContainer}>
        <View style={styles.areaButton}>
          <BotãoInicio onPress={handleLoginPress}>
            <Text style={styles.buttonText}>
              Entre na sua conta              
            </Text>
          </BotãoInicio>
          <BotãoInicio onPress={handleCreateAccountPress}>
            <Text style={styles.buttonText}>
              Crie sua conta
            </Text>
          </BotãoInicio>
        </View>

        <Link href={'/(tabs)/Home/Home'} style={styles.linkText}>
          Entrar em uma conta
        </Link>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242424'
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#242424'
  },
  loadingText: {
    color: '#fff',
    marginTop: 10,
    fontSize: 18,
  },
  topContainer: {
    height: height * 0.6
  },
  bottomContainer: {
    width: width * 1,
    height: height * 0.4,
    justifyContent: 'center',
    alignItems: 'center'
  },
  areaButton: {
    width: width * 1,
    height: 180,
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  buttonText: {
    fontSize: 20,
    color: colors.preto,
  },
  linkText: {
    fontSize: 18,
    color: '#fff',
    marginTop: 10
  }
});