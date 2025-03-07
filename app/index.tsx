import { View, Text, Button } from 'react-native';
import { useRouter } from 'expo-router'; // Importar o hook useRouter
import React from 'react';

// OLA MUNDO!scwfwefsfsvv

export default function Index() {
  const router = useRouter(); // Inicializar o router

  const handleNavigateLogin = () => {
    router.replace('/login'); // Navegar para a pasta 'tabs'
  };
  const handleNavigateCreate = () => {
    router.replace('/createAccount'); // Navegar para a pasta 'tabs'
  };

  return (
    <View style={{flex:1,justifyContent:'center',alignItems:'center'}}>
      <Text style={{fontSize:30}}>Tela de Login</Text>
      <Button 
        title='Login'
        onPress={handleNavigateLogin} // Chama a função handleNavigate ao pressionar o botão
      />
      <Button 
        title='Criar conta'
        onPress={handleNavigateCreate} // Chama a função handleNavigate ao pressionar o botão
      />
    </View>
  );
}
