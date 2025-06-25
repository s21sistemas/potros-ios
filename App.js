import React, { useEffect, useState } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';
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

// MainTabs SIN el tab de HomeScreen (registro)
const MainTabs = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Perfil') {
          iconName = focused ? 'person' : 'person-outline';
        } else if (route.name === 'Avisos') {
          iconName = focused ? 'notifications' : 'notifications-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#b51f28', // Tu color amarillo
      tabBarInactiveTintColor: 'gray',
      tabBarStyle: { backgroundColor: '#fff' },
    })}
  >
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
        },
        (error) => {
          console.error('Error en Auth State:', error);
          setAuthError('Error de autenticación');
          setIsLoading(false);
        }
      );
    } catch (error) {
      console.error('Error configurando auth listener:', error);
      setAuthError('Error al configurar autenticación');
      setIsLoading(false);
    }

    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Auth check timeout');
        setIsLoading(false);
      }
    }, 5000);

    return () => {
      clearTimeout(timeout);
      if (unsubscribe) unsubscribe();
    };
  }, []);

  if (isLoading) {
    return (
      <SafeAreaProvider>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#b51f28" />
          <Text style={styles.loadingText}>Cargando ClubPotros...</Text>
        </View>
        <StatusBar style="light" backgroundColor="#b51f28" />
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="dark" backgroundColor="#ffffff" />
      <NavigationContainer ref={navigationRef}>
        <Stack.Navigator initialRouteName={isLoggedIn ? 'MainTabs' : 'Login'}>
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
                options={{ headerShown: false }} 
              />
              <Stack.Screen
                name="ForgotPassword"
                component={ForgotPasswordScreen}
                options={{ headerShown: false }}
              />
            </>
          ) : null}

          <Stack.Screen
            name="MainTabs"
            component={MainTabs}
            options={{ headerShown: false }}
          />
          
          {/* HomeScreen ahora es una pantalla independiente accesible desde Perfil */}
          <Stack.Screen
            name="RegistrarJugador"
            component={HomeScreen}
            options={({ navigation }) => ({
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                  <Ionicons name="arrow-back" size={24} color="#fff" />
                </TouchableOpacity>
              ),
              title: 'Registrar Jugador',
              headerTitleAlign: 'center',
              headerStyle: { backgroundColor: '#b51f28' },
              headerTintColor: '#fff',
            })}
          />
          
          <Stack.Screen
            name="Pagos"
            component={PagosScreen}
            options={({ navigation }) => ({
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                  <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
              ),
              title: 'Pagos del Jugador',
              headerTitleAlign: 'center',
            })}
          />
          <Stack.Screen
            name="Equipamiento"
            component={EquipamientoScreen}
            options={({ navigation }) => ({
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginLeft: 15 }}>
                  <Ionicons name="arrow-back" size={24} color="#000" />
                </TouchableOpacity>
              ),
              title: 'Equipamiento',
              headerTitleAlign: 'center',
            })}
          />
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
    backgroundColor: '#FFF',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
});

export default App;