import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, ScrollView, Alert, } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import GenderPickerModal from './components/GenderPickerModal';
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

export default function EditProfile() {
    const navigation = useNavigation();

    const [hasCustomPhoto, setHasCustomPhoto] = useState(false);
    const [firstName, setFirstName] = useState('João');
    const [lastName, setLastName] = useState('Cruz');
    const [displayName, setDisplayName] = useState('João Cruz');
    const [dob, setDob] = useState('');
    const [gender, setGender] = useState<string | null>(null);
    const [selectedColor, setSelectedColor] = useState(COLOR_OPTIONS[1]);
    const [colorPickerOpen, setColorPickerOpen] = useState(false);
    const [genderModalVisible, setGenderModalVisible] = useState(false);

    function handleChangePhoto() {
        // TODO: trocar por expo-image-picker quando a dependência for instalada
        Alert.alert('Em breve', 'Seleção de imagem ainda não está conectada.');
    }

    function handleRemovePhoto() {
        setHasCustomPhoto(false);
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

    function handleSave() {
        // TODO: trocar por chamada real em services/api.ts assim que existir
        navigation.goBack();
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
                    <Image
                        source={{ uri: 'https://i.pravatar.cc/200?img=10' }}
                        style={styles.avatar}
                    />

                    <View style={styles.photoActions}>
                        <TouchableOpacity style={styles.photoAction} onPress={handleChangePhoto}>
                            <Ionicons name="image-outline" size={18} color="#111" />
                            <Text style={styles.photoActionText}>Alterar foto</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.photoAction}
                            onPress={handleRemovePhoto}
                            disabled={!hasCustomPhoto}
                        >
                            <Ionicons
                                name="trash-outline"
                                size={18}
                                color={hasCustomPhoto ? '#111' : '#ccc'}
                            />
                            <Text
                                style={[
                                    styles.photoActionText,
                                    !hasCustomPhoto && styles.photoActionTextDisabled,
                                ]}
                            >
                                Remover foto
                            </Text>
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
                    onChangeText={setDisplayName}
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

                {/* <Text style={styles.sectionTitle}>Skin do perfil</Text>
        <View style={styles.skinPlaceholder}>
          <Ionicons name="add" size={20} color="#999" />
        </View> */}
            </ScrollView>

            <View style={styles.footer}>
                <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                    <Text style={styles.saveText}>SALVAR</Text>
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