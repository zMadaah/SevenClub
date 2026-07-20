import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import Svg, { Path } from 'react-native-svg';

import { colors } from '../../theme/colors';
import { styles } from './styles';
import { NativeGesture } from 'react-native-gesture-handler/lib/typescript/handlers/gestures/nativeGesture';

export default function EnterInviteCode() {
    const navigation = useNavigation();
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const canSubmit = code.trim().length > 0 && !submitting;

    async function handleAddCode() {
        if (!canSubmit) return;
        setSubmitting(true);
        try {
            // TODO: trocar por chamada real em services/api.ts assim que existir
            await new Promise((resolve) => setTimeout(resolve, 500));

            Alert.alert('Código adicionado', 'Seu convite foi vinculado com sucesso.');
            navigation.goBack();
        } catch {
            Alert.alert('Código inválido', 'Confira o código e tente novamente.');
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <View style={styles.container}>
            <Svg style={styles.decoration} viewBox="0 0 375 812">
                <Path
                    d="M60 55 C 140 -20, 280 -10, 340 60"
                    stroke={colors.accent}
                    strokeWidth={2}
                    fill="none"
                />
                <Path
                    d="M330 260 L 320 350"
                    stroke={colors.accent}
                    strokeWidth={2}
                    fill="none"
                />
                <Path
                    d="M-20 500 C 40 620, 120 700, 260 630"
                    stroke={colors.accent}
                    strokeWidth={2}
                    fill="none"
                />
                <Path
                    d="M100 600 L 340 700"
                    stroke={colors.accent}
                    strokeWidth={2}
                    fill="none"
                />
                <Path
                    d="M0 780 C 120 850, 220 830, 260 730"
                    stroke={colors.accent}
                    strokeWidth={2}
                    fill="none"
                />
            </Svg>

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={20} color={colors.textPrimary}/>
                <Text style={styles.backText}>Voltar</Text> 
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.title}>Tem um convite</Text>
                <TextInput
                    style={styles.input}
                    placeholder='Codigo de convite'
                    placeholderTextColor={colors.textPrimary}
                    value={code}
                    onChangeText={setCode}
                    autoCapitalize='characters'
                    />
            
            <TouchableOpacity
                style={[styles.addButton, !canSubmit && styles.addButtonDisabled]}
                disabled={!canSubmit}
                onPress={handleAddCode}
                >
                    <Text style={[styles.addButtonText, !canSubmit && styles.addButtonTextDisabled]}>
                        {submitting ? 'Adicionando...' : "Adicionar amigo"}
                    </Text>
                </TouchableOpacity>
            </View>

            
        </View>
    );
}