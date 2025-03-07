import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Drawer } from 'expo-router/drawer';

export default function Layout() {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer>

        <Drawer.Screen 
            name="Home"
        />
        <Drawer.Screen 
            name="Avisos"
        />
        <Drawer.Screen 
            name="Config"
        />
        <Drawer.Screen 
            name="CreateJob"
        />

      </Drawer>
    </GestureHandlerRootView>
  );
}
