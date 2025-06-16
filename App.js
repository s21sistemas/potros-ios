import React, { useEffect, useState } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { auth } from './firebaseConfig';

// Importar pantallas
import LoginScreen from './screens/LoginScreen';
import RegisterScreen from './screens/RegisterScreen';
import ForgotPasswordScreen from './screens/ForgotPasswordScreen';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import AvisosScreen from './screens/AvisosScreen';
import PagosScreen from './screens/PagosScreen';
import EquipamientoScreen from './screens/EquipamientoScreen';

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

// Crear referencia de navegación
export const navigationRef = createNavigationContainerRef();

const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'HomeScreen') {
          iconName = focused ? 'add-circle' : 'add-circle-outline';
        } else if (route.name === 'Perfil') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Avisos') {
          iconName = focused ? 'notifications' : 'notifications-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#b51f28',
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { backgroundColor: '#fff' },
      headerStyle: { backgroundColor: '#b51f28' },
      headerTintColor: '#fff',
    })}
  >
    <Tab.Screen 
      name="HomeScreen" 
      component={HomeScreen}
      options={{ title: 'Registro' }}
    />
    <Tab.Screen name="Perfil" component={ProfileScreen} />
    <Tab.Screen name="Avisos" component={AvisosScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    let unsubscribe;
    
    try {
      unsubscribe = auth.onAuthStateChanged(
        (user) => {
          console.log('Usuario actual:', user?.uid || 'No autenticado');
          setIsLoggedIn(!!user);
          setIsLoading(false);
          setAuthError(null);
        },
        (error) => {
          console.error('Error de autenticación:', error);
          setAuthError(error.message);
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error al configurar auth listener:', error);
      setAuthError(error.message);
      setIsLoading(false);
    }

    // Timeout de seguridad
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Timeout de autenticación');
        setIsLoading(false);
      }
    }, 10000);

    return () => {
      clearTimeout(timeout);
      if (unsubscribe) {
        unsubscribe();
      }
    };
  }, []);

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b51f28" />
        <Text style={styles.loadingText}>Cargando ClubPotros...</Text>
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" backgroundColor="#b51f28" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator 
          initialRouteName={isLoggedIn ? 'MainTabs' : 'Login'}
          screenOptions={{
            headerStyle: { backgroundColor: '#b51f28' },
            headerTintColor: '#fff',
          }}
        >
          {!isLoggedIn ? (
            <>
              <Stack.Screen 
                name="Login" 
                component={LoginScreen}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Register" 
                component={RegisterScreen}
                options={{ title: 'Registro' }}
              />
              <Stack.Screen 
                name="ForgotPassword" 
                component={ForgotPasswordScreen}
                options={{ title: 'Recuperar Contraseña' }}
              />
            </>
          ) : (
            <>
              <Stack.Screen 
                name="MainTabs" 
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <Stack.Screen 
                name="Pagos" 
                component={PagosScreen}
                options={{ title: 'Estado de Pagos' }}
              />
              <Stack.Screen 
                name="Equipamiento" 
                component={EquipamientoScreen}
                options={{ title: 'Equipamiento' }}
              />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
});

export default App;