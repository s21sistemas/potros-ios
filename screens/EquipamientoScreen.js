import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ActivityIndicator,
  TouchableOpacity,
  SafeAreaView,
  Dimensions,
  Platform,
  FlatList,
  RefreshControl, ScrollView
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebaseConfig';

const { width, height } = Dimensions.get('window');

const EquipamientoScreen = ({ route, navigation }) => {
  const [equipamiento, setEquipamiento] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [asignados, setAsignados] = useState([]);
  const [refreshing, setRefreshing] = useState(false);
  const { jugadorId } = route.params;
  
  const fetchEquipamiento = async () => {
    try {
      setLoading(true);
      console.log('Buscando equipamiento para jugadorId:', jugadorId);
      
      const q = query(
        collection(db, 'equipamiento'), 
        where('jugadorId.value', '==', jugadorId)
      );
      
      const querySnapshot = await getDocs(q);
      
      if (!querySnapshot.empty) {
        const docData = querySnapshot.docs[0].data();
        console.log('Datos completos de Firestore:', JSON.stringify(docData, null, 2));
        
        setEquipamiento(docData);
        const itemsAsignados = processEquipamientoAsignado(docData);
        console.log('Items asignados procesados:', itemsAsignados);
        setAsignados(itemsAsignados);
      } else {
        setError('No se encontró registro de equipamiento');
      }
    } catch (err) {
      console.error('Error al obtener equipamiento:', err);
      setError('Error al cargar el equipamiento');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEquipamiento();
  }, [jugadorId]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEquipamiento();
  };

  const processEquipamientoAsignado = (docData) => {
    const itemsAsignados = [];
    const jugadorNombre = docData.jugadorId?.label || 'Jugador desconocido';

    if (Array.isArray(docData.equipamiento_asignado)) {
      docData.equipamiento_asignado.forEach((item) => {
        if (!item) return;

        const itemCompleto = {
          id: `${item.label || 'item'}_${Date.now()}_${Math.random().toString(36).substr(2, 5)}`,
          nombre: item.label || 'Sin nombre',
          jugador: jugadorNombre,
          fecha_asignacion: docData.fecha_asignacion || 'No especificada',
          fecha_entrega: docData.fecha_entrega || 'No especificada',
          devuelto: docData.devuelto || 'NO',
          asignado: true,
          ...item, // Incluye TODOS los campos del item
        };

        itemsAsignados.push(itemCompleto);
      });
    }

    return itemsAsignados;
  };

  const renderEquipoItem = ({ item }) => {
    const excludedKeys = ['id', 'nombre', 'jugador', 'fecha_asignacion', 'fecha_entrega', 'devuelto', 'asignado'];
    const dynamicFields = Object.keys(item).filter(key => !excludedKeys.includes(key));

    return (
      <View style={styles.equipoItem}>
        <Text style={styles.equipoName}>{item.nombre}</Text>
        
        <View style={styles.detailRow}>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Fecha asignación: </Text>
          <Text style={styles.detailValue}>{item.fecha_asignacion}</Text>
        </View>

          {dynamicFields.map((field) => (
            field !== 'value' && field !== 'label' && (
              <View key={field} style={styles.detailRow}>
                <Text style={styles.detailLabel}>
                  {field.replace(/_/g, ' ')}: {/* Reemplaza todos los "_" por espacios */}
                </Text>
                <Text style={styles.detailValue}>
                  {typeof item[field] === 'object' 
                    ? JSON.stringify(item[field]) 
                    : String(item[field])}
                </Text>
              </View>
            )
          ))}

        <View style={[styles.statusBadge, item.devuelto === "NO" ? styles.statusPending : styles.statusReturned]}>
          <Text style={styles.statusBadgeText}>
            {item.devuelto === "NO" ? "PENDIENTE POR DEVOLVER" : "DEVUELTO"}
          </Text>
        </View>
      </View>
    );
  };

  if (loading && !refreshing) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#b51f28" />
        <Text style={styles.loadingText}>Cargando equipamiento...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            fetchEquipamiento();
          }}
        >
          <Text style={styles.retryButtonText}>Reintentar</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
       <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
              >
          <View style={styles.container}>
            <View style={styles.header}>
              <Text style={styles.title}>EQUIPAMIENTO ASIGNADO A: {equipamiento?.jugadorId?.label || 'Jugador'}</Text>
              {equipamiento?.numero && (
                <Text style={styles.playerNumber}>Número: {equipamiento.numero}</Text>
              )}
            </View>

            <FlatList
              data={asignados}
              renderItem={renderEquipoItem}
              keyExtractor={item => item.id}
              refreshControl={
                <RefreshControl
                  refreshing={refreshing}
                  onRefresh={onRefresh}
                  colors={['#b51f28']}
                  tintColor="#b51f28"
                />
              }
              ListEmptyComponent={
                <View style={styles.noDataContainer}>
                  <Text style={styles.noDataText}>No hay equipamiento asignado</Text>
                  <TouchableOpacity
                    style={styles.retryButton}
                    onPress={fetchEquipamiento}
                  >
                    <Text style={styles.retryButtonText}>Actualizar</Text>
                  </TouchableOpacity>
                </View>
              }
              contentContainerStyle={asignados.length === 0 ? { flex: 1 } : null}
            />
          </View>

    </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  container: {
    flex: 1,
    padding: 20,
    maxWidth: 800,
    width: '100%',
    height:'150%',
    alignSelf: 'center'
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  loadingText: {
    marginTop: 20,
    fontSize: 16,
    color: '#333',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  errorText: {
    fontSize: 16,
    color: '#b51f28',
    marginBottom: 20,
    textAlign: 'center',
  },
  noDataContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  noDataText: {
    fontSize: 16,
    color: '#777',
    marginBottom: 20,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#b51f28',
    paddingVertical: 12,
    paddingHorizontal: 25,
    borderRadius: 5,
    elevation: 2,
  },
  retryButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  header: {
    flexDirection: 'column',
    alignItems: 'center',
    marginBottom: 20,
    width: '100%',
    position: 'relative',
  },
  backButton: {
    position: 'absolute',
    left: 0,
    top: Platform.OS === 'ios' ? 0 : 20,
    zIndex: 1,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#b51f28',
    marginBottom: 5,
    textTransform: 'uppercase',
    textAlign: 'center',
  },
  playerNumber: {
    fontSize: 16,
    color: '#333',
    fontWeight: '600',
    textAlign: 'center',
  },
  equipoItem: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 15,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
  },
  equipoName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: 'row',
    marginTop: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    width: 120,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    flex: 1,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 4,
    marginTop: 10,
  },
  statusPending: {
    backgroundColor: 'rgba(255, 160, 0, 0.1)',
  },
  statusReturned: {
    backgroundColor: 'rgba(76, 175, 80, 0.1)',
  },
  statusBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
   scrollView: {
    width: "100%",
    height: "150%",
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
    height: "150%"
  },
});

export default EquipamientoScreen;