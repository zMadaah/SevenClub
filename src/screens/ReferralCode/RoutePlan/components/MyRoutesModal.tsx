import React from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SavedRoute } from '../../../types/route';
import { styles } from './styles';

interface MyRoutesModalProps {
  visible: boolean;
  onClose: () => void;
  routes: SavedRoute[];
  loading?: boolean;
  onSelectRoute: (route: SavedRoute) => void;
  onDeleteRoute: (id: string) => void;
}

export default function MyRoutesModal({
  visible,
  onClose,
  routes,
  loading = false,
  onSelectRoute,
  onDeleteRoute,
}: MyRoutesModalProps) {
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
              ItemSeparatorComponent={() => <View style={styles.separator} />}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.routeRow}
                  onPress={() => onSelectRoute(item)}
                  activeOpacity={0.7}
                >
                  <View style={styles.routeIcon}>
                    <Ionicons name="trail-sign-outline" size={18} color="#061414" />
                  </View>

                  <View style={styles.routeInfo}>
                    <Text style={styles.routeName}>{item.name}</Text>
                    <Text style={styles.routeMeta}>
                      {(item.distanceMeters / 1000).toFixed(2)} km
                      {item.captureM2 > 0 ? ` · ${Math.round(item.captureM2)} m² capturados` : ''}
                    </Text>
                  </View>

                  <TouchableOpacity
                    onPress={() => onDeleteRoute(item.id)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    style={styles.deleteButton}
                  >
                    <Ionicons name="trash-outline" size={18} color="#D85A30" />
                  </TouchableOpacity>
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}