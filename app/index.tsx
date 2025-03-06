import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router'; // Importar o hook useRouter
import React from 'react';

// OLA MUNDO!scwfwefsfsvv

export default function Index() {
  const router = useRouter(); // Inicializar o router

  const handleNavigate = () => {
    router.replace('/(tabs)/(drawer)/settings'); // Navegar para a pasta 'tabs'
  };

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{fontSize:30}}>Tela de Login</Text>
      <Button 
        title='Navegar'
        onPress={handleNavigate} // Chama a função handleNavigate ao pressionar o botão
      />
    </View>
  );
}
