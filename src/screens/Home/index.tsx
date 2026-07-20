import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';

import Header from '../../Header';
import Map from '../../Map';

import { styles } from './styles';
import { ActivityMode, GameMode } from '../../Header/types';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<GameMode>('solo');
  const [activityMode, setActivityMode] = useState<ActivityMode>('running');
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  return (
    <View style={styles.container}>
      <Map />

      <Header
        avatar="https://i.pravatar.cc/150?img=10"
        username="João"
        selectedCategory={selectedCategory}
        activityMode={activityMode}
        onCategoryChange={setSelectedCategory}
        onActivityChange={setActivityMode}
        onNotificationPress={() => navigation.navigate('Notifications')}
      />
    </View>
  );
}