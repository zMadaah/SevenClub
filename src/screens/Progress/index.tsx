import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Image } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './styles';

import RivalCard from '../../components/RivalCard';
import { MOCK_CHALLENGES, MOCK_COMPETITIONS } from '../../services/mock/progress';
import { MOCK_RIVALS, YOUR_COLOR } from '../../services/mock/rivals';

const TABS = ['Progresso', 'Atividades',];

export default function Progress() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [activeTab, setActiveTab] = useState('Progresso');

    const level = 0;
    const exp = 0;
    const expTarget = 10;
    const territoryM2 = 0;
    const territoryBestM2 = 0;
    const rivalsCount = 0;
    const rivalsBeating = 0;

    const expProgress = Math.min(exp / expTarget, 1) * 100;
    const rivals = MOCK_RIVALS.run;

    return (
        <View style={styles.container}>
            {/* Barra de abas + atividade */}
            <View style={styles.topBar}>
                <TouchableOpacity onPress={() => navigation.navigate('Profile')}>

                    <Image source={{ uri: 'https://i.pravatar.cc/200?img=10' }} style={styles.avatar} />
                </TouchableOpacity>

                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={styles.tabsScroll}
                    contentContainerStyle={styles.tabsScrollContent}
                >
                    {TABS.map((tab) => {
                        const active = tab === activeTab;
                        return (
                            <TouchableOpacity
                                key={tab}
                                style={[styles.tabPill, active && styles.tabPillActive]}
                                onPress={() => {
                                    if (tab === 'Atividades') {
                                        navigation.navigate('ViewActivities');
                                        return;
                                    }
                                    // if (tab === 'Território') {
                                    //     navigation.navigate('Leaderboard');
                                    //     return;
                                    // }
                                    setActiveTab(tab);
                                }}
                            >
                                <Text style={[styles.tabText, active && styles.tabTextActive]}>{tab}</Text>
                            </TouchableOpacity>
                        );
                    })}
                </ScrollView>

                <TouchableOpacity style={styles.activityDropdown}>
                    <Ionicons name="walk" size={14} color="#111" />
                    <Text style={styles.activityDropdownText}>Corrida</Text>
                    <Ionicons name="chevron-down" size={12} color="#666" />
                </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Card de nível */}
                <View style={styles.levelCard}>
                    <View style={styles.levelCardTop}>
                        <View>
                            <Text style={styles.levelLabel}>NÍVEL</Text>
                            <Text style={styles.levelValue}>{level}</Text>
                        </View>

                        <View style={styles.levelStatsRight}>
                            <View style={styles.levelStatRow}>
                                <MaterialCommunityIcons name="flag-variant-outline" size={16} color="#BCFF00" />
                                <View style={{ marginLeft: 6 }}>
                                    <Text style={styles.levelStatTitle}>Território</Text>
                                    <Text style={styles.levelStatValue}>
                                        {territoryM2}m²{' '}
                                        <Text style={styles.levelStatSub}>MELHOR: {territoryBestM2}M²</Text>
                                    </Text>
                                </View>
                            </View>

                            <View style={styles.levelStatRow}>
                                <MaterialCommunityIcons name="sword-cross" size={16} color="#BCFF00" />
                                <View style={{ marginLeft: 6 }}>
                                    <Text style={styles.levelStatTitle}>Rivais</Text>
                                    <Text style={styles.levelStatValue}>
                                        {rivalsCount} <Text style={styles.levelStatSub}>VENCENDO: {rivalsBeating}</Text>
                                    </Text>
                                </View>
                            </View>
                        </View>
                    </View>

                    <View style={styles.expBarTrack}>
                        <View style={[styles.expBarFill, { width: `${expProgress}%` }]} />
                        <Text style={styles.expBarText}>
                            EXP {exp} / {expTarget}
                        </Text>
                    </View>
                </View>

                {/* Seção clara */}
                <View style={styles.whiteSection}>
                    <View style={styles.sectionHeader}>
                        <Ionicons name="medal-outline" size={22} color="#111" />
                        <Text style={styles.sectionTitle}>Desafios</Text>
                    </View>
                    <Text style={styles.sectionSubtitle}>Ganhe experiência para subir de nível.</Text>

                    <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.challengesRow}
                    >
                        {MOCK_CHALLENGES.map((challenge) => (
                            <View key={challenge.id} style={styles.challengeCard}>
                                <View style={styles.claimBadge}>
                                    <Text style={styles.claimBadgeText}>GANHE {challenge.xp}XP</Text>
                                </View>

                                <View style={styles.challengeIconCircle}>
                                    <Ionicons
                                        name={
                                            challenge.icon === 'watch'
                                                ? 'watch-outline'
                                                : challenge.icon === 'friend'
                                                    ? 'person-add-outline'
                                                    : 'camera-outline'
                                        }
                                        size={24}
                                        color="#fff"
                                    />
                                </View>

                                <Text style={styles.challengeTitle}>{challenge.title}</Text>

                                <TouchableOpacity style={styles.claimButton}>
                                    <Text style={styles.claimButtonText}>TOQUE PARA RESGATAR</Text>
                                </TouchableOpacity>
                            </View>
                        ))}
                    </ScrollView>

                    <TouchableOpacity
                        style={styles.sectionHeader}
                        onPress={() => navigation.navigate('Rivals')}
                        activeOpacity={0.7}
                    >
                        <MaterialCommunityIcons name="sword-cross" size={16} color="#061414" />
                        <Text style={styles.sectionTitle}>TOP Rivais</Text>
                        <View style={{ flex: 1 }} />
                        {rivals.length > 0 && <Ionicons name="chevron-forward" size={18} color="#999" />}
                    </TouchableOpacity>

                    {rivals.length === 0 ? (
                        <>
                            <Text style={styles.sectionSubtitle}>Suas batalhas obrigatórias
                                Recupere território ou amplie sua vantagem.</Text>
                            <Text style={styles.sectionSubtitleLast}>
                                Ainda não são rivais, mas assim que você roubar o território de alguém ou eles roubarem o seu, isso aparecerá aqui
                            </Text>
                        </>
                    ) : (
                        <View style={{ marginBottom: 8 }}>
                            {rivals.slice(0, 2).map((rival) => (
                                <RivalCard key={rival.id} rival={rival} yourColor={YOUR_COLOR} compact />
                            ))}
                        </View>
                    )}

                    <Text style={styles.sectionSubtitle}>Suas batalhas obrigatórias
                        Recupere território ou amplie sua vantagem.</Text>
                    <Text style={styles.sectionSubtitleLast}>
                        Ainda não são rivais, mas assim que você roubar o território de alguém ou eles roubarem o seu, isso aparecerá aqui
                    </Text>

                    {/* <View style={styles.sectionHeader}>
                        <Ionicons name="trophy-outline" size={22} color="#111" />
                        <Text style={styles.sectionTitle}>Competições</Text>
                    </View>
                    <Text style={styles.sectionSubtitle}>Envie participações para ganhar prêmios.</Text>
                    <Text style={styles.sectionSubtitleLast}>
                        Mais participações = mais chances de ganhar.
                    </Text> */}

                    {/* <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={styles.competitionsRow}
                    >
                        {MOCK_COMPETITIONS.map((item) => (
                            <TouchableOpacity key={item.id} style={styles.competitionAvatar}>
                                <Image source={{ uri: item.imageUrl }} style={styles.competitionAvatarImage} />
                            </TouchableOpacity>
                        ))}
                    </ScrollView> */}
                </View>
            </ScrollView>
        </View>
    );
}