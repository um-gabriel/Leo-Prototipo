import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';
import { colors } from '@/src/components/global';
import { Ionicons } from '@expo/vector-icons'; // Importando ícones do Expo

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>
        <Drawer.Screen 
          name="Home"
          options={{
            title: "Home",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, // Altere 'red' para a cor desejada
            headerStyle: {
              backgroundColor: colors.fundo2, // Definindo a cor de fundo do cabeçalho
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="home-outline" size={24} color={color} /> // Ícone da Home
            ),
          }}
        />
        <Drawer.Screen 
          name="Avisos"
          options={{
            title: "Avisos",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, // Altere 'red' para a cor desejada
            headerStyle: {
              backgroundColor: colors.fundo2, // Definindo a cor de fundo do cabeçalho
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="notifications-outline" size={24} color={color} /> // Ícone de Avisos
            ),
          }}
        />
        <Drawer.Screen 
          name="Geral"
          options={{
            title: "Oportunidades em geral",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, // Altere 'red' para a cor desejada
            headerStyle: {
              backgroundColor: colors.fundo2, // Definindo a cor de fundo do cabeçalho
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="briefcase-outline" size={24} color={color} /> // Ícone Geral
            ),
          }}
        />
        <Drawer.Screen 
          name="CreateJob"
          options={{
            title: "Criar vagas ou serviços",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerStyle: {
              backgroundColor: colors.fundo2, // Definindo a cor de fundo do cabeçalho
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="add-circle-outline" size={24} color={color} /> // Ícone de Criar Vagas
            ),
          }}  
        />
        <Drawer.Screen 
          name="Config"
          options={{
            title: "Configurações",
            headerTitleStyle: {
              color: colors.tituloBranco
            },
            headerTintColor: colors.tituloBranco, // Altere 'red' para a cor desejada
            headerStyle: {
              backgroundColor: colors.fundo2, // Definindo a cor de fundo do cabeçalho
            },
            drawerIcon: ({ color }) => (
              <Ionicons name="settings-outline" size={24} color={color} /> // Ícone de Configurações
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}