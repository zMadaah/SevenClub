import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';

import { RootStackParamList } from '../navigation/types';
import { colors } from '../theme/colors';
import { useActiveLobby } from '../contexts/ActiveLobbyContext';

import ActivitySelector from './ActivitySelector';
import { HomeHeaderProps } from './types';
import { styles } from './styles';

const GAME_MODES = ['solo', 'private', 'crew'] as const;

export default function HomeHeader({
  avatar,
  selectedCategory,
  activityMode,
  onCategoryChange,
  onActivityChange,
  onNotificationPress,
}: HomeHeaderProps) {
  const [showActivity, setShowActivity] = useState(false);
  const { activeLobby } = useActiveLobby();

  const navigation = useNavigation<NavigationProp<RootStackParamList>>();


  return (
    <>
      <SafeAreaView  style={styles.safeArea}>
        <View style={styles.container}>
          <View style={styles.row}>
            {/* Avatar */}
            <TouchableOpacity
              activeOpacity={0.5}
              onPress={() => navigation.navigate('Profile')}
            >
              <Image
                source={{
                  uri:
                    avatar ??
                    'https://i.pravatar.cc/150?img=10',
                }}
                style={styles.avatar}
              />
            </TouchableOpacity>

            {/* Crew | Private | Solo */}
            <View style={styles.categories}>
              {GAME_MODES.map(mode => (
                <TouchableOpacity
                  key={mode}
                  activeOpacity={0.8}
                  onPress={() => {
                    if (mode === 'private') {
                      if (activeLobby) {
                        // já tem lobby ativo — fica no próprio mapa,
                        // só alterna o modo (não navega pra outra tela)
                        onCategoryChange(mode);
                      } else {
                        navigation.navigate('Private');
                      }
                      return;
                    }
                    if (mode === 'crew') {
                      navigation.navigate('Crew');
                      return;
                    }
                    onCategoryChange(mode);
                  }}
                  style={[
                    styles.category,
                    selectedCategory === mode &&
                    styles.categoryActive,
                  ]}
                >
                  <Text
                    numberOfLines={1}
                    style={[
                      styles.categoryText,
                      selectedCategory === mode && styles.categoryTextActive,
                    ]}
                  >
                    {mode.toUpperCase()}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Corrida / Pedal */}
            <TouchableOpacity
              style={styles.activityButton}
              activeOpacity={0.8}
              onPress={() => setShowActivity(true)}
            >
              <Ionicons
                name={
                  activityMode === 'running'
                    ? 'walk-outline'
                    : 'bicycle-outline'
                }
                size={18}
                color="#FFF"
              />

              <Text style={styles.activityText}>
                {activityMode === 'running'
                  ? 'Run'
                  : 'Bike'}
              </Text>

              <Ionicons
                name="chevron-down"
                size={16}
                color="#E9EBE6"
              />
            </TouchableOpacity>

            {/* Notificações */}
            <TouchableOpacity
              style={styles.notificationButton}
              activeOpacity={0.8}
              onPress={onNotificationPress}
            >
              <Ionicons name="notifications-outline" size={24} color="#E9EBE6" />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      <ActivitySelector
        visible={showActivity}
        selected={activityMode}
        onClose={() => setShowActivity(false)}
        onSelect={value => {
          onActivityChange(value);
          setShowActivity(false);
        }}
      />
    </>
  );
}