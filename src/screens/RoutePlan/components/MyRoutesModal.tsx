import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SavedRoute } from '../../../types/route';
import { useLocation } from '../../../hooks/useLocation';
import RouteCard from './RouteCard';
import { styles } from './styles';

interface MyRoutesModalProps {
  visible: boolean;
  onClose: () => void;
  routes: SavedRoute[];
  loading?: boolean;
  onEditRoute: (route: SavedRoute) => void;
  onDeleteRoute: (id: string) => void;
  onStartRoute: (route: SavedRoute) => void;
}

export default function MyRoutesModal({
  visible,
  onClose,
  routes,
  loading = false,
  onEditRoute,
  onDeleteRoute,
  onStartRoute,
}: MyRoutesModalProps) {
  // Mesmo hook que ActivityStart já usa — busca a localização atual uma
  // vez, pra calcular "a X km de distância" em cada cartão.
  const { location } = useLocation();
  const currentLocation = location
    ? { latitude: location.coords.latitude, longitude: location.coords.longitude }
    : null;

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Minhas rotas</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          {loading && routes.length === 0 ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color="#061414" />
            </View>
          ) : routes.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="map-outline" size={28} color="#999" />
              <Text style={styles.emptyText}>Você ainda não salvou nenhuma rota</Text>
            </View>
          ) : (
            <FlatList
              data={routes}
              keyExtractor={(item) => item.id}
              style={styles.list}
              contentContainerStyle={{ paddingBottom: 12 }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <RouteCard
                  route={item}
                  currentLocation={currentLocation}
                  onEdit={() => onEditRoute(item)}
                  onDelete={() => onDeleteRoute(item.id)}
                  onStart={() => onStartRoute(item)}
                />
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
