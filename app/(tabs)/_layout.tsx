import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ 
      flex: 1 
      }}>
      <Drawer>

        <Drawer.Screen 
            name="Home"
            options={{
              title:"Home",
            }}
        />
        <Drawer.Screen 
            name="Avisos"
            options={{
              title:"Avisos",
            }}
        />
        <Drawer.Screen 
            name="Geral"
            options={{
              title:"Oportunidades em geral",
            }}
        />
        <Drawer.Screen 
            name="CreateJob"
            options={{
              title:"Criar vagas ou serviços",
            }}  
        />
        <Drawer.Screen 
            name="Config"
            options={{
              title:"Configurações",
            }}
        />

      </Drawer>
    </GestureHandlerRootView>
  );
}
