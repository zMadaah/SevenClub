import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../navigation/types';
import { styles } from './styles';

export default function Crew() {
    const navigation = useNavigation<NativeStackNavigationProp<RootStackParamList>>();

    return (
        <View style={styles.container}>

            {/* HEADER */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Ionicons name="arrow-back" size={26} color="#061414" />
                </TouchableOpacity>

                <Text style={styles.headerTitle}>
                    Corra em crew
                </Text>
                <View style={{ width: 26 }} />
            </View>

            {/* TITLE */}
            <View style={styles.content}>
                <Text style={styles.title}>
                    Domine com seu crew
                </Text>
                <Text style={styles.subtitle}>
                    Convide seu bairro para o seu crew
                </Text>

                {/* JOIN */}
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('JoinCrew')}>
                    <View style={styles.left}>
                        <Ionicons name="people-outline" size={24} color="#BCFF00" />
                        <Text style={styles.optionText}> Entrar </Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#96998C" />
                </TouchableOpacity>

                {/* CREATE */}
                <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('CreateCrew')}>
                    <View style={styles.left}>
                        <Ionicons name="add-circle-outline" size={24} color="#BCFF00" />
                        <Text style={styles.optionText}>Criar Crew</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={24} color="#96998C" />
                </TouchableOpacity>

            </View>
        </View>
    );
}