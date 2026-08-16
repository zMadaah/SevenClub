import React, { useMemo, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

import { MOCK_NOTIFICATIONS } from '../../services/mock/notification';
import { NotificationCategory, NotificationItem } from '../../types/notification';
import { colors } from '../../theme/colors';
import { styles } from './styles';

type FilterKey = 'all' | NotificationCategory;

const TABS: { key: FilterKey; label: string }[] = [
  { key: 'all', label: 'Todos' },
  { key: 'territory', label: 'Território' },
  { key: 'invite', label: 'Invites' },
  { key: 'community', label: 'Comunidade' },
  { key: 'sevenclub', label: 'SevenClub' },
];

const CATEGORY_ICON: Record<NotificationCategory, { name: string; lib: 'ionicons' | 'mci' }> = {
  territory: { name: 'flag', lib: 'ionicons' },
  invite: { name: 'mail-outline', lib: 'ionicons' },
  community: { name: 'chatbubbles-outline', lib: 'ionicons' },
  sevenclub: { name: 'trophy-outline', lib: 'ionicons' },
};

export default function Notifications() {
  const navigation = useNavigation();
  const [filter, setFilter] = useState<FilterKey>('all');
  const [items, setItems] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const filteredItems = useMemo(() => {
    if (filter === 'all') return items;
    return items.filter((item) => item.category === filter);
  }, [items, filter]);

  function handlePressItem(id: string) {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, read: true } : item))
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="chevron-back" size={22} color={colors.textPrimary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notificações</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabsScroll}
        contentContainerStyle={styles.tabsScrollContent}
      >
        {TABS.map((tab) => {
          const active = tab.key === filter;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabPill, active && styles.tabPillActive]}
              onPress={() => setFilter(tab.key)}
            >
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {filteredItems.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="notifications-off-outline" size={28} color={colors.textMuted} />
          <Text style={styles.emptyText}>Nada por aqui ainda</Text>
        </View>
      ) : (
        <FlatList
          data={filteredItems}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.list}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => {
            const icon = CATEGORY_ICON[item.category];
            return (
              <TouchableOpacity
                style={styles.row}
                activeOpacity={0.7}
                onPress={() => handlePressItem(item.id)}
              >
                <View style={styles.iconCircle}>
                  <Ionicons name={icon.name as any} size={18} color={colors.richBlack} />
                </View>

                <View style={styles.rowInfo}>
                  <Text style={[styles.rowTitle, !item.read && styles.rowTitleUnread]}>
                    {item.title}
                  </Text>
                  <Text style={styles.rowSubtitle}>{item.subtitle}</Text>
                </View>

                <View style={styles.rowRight}>
                  <Text style={styles.rowTime}>{item.timeAgo}</Text>
                  {!item.read && <View style={styles.unreadDot} />}
                </View>
              </TouchableOpacity>
            );
          }}
        />
      )}
    </View>
  );
}