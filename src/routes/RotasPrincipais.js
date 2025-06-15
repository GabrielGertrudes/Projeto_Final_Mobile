import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { FontAwesome } from '@expo/vector-icons';
import { useTheme } from 'react-native-paper';


import TelaEstante from '../screens/Livros/TelaEstante';
import TelaAdicionarLivro from '../screens/Livros/TelaAdicionarLivro';
import TelaEditarLivro from '../screens/Livros/TelaEditarLivro';

import TelaAutores from '../screens/Autores/TelaAutores';
import TelaAdicionarAutor from '../screens/Autores/TelaAdicionarAutor';
import TelaEditarAutor from '../screens/Autores/TelaEditarAutor';

import TelaDesejos from '../screens/Desejos/TelaDesejos';

import TelaCitacoes from '../screens/Citacoes/TelaCitacoes';
import TelaAdicionarCitacao from '../screens/Citacoes/TelaAdicionarCitacao';
import TelaEditarCitacao from '../screens/Citacoes/TelaEditarCitacao';


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();


function RotasAbas() {

  const { colors } = useTheme();

  return (
    <Tab.Navigator
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontFamily: 'Lora-Regular',
        },
      }}
    >
      <Tab.Screen
        name="TelaEstante"
        component={TelaEstante}
        options={{
          title: 'Estante',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="book" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TelaDesejos"
        component={TelaDesejos}
        options={{
          title: 'Desejos',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list-ul" color={color} size={size} />
          ),
        }}
      />
      <Tab.Screen
        name="TelaAutores"
        component={TelaAutores}
        options={{
          title: 'Autores',
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="users" color={color} size={size} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}


export default function RotasPrincipais() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="RotasAbas"
        component={RotasAbas}
        options={{ headerShown: false }}
      />
      <Stack.Screen name="TelaAdicionarLivro" component={TelaAdicionarLivro} options={{ title: 'Adicionar Livro', presentation: 'modal' }} />
      <Stack.Screen name="TelaEditarLivro" component={TelaEditarLivro} options={{ title: 'Editar Livro', presentation: 'modal' }} />
      <Stack.Screen name="TelaAdicionarAutor" component={TelaAdicionarAutor} options={{ title: 'Adicionar Autor', presentation: 'modal' }} />
      <Stack.Screen name="TelaEditarAutor" component={TelaEditarAutor} options={{ title: 'Editar Autor', presentation: 'modal' }} />
      <Stack.Screen name="TelaCitacoes" component={TelaCitacoes} options={{ presentation: 'modal', headerShown: false }} />
      <Stack.Screen name="TelaAdicionarCitacao" component={TelaAdicionarCitacao} options={{ title: 'Nova Citação', presentation: 'modal' }} />
      <Stack.Screen name="TelaEditarCitacao" component={TelaEditarCitacao} options={{ title: 'Editar Citação', presentation: 'modal' }} />
    </Stack.Navigator>
  );
}
