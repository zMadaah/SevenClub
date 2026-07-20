import React, { useMemo, useState } from 'react';
import { Modal, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { SavedRoute } from '../../../types/route';
import { styles } from './RouteSelectModal.styles';

type SortBy = 'distance' | 'createdAt';

interface RouteSelectModalProps {
  visible: boolean;
  onClose: () => void;
  routes: SavedRoute[];
  onSelectRoute: (route: SavedRoute) => void;
  onPlanRoute: () => void;
}

export default function RouteSelectModal({
  visible,
  onClose,
  routes,
  onSelectRoute,
  onPlanRoute,
}: RouteSelectModalProps) {
  const [sortBy, setSortBy] = useState<SortBy>('createdAt');

  const sortedRoutes = useMemo(() => {
    const copy = [...routes];
    if (sortBy === 'distance') {
      return copy.sort((a, b) => a.distanceMeters - b.distanceMeters);
    }
    return copy.sort((a, b) => b.createdAt - a.createdAt);
  }, [routes, sortBy]);

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <View style={styles.sheet}>
          <View style={styles.header}>
            <Text style={styles.title}>Selecionar rota</Text>
            <TouchableOpacity onPress={onClose} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
              <Ionicons name="close" size={22} color="#111" />
            </TouchableOpacity>
          </View>

          <View style={styles.sortRow}>
            <Text style={styles.sortLabel}>Ordenar por:</Text>

            <TouchableOpacity onPress={() => setSortBy('distance')}>
              <Text
                style={[styles.sortOption, sortBy === 'distance' && styles.sortOptionActive]}
              >
                Distância
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setSortBy('createdAt')}>
              <Text
                style={[styles.sortOption, sortBy === 'createdAt' && styles.sortOptionActive]}
              >
                Criado em
              </Text>
            </TouchableOpacity>
          </View>

          {sortedRoutes.length === 0 ? (
            <View style={styles.emptyState}>
              <Text style={styles.emptyTitle}>Nenhuma rota salva</Text>
              <Text style={styles.emptySubtitle}>
                Planeje sua primeira rota para vê-la aqui.
              </Text>

              <TouchableOpacity style={styles.planButton} onPress={onPlanRoute}>
                <Text style={styles.planButtonText}>PLANEJAR ROTA</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <FlatList
              data={sortedRoutes}
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
                    </Text>
                  </View>

                  <Ionicons name="chevron-forward" size={18} color="#999" />
                </TouchableOpacity>
              )}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}