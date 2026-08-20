import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Alert, Share, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Clipboard from 'expo-clipboard';
import Svg, { Path } from 'react-native-svg';

import { useAuth } from '../../contexts/AuthContext';
import { authApi, ApiError } from '../../services/api';
import { colors } from '../../theme/colors';
import { styles } from './styles';

export default function ReferralCode() {
    const navigation = useNavigation();
    const { authFetch } = useAuth();
    const [code, setCode] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const [myCode, setMyCode] = useState<string | null>(null);
    const [referredCount, setReferredCount] = useState(0);
    const [loadingMyCode, setLoadingMyCode] = useState(true);
    const [copied, setCopied] = useState(false);

    const canSubmit = code.trim().length > 0 && !submitting;

    useEffect(() => {
        authApi
            .getMyReferralInfo(authFetch)
            .then((info) => {
                setMyCode(info.referralCode);
                setReferredCount(info.referredCount);
            })
            .catch(() => {
                // não é crítico — a pessoa ainda consegue resgatar um código
                // mesmo se isso falhar, só não vê o próprio código pra compartilhar
            })
            .finally(() => setLoadingMyCode(false));
    }, [authFetch]);

    async function handleCopyMyCode() {
        if (!myCode) return;
        await Clipboard.setStringAsync(myCode);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    }

    async function handleShareMyCode() {
        if (!myCode) return;
        try {
            await Share.share({
                message: `Bora correr comigo no Seven Club! Usa meu código de convite: ${myCode}`,
            });
        } catch {
            // usuário cancelou o share — não é erro
        }
    }

    async function handleAddCode() {
        if (!canSubmit) return;
        setSubmitting(true);
        try {
            await authApi.redeemReferralCode(authFetch, code.trim());
            Alert.alert('Código adicionado', 'Seu convite foi vinculado com sucesso.');
            navigation.goBack();
        } catch (err) {
            const message = err instanceof ApiError ? err.message : 'Confira o código e tente novamente.';
            Alert.alert('Código inválido', message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <View style={styles.container}>
            {/* <Svg style={styles.decoration} viewBox="0 0 375 812">
                <Path d="M60 55 C 140 -20, 280 -10, 340 60" stroke={colors.accent} strokeWidth={2} fill="none" />
                <Path d="M330 260 L 320 350" stroke={colors.accent} strokeWidth={2} fill="none" />
                <Path d="M-20 500 C 40 620, 120 700, 260 630" stroke={colors.accent} strokeWidth={2} fill="none" />
                <Path d="M100 600 L 340 700" stroke={colors.accent} strokeWidth={2} fill="none" />
                <Path d="M0 780 C 120 850, 220 830, 260 730" stroke={colors.accent} strokeWidth={2} fill="none" />
            </Svg> */}

            <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                <Ionicons name="chevron-back" size={20} color={colors.textPrimary} />
                <Text style={styles.backText}>Voltar</Text>
            </TouchableOpacity>

            <View style={styles.content}>
                <Text style={styles.title}>Indique{'\n'}um amigo</Text>

                {loadingMyCode ? (
                    <ActivityIndicator color={colors.textPrimary} style={{ marginBottom: 20 }} />
                ) : myCode ? (
                    <>
                        <TouchableOpacity style={styles.input} onPress={handleCopyMyCode} activeOpacity={0.7}>
                            <Text style={{ fontSize: 20, fontWeight: '800', color: colors.textPrimary, letterSpacing: 2 }}>
                                {myCode}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={[styles.addButton, { marginBottom: 12 }]} onPress={handleShareMyCode}>
                            <Text style={styles.addButtonText}>COMPARTILHAR MEU CÓDIGO</Text>
                        </TouchableOpacity>

                        <Text style={{ textAlign: 'center', color: colors.laurelLeaf, marginBottom: 32 }}>
                            {copied
                                ? 'Copiado!'
                                : `${referredCount} ${referredCount === 1 ? 'amigo indicado' : 'amigos indicados'}`}
                        </Text>
                    </>
                ) : null}

                <Text style={[styles.title, { fontSize: 24, marginBottom: 16 }]}>Tem um convite?</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Código de convite"
                    placeholderTextColor={colors.textPrimary}
                    value={code}
                    onChangeText={setCode}
                    autoCapitalize="characters"
                />

                <TouchableOpacity
                    style={[styles.addButton, !canSubmit && styles.addButtonDisabled]}
                    disabled={!canSubmit}
                    onPress={handleAddCode}
                >
                    <Text style={[styles.addButtonText, !canSubmit && styles.addButtonTextDisabled]}>
                        {submitting ? 'Adicionando...' : 'Usar código'}
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}
