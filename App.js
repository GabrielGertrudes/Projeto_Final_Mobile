import 'react-native-gesture-handler'; 
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { useFonts } from 'expo-font';
import { StatusBar } from 'expo-status-bar';
import { theme } from './src/constants/theme';
import RotasPrincipais from './src/routes/RotasPrincipais';

export default function App() {
  const [fontsLoaded] = useFonts({
    'Lora-Regular': require('./src/assets/fonts/Lora-Regular.ttf'),
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <NavigationContainer>
      <PaperProvider theme={theme}>
        <StatusBar style="light" />
        <RotasPrincipais />
      </PaperProvider>
    </NavigationContainer>
  );
}