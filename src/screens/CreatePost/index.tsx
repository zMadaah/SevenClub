import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { useUserPosts } from '../../contexts/UserPostsContext';
import { colors } from '../../theme/colors';
import { styles } from './styles';

const MAX_PHOTOS = 6;

export default function CreatePost() {
  const navigation = useNavigation();
  const { addPost } = useUserPosts();

  const [photoUris, setPhotoUris] = useState<string[]>([]);
  const [caption, setCaption] = useState('');
  const [publishing, setPublishing] = useState(false);

  function addUris(newUris: string[]) {
    setPhotoUris((prev) => [...prev, ...newUris].slice(0, MAX_PHOTOS));
  }

  function handleRemovePhoto(uri: string) {
    setPhotoUris((prev) => prev.filter((p) => p !== uri));
  }

  async function handlePickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher fotos.');
      return;
    }

    const remainingSlots = MAX_PHOTOS - photoUris.length;
    if (remainingSlots <= 0) {
      Alert.alert('Limite atingido', `Você pode adicionar até ${MAX_PHOTOS} fotos por post.`);
      return;
    }

    // allowsEditing (recorte) não funciona junto de allowsMultipleSelection
    // na API do expo-image-picker — por isso a galeria sai sem recorte
    // quando permite mais de uma foto.
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsMultipleSelection: true,
      selectionLimit: remainingSlots,
    });

    if (!result.canceled && result.assets.length > 0) {
      addUris(result.assets.map((asset) => asset.uri));
    }
  }

  async function handleTakePhoto() {
    if (photoUris.length >= MAX_PHOTOS) {
      Alert.alert('Limite atingido', `Você pode adicionar até ${MAX_PHOTOS} fotos por post.`);
      return;
    }

    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar uma foto.');
      return;
    }

    // A câmera tira uma foto por vez — aqui dá pra manter o recorte,
    // já que não entra em conflito com seleção múltipla.
    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets.length > 0) {
      addUris([result.assets[0].uri]);
    }
  }

  function handleChoosePhotoSource() {
    Alert.alert('Adicionar foto', undefined, [
      { text: 'Câmera', onPress: handleTakePhoto },
      { text: 'Galeria', onPress: handlePickFromGallery },
      { text: 'Cancelar', style: 'cancel' },
    ]);
  }

  async function handlePublish() {
    if (photoUris.length === 0) return;
    setPublishing(true);
    try {
      // TODO: fazer upload de cada uri em `photoUris` pro Storage
      // (Firebase, no backend que já criamos) antes de gravar o post
      // de verdade — por enquanto isso só entra na sessão local do device.
      await new Promise((resolve) => setTimeout(resolve, 400));
      addPost({ photoUris, caption: caption.trim() });
      navigation.goBack();
    } finally {
      setPublishing(false);
    }
  }

  const canPublish = photoUris.length > 0 && !publishing;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="close" size={24} color={colors.textPrimary} />
        </TouchableOpacity>

        <Text style={styles.headerTitle}>NOVO POST</Text>

        <TouchableOpacity onPress={handlePublish} disabled={!canPublish}>
          <Text style={[styles.publishText, !canPublish && styles.publishTextDisabled]}>
            {publishing ? 'PUBLICANDO...' : 'PUBLICAR'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <TouchableOpacity
          style={styles.photoArea}
          onPress={handleChoosePhotoSource}
          activeOpacity={0.85}
        >
          {photoUris.length > 0 ? (
            <Image source={{ uri: photoUris[0] }} style={styles.photoPreview} />
          ) : (
            <View style={styles.photoPlaceholder}>
              <Ionicons name="camera-outline" size={32} color={colors.textMuted} />
              <Text style={styles.photoPlaceholderText}>Toque para adicionar fotos</Text>
            </View>
          )}
        </TouchableOpacity>

        {photoUris.length > 0 && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.thumbnailRow}
            contentContainerStyle={styles.thumbnailRowContent}
          >
            {photoUris.map((uri) => (
              <View key={uri} style={styles.thumbnailWrapper}>
                <Image source={{ uri }} style={styles.thumbnail} />
                <TouchableOpacity
                  style={styles.thumbnailRemove}
                  onPress={() => handleRemovePhoto(uri)}
                  hitSlop={{ top: 6, bottom: 6, left: 6, right: 6 }}
                >
                  <Ionicons name="close" size={12} color="#fff" />
                </TouchableOpacity>
              </View>
            ))}

            {photoUris.length < MAX_PHOTOS && (
              <TouchableOpacity style={styles.thumbnailAdd} onPress={handleChoosePhotoSource}>
                <Ionicons name="add" size={22} color={colors.textMuted} />
              </TouchableOpacity>
            )}
          </ScrollView>
        )}

        <TextInput
          style={styles.captionInput}
          placeholder="Escreva uma legenda..."
          placeholderTextColor={colors.textMuted}
          value={caption}
          onChangeText={setCaption}
          multiline
        />
      </ScrollView>
    </KeyboardAvoidingView>
  );
}
