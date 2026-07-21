import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';

import Home from '../screens/Home';
import Social from '../screens/Social';
import Profile from '../screens/Profile';
import Progress from '../screens/Progress';

import { colors } from '../theme/colors';

import { BottomTabsParamList, RootStackParamList } from './types';



const Tab = createBottomTabNavigator<BottomTabsParamList>();

export default function BottomTabs() {
    const insets = useSafeAreaInsets();
    const tabBarHeight = 60 + insets.bottom;
    const [activeTab, setActiveTab] = useState('Home');
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

   return (
        <View style={{ flex: 1 }}>
            <Tab.Navigator
                initialRouteName="Home"
                screenListeners={{
                    state: (e: any) => {
                        const state = e.data.state;
                        setActiveTab(state.routes[state.index].name);
                    },
                }}
                screenOptions={({ route }) => ({
                    headerShown: false,
                    tabBarShowLabel: false,
                    tabBarActiveTintColor: '#BCFF00',
                    tabBarInactiveTintColor: colors.surface,
                    tabBarStyle: {
                        backgroundColor: colors.backgroundDark,
                        borderTopWidth: 0,
                        height: 60 + insets.bottom,
                        paddingBottom: insets.bottom > 0 ? insets.bottom : 1,
                        paddingTop: 8,
                    },
                    tabBarIcon: ({ color, size }) => {
                        let icon: keyof typeof Ionicons.glyphMap;
                        switch (route.name) {
                            case 'Home':
                                icon = 'walk';
                                break;
                            case 'Social':
                                icon = 'people-outline';
                                break;
                            case 'Progress':
                                icon = 'bar-chart-outline';
                                break;
                        }
                        return <Ionicons name={icon as any} size={size} color={color} />;
                    },
                })}
            >
                <Tab.Screen name="Progress" component={Progress} />

                <Tab.Screen name="Home" component={Home}
                    options={{
                        title: 'Mapa',
                        tabBarIcon: () => (
                            <View style={styles.centerTabIcon}>
                                <FontAwesome5 name="location-arrow" size={32} color={colors.backgroundDark} />
                            </View>
                        ),
                    }}
                />

                <Tab.Screen name="Social" component={Social} options={{ title: 'Social' }} />
            </Tab.Navigator>

            {activeTab === 'Home' && (
                <View style={[styles.actionBar, { bottom: tabBarHeight + 14 }]}>
                    <TouchableOpacity style={styles.planButton} activeOpacity={0.85} onPress={() => navigation.navigate('RoutePlan')}>
                        <Ionicons name="git-branch-outline" size={18} color={colors.backgroundDark} />
                        <Text style={styles.planText}>Plan</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={styles.startButton}
                        activeOpacity={0.85}
                        onPress={() => navigation.navigate('ActivityStart')}
                    >
                        <Ionicons name="play" size={18} color={colors.backgroundDark}  />
                        <Text style={styles.startText}>Start</Text>
                    </TouchableOpacity>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    centerTabIcon: {
        position: 'absolute',
        bottom: 0,
        height: 64,
        width: 64,
        borderRadius: 32,
        backgroundColor: '#BCFF00',
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.25,
        shadowRadius: 8,
        elevation: 10,
    },
    actionBar: {
        position: 'absolute',
        left: 16,
        right: 16,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    planButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: colors.background,
        paddingHorizontal: 18,
        paddingVertical: 12,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.15,
        shadowRadius: 6,
        elevation: 6,
    },
    planText: {
        color: colors.textPrimary,
        fontWeight: '600',
        fontSize: 14,
    },
    startButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6,
        backgroundColor: '#BCFF00',
        paddingHorizontal: 22,
        paddingVertical: 12,
        borderRadius: 24,
        shadowColor: '#000',
        shadowOpacity: 0.2,
        shadowRadius: 6,
        elevation: 6,
    },
    startText: {
        color: colors.textPrimary,
        fontWeight: '700',
        fontSize: 14,
    },
});