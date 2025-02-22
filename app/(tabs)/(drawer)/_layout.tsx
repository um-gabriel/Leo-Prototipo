import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { Tabs } from 'expo-router';
import React from 'react';

export default function Layout() {
  return (
    <Tabs>
        <Tabs.Screen 
        name="index"
        />
    </Tabs>
  );
}
