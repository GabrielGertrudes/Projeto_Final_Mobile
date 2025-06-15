import { MD3LightTheme as DefaultTheme } from 'react-native-paper';

export const theme = {
  ...DefaultTheme,

  version: 3, 

  colors: {
    ...DefaultTheme.colors,
    primary: '#4A5D54', 
    secondary: '#A88B64',
    background: '#F8F4E8',
    surface: '#FFFFFF',
    surfaceVariant: '#E8E0D1', 
    onSurface: '#1C1B1F',
    elevation: {
      ...DefaultTheme.colors.elevation,
      level2: '#F3EDDF',
    }
  },
};