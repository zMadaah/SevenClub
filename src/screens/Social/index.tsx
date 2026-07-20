import React from 'react';
import { View, Image, Text, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import PostCard from './components/PostCard';
import { MOCK_FEED } from '../../services/mock/feed';
import { styles } from './styles';

export default function Social() {
  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Image source={{ uri: 'https://i.pravatar.cc/200?img=10' }} style={styles.avatar} />

        <View style={styles.filters}>
          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>Explorar</Text>
            <Ionicons name="chevron-down" size={14} color="#111" />
          </TouchableOpacity>

          <TouchableOpacity style={styles.filterPill}>
            <Text style={styles.filterText}>Todos</Text>
            <Ionicons name="chevron-down" size={14} color="#111" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="search" size={20} color="#111" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButton}>
          <Ionicons name="notifications-outline" size={20} color="#111" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={MOCK_FEED}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ItemSeparatorComponent={() => <View style={{ height: 16 }} />}
        renderItem={({ item }) => <PostCard post={item} />}
      />
    </View>
  );
}