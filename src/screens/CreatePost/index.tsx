import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import { useUserPosts } from '../../contexts/UserPostsContext';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function CreatePost() {
  const navigation = useNavigation();
  const { addPost } = useUserPosts();

  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [publishing, setPublishing] = useState(false);

  async function handlePickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher uma foto.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function handleTakePhoto() {
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      Alert.alert('Permissão necessária', 'Precisamos de acesso à câmera para tirar uma foto.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      quality: 0.8,
      allowsEditing: true,
      aspect: [4, 3],
    });

    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
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
    if (!photoUri) return;
    setPublishing(true);
    try {
      // TODO: fazer upload de `photoUri` pro Storage (Firebase, no
      // backend que já criamos) antes de gravar o post de verdade —
      // por enquanto isso só entra na sessão local do device.
      await new Promise((resolve) => setTimeout(resolve, 400));
      addPost({ photoUri, caption: caption.trim() });
      navigation.goBack();
    } finally {
      setPublishing(false);
    }
  }

  const canPublish = !!photoUri && !publishing;

  return (
    <View style={styles.container}>
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

      <TouchableOpacity
        style={styles.photoArea}
        onPress={handleChoosePhotoSource}
        activeOpacity={0.85}
      >
        {photoUri ? (
          <Image source={{ uri: photoUri }} style={styles.photoPreview} />
        ) : (
          <View style={styles.photoPlaceholder}>
            <Ionicons name="camera-outline" size={32} color={colors.textMuted} />
            <Text style={styles.photoPlaceholderText}>Toque para adicionar uma foto</Text>
          </View>
        )}
      </TouchableOpacity>

      {photoUri && (
        <TouchableOpacity onPress={handleChoosePhotoSource} style={styles.changePhotoButton}>
          <Text style={styles.changePhotoText}>Trocar foto</Text>
        </TouchableOpacity>
      )}

      <TextInput
        style={styles.captionInput}
        placeholder="Escreva uma legenda..."
        placeholderTextColor={colors.textMuted}
        value={caption}
        onChangeText={setCaption}
        multiline
      />
    </View>
  );
}
