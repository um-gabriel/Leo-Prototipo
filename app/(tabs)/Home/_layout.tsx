import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs } from 'expo-router';
import React from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function Layout() {
  return (
    <Tabs screenOptions={{ 
      headerShown: false 
    }}> 
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
