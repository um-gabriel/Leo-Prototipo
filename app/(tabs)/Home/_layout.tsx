import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          position: 'absolute',
          bottom: 8, // distancia da parte inferior da tela
          left: 20, // distancia da lateral esquerda
          right: 20, // distancia da lateral direita
          borderRadius: 15, // bordas arredondadas
          paddingHorizontal: 20,
          margin: 20,
          justifyContent: "center",
          height: 60, // altura da tab
          backgroundColor: 'white', // cor de fundo da tab
          elevation: 10, // sombra (para Android)
        },

        // tabBarShowLabel: false, // opcional: para esconder os labels das tabs
      }}
    >
      <Tabs.Screen 
        name="Home"
        options={{
          title: "",         
          tabBarLabelStyle: { 
            fontSize: 12, // ajuste o tamanho da fonte aqui
            fontWeight: 'bold', // opcional: para deixar o texto em negrito
          },
          tabBarIcon: ({ size, color, focused }) => {
              return <MaterialCommunityIcons name='home' color={color} size={33} top={5}/>
          },
        }}
        />
      </Tabs>
      
  );
}