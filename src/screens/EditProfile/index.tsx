import React, { useEffect, useRef, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';

import GenderPickerModal from './components/GenderPickerModal';
import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError, MyProfile } from '../../services/api';
import { styles } from './styles';

const COLOR_OPTIONS = [
    '#1D9E75', // teal
    '#D4537E', // pink
    '#7F77DD', // purple
    '#D85A30', // coral
    '#378ADD', // blue
    '#639922', // green
    '#BA7517', // amber
    '#E24B4A', // red
];

// Formata Date -> 'DD/MM/AAAA' pra exibir, e 'YYYY-MM-DD' pra API
function isoToDisplay(iso: string | null): string {
    if (!iso) return '';
    const [y, m, d] = iso.split('-');
    return `${d}/${m}/${y}`;
}

function displayToIso(display: string): string | undefined {
    const digits = display.replace(/\D/g, '');
    if (digits.length !== 8) return undefined;
    const day = digits.slice(0, 2);
    const month = digits.slice(2, 4);
    const year = digits.slice(4);
    return `${year}-${month}-${day}`;
}

export default function EditProfile() {
    const navigation = useNavigation();
    const { authFetch } = useAuth();

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [uploadingPhoto, setUploadingPhoto] = useState(false);

    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[1]);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [genderModalVisible, setGenderModalVisible] = useState(false);

    // "Nome de exibição" é o que aparece no resto do app (cabeçalho do
    // Profile, posts, leaderboard) — não Nome/Sobrenome. Pra evitar a
    // pessoa editar Nome/Sobrenome e achar que "não salvou" porque o
    // cabeçalho não mudou, mantemos os dois sincronizados até a pessoa
    // editar "Nome de exibição" na mão — a partir daí, para de seguir
    // automático (ela assumiu o controle).
    const displayNameManuallyEdited = useRef(false);

    useEffect(() => {
        authApi
            .me(authFetch)
            .then((profile: MyProfile) => {
                setAvatarUrl(profile.avatarUrl);
                const loadedFirstName = profile.firstName ?? '';
                const loadedLastName = profile.lastName ?? '';
                const loadedDisplayName = profile.displayName ?? '';
                setFirstName(loadedFirstName);
                setLastName(loadedLastName);
                setDisplayName(loadedDisplayName);

                // Se o nome de exibição já veio diferente do que Nome+Sobrenome
                // comporia, é porque já foi customizado antes — não mexe nele
                // automaticamente. Só sincroniza quando ainda está "no padrão".
                const composed = `${loadedFirstName} ${loadedLastName}`.trim();
                displayNameManuallyEdited.current = loadedDisplayName !== '' && loadedDisplayName !== composed;

                setDob(isoToDisplay(profile.dateOfBirth));
                setGender(profile.gender);
                if (profile.profileColor) setSelectedColor(profile.profileColor);
            })
            .catch((err) => {
                const message = err instanceof ApiError ? err.message : 'Não foi possível carregar seu perfil.';
                Alert.alert('Ops', message);
            })
            .finally(() => setLoading(false));
    }, [authFetch]);

    // Mantém "Nome de exibição" seguindo Nome+Sobrenome automaticamente —
    // até a pessoa editar esse campo na mão (aí displayNameManuallyEdited
    // vira true e este efeito para de mexer nele).
    useEffect(() => {
        if (!displayNameManuallyEdited.current) {
            setDisplayName(`${firstName} ${lastName}`.trim());
        }
    }, [firstName, lastName]);

    async function handleChangePhoto() {
        const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (!permission.granted) {
            Alert.alert('Permissão necessária', 'Precisamos de acesso à galeria para escolher uma foto.');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ['images'],
            quality: 0.8,
            allowsEditing: true,
            aspect: [1, 1],
        });

        if (result.canceled || result.assets.length === 0) return;

        const localUri = result.assets[0].uri;
        setAvatarUrl(localUri);
        setUploadingPhoto(true);
        try {
            const url = await authApi.uploadPhoto(authFetch, localUri);
            setAvatarUrl(url);
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Não foi possível enviar a foto.';
            Alert.alert('Ops', message);
        } finally {
            setUploadingPhoto(false);
        }
    }

    function handleChangeDob(text: string) {
        const digits = text.replace(/\D/g, '').slice(0, 8);
        let formatted = digits;
        if (digits.length > 4) {
            formatted = `${digits.slice(0, 2)}/${digits.slice(2, 4)}/${digits.slice(4)}`;
        } else if (digits.length > 2) {
            formatted = `${digits.slice(0, 2)}/${digits.slice(2)}`;
        }
        setDob(formatted);
    }

    async function handleSave() {
        if (saving || uploadingPhoto) return;
        setSaving(true);
        try {
            await authApi.updateMyProfile(authFetch, {
                firstName: firstName.trim() || undefined,
                lastName: lastName.trim() || undefined,
                displayName: displayName.trim() || undefined,
                dateOfBirth: displayToIso(dob),
                gender: gender ?? undefined,
                profileColor: selectedColor,
                avatarUrl: avatarUrl ?? undefined,
            });
            navigation.goBack();
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Não foi possível salvar seu perfil.';
            Alert.alert('Ops', message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <View style={[styles.container, { alignItems: 'center', justifyContent: 'center' }]}>
                <ActivityIndicator color="#111" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="chevron-back" size={20} color="#111" />
                    <Text style={styles.backText}>Editar perfil</Text>
                </TouchableOpacity>
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.photoRow}>
                    <View>
                        <Image
                            source={{ uri: avatarUrl || 'https://i.pravatar.cc/200?img=10' }}
                            style={styles.avatar}
                        />
                        {uploadingPhoto && (
                            <View
                                style={[
                                    styles.avatar,
                                    {
                                        position: 'absolute',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        backgroundColor: 'rgba(0,0,0,0.4)',
                                    },
                                ]}
                            >
                                <ActivityIndicator color="#fff" />
                            </View>
                        )}
                    </View>

                    <View style={styles.photoActions}>
                        <TouchableOpacity style={styles.photoAction} onPress={handleChangePhoto} disabled={uploadingPhoto}>
                            <Ionicons name="image-outline" size={18} color="#111" />
                            <Text style={styles.photoActionText}>Alterar foto</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Meus dados</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Nome"
                    placeholderTextColor="#999"
                    value={firstName}
                    onChangeText={setFirstName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Sobrenome"
                    placeholderTextColor="#999"
                    value={lastName}
                    onChangeText={setLastName}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Nome de exibição"
                    placeholderTextColor="#999"
                    value={displayName}
                    onChangeText={(text) => {
                        displayNameManuallyEdited.current = true;
                        setDisplayName(text);
                    }}
                />
                

                <TextInput
                    style={styles.input}
                    placeholder="Data de nascimento"
                    placeholderTextColor="#999"
                    value={dob}
                    onChangeText={handleChangeDob}
                    keyboardType="number-pad"
                    maxLength={10}
                />

                <TouchableOpacity style={styles.selectInput} onPress={() => setGenderModalVisible(true)}>
                    <Text style={gender ? styles.selectValue : styles.selectPlaceholder}>
                        {gender ?? 'Gênero'}
                    </Text>
                    <Ionicons name="chevron-down" size={18} color="#999" />
                </TouchableOpacity>

                <View style={styles.divider} />

                <Text style={styles.sectionTitle}>Minha cor</Text>

                <View style={styles.colorPreview}>
                    <View style={styles.colorPreviewGridLine1} />
                    <View style={styles.colorPreviewGridLine2} />
                    <View style={styles.colorPreviewGridLine3} />

                    <View
                        style={[
                            styles.colorPreviewGlow,
                            { backgroundColor: selectedColor, opacity: 0.25 },
                        ]}
                    />
                    <View style={[styles.colorPreviewDot, { backgroundColor: selectedColor }]} />
                </View>

                <TouchableOpacity onPress={() => setColorPickerOpen((prev) => !prev)}>
                    <Text style={styles.changeColorText}>Alterar cor</Text>
                </TouchableOpacity>

                {colorPickerOpen && (
                    <View style={styles.swatchRow}>
                        {COLOR_OPTIONS.map((color) => (
                            <TouchableOpacity
                                key={color}
                                style={[
                                    styles.swatch,
                                    { backgroundColor: color },
                                    selectedColor === color && styles.swatchSelected,
                                ]}
                                onPress={() => setSelectedColor(color)}
                            />
                        ))}
                    </View>
                )}

                <View style={styles.divider} />
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity
                    style={[styles.saveButton, (saving || uploadingPhoto) && { opacity: 0.6 }]}
                    onPress={handleSave}
                    disabled={saving || uploadingPhoto}
                >
                    <Text style={styles.saveText}>{saving ? 'SALVANDO...' : 'SALVAR'}</Text>
                </TouchableOpacity>
            </View>
            <GenderPickerModal
                visible={genderModalVisible}
                onClose={() => setGenderModalVisible(false)}
                selected={gender}
                onSelect={setGender}
            />
        </View>
    );
}
