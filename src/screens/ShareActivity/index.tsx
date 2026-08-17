import React, { useRef, useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import * as ImagePicker from 'expo-image-picker';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';
import { LinearGradient } from 'expo-linear-gradient';
import ViewShot from 'react-native-view-shot';

import { RootStackParamList } from '../../navigation/types';
import { styles } from './styles';

// Todo app de corrida tem essa tela: cartão de métricas sobre uma foto,
// pronto pra postar. Em vez de gerar um PNG transparente separado (que
// exigiria compor no Instagram/editor depois), a gente já compõe foto +
// cartão numa View só e tira o "print" dela — mesmo resultado final, um
// passo a menos pro usuário. É assim que o Strava faz também.
export default function ShareActivity() {
  const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const route = useRoute<RouteProp<RootStackParamList, 'ShareActivity'>>();
  const { distanceMeters, durationLabel, paceLabel, activityType } = route.params;

  const [backgroundUri, setBackgroundUri] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const cardRef = useRef<ViewShot>(null);

  const km = (distanceMeters / 1000).toFixed(2);

  async function handlePickPhoto() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.9,
    });

    if (!result.canceled && result.assets.length > 0) {
      setBackgroundUri(result.assets[0].uri);
    }
  }

  async function captureCard(): Promise<string | null> {
    try {
      // @ts-ignore — capture() existe no ref do ViewShot mas o tipo da
      // lib não expõe isso diretamente no forwardRef
      const uri = await cardRef.current?.capture?.();
      return uri ?? null;
    } catch {
      return null;
    }
  }

  async function handleSaveToGallery() {
    if (busy) return;
    setBusy(true);
    try {
      const uri = await captureCard();
      if (!uri) throw new Error('capture failed');

      const permission = await MediaLibrary.requestPermissionsAsync();
      if (!permission.granted) {
        Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para salvar a imagem.');
        return;
      }

      await MediaLibrary.saveToLibraryAsync(uri);
      Alert.alert('Pronto', 'Imagem salva na galeria.');
    } catch {
      Alert.alert('Ops', 'Não foi possível salvar a imagem.');
    } finally {
      setBusy(false);
    }
  }

  async function handleShare() {
    if (busy) return;
    setBusy(true);
    try {
      const uri = await captureCard();
      if (!uri) throw new Error('capture failed');

      const available = await Sharing.isAvailableAsync();
      if (!available) {
        Alert.alert('Ops', 'Compartilhamento não está disponível nesse dispositivo.');
        return;
      }

      await Sharing.shareAsync(uri);
    } catch {
      Alert.alert('Ops', 'Não foi possível compartilhar a imagem.');
    } finally {
      setBusy(false);
    }
  }

  function handleSkip() {
    navigation.navigate('Main', { screen: 'Home' });
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleSkip} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.skipText}>Pular</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Compartilhar</Text>
        <View style={{ width: 40 }} />
      </View>

      <ViewShot ref={cardRef} options={{ format: 'png', quality: 1 }} style={styles.cardWrapper}>
        {backgroundUri ? (
          <Image source={{ uri: backgroundUri }} style={styles.cardBackground} />
        ) : (
          <View style={[styles.cardBackground, styles.cardBackgroundPlaceholder]}>
            <Ionicons name="image-outline" size={32} color="rgba(255,255,255,0.5)" />
          </View>
        )}

        <LinearGradient
          colors={['transparent', 'rgba(6,20,20,0.55)', 'rgba(6,20,20,0.9)']}
          locations={[0, 0.55, 1]}
          style={styles.cardGradient}
        />

        <View style={styles.brandRow}>
          <View style={styles.brandMark}>
            <Text style={styles.brandMarkText}>7</Text>
          </View>
          <Text style={styles.brandWordmark}>SEVEN CLUB</Text>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statColumn}>
            <Text style={styles.statLabel}>DISTÂNCIA</Text>
            <Text style={styles.statValue}>{km} km</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statColumn}>
            <Text style={styles.statLabel}>RITMO</Text>
            <Text style={styles.statValue}>{paceLabel}</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statColumn}>
            <Text style={styles.statLabel}>TEMPO</Text>
            <Text style={styles.statValue}>{durationLabel}</Text>
          </View>
        </View>
      </ViewShot>

      <TouchableOpacity style={styles.pickPhotoButton} onPress={handlePickPhoto}>
        <Ionicons name="image-outline" size={16} color="#111" />
        <Text style={styles.pickPhotoText}>
          {backgroundUri ? 'Trocar foto' : 'Escolher foto de fundo'}
        </Text>
      </TouchableOpacity>

      <View style={styles.actionsRow}>
        <TouchableOpacity
          style={[styles.actionButtonOutline, busy && styles.actionButtonDisabled]}
          onPress={handleSaveToGallery}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#111" />
          ) : (
            <>
              <Ionicons name="download-outline" size={18} color="#111" />
              <Text style={styles.actionButtonOutlineText}>SALVAR</Text>
            </>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionButtonSolid, busy && styles.actionButtonDisabled]}
          onPress={handleShare}
          disabled={busy}
        >
          {busy ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <Ionicons name="share-social-outline" size={18} color="#fff" />
              <Text style={styles.actionButtonSolidText}>COMPARTILHAR</Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}
