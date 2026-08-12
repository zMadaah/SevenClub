import React, { forwardRef } from 'react';
import { View, Text } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import { styles } from './ShareableActivityCard.styles';

interface ShareableActivityCardProps {
  activityType: 'run' | 'ride';
  activityName: string;
  distanceKm: string;
  durationLabel: string;
  paceLabel: string;
  captureM2: number | null;
}

// Card puramente estilizado (sem MapView nativo dentro) — capturas de
// superfícies de mapa nativas com react-native-view-shot são bem mais
// instáveis (timing de carregamento de tiles etc). Um View comum sempre
// captura de forma previsível.
//
// O CONTAINER (`styles.card`) precisa ficar sem backgroundColor —
// transparente de propósito. É isso que faz o Instagram tratar a
// imagem como um "adesivo" flutuante sobre a foto que o usuário
// escolher no Story, em vez de virar o fundo inteiro (igual o Strava).
// Cada bloco de informação tem seu próprio "chip" com fundo
// semi-transparente, pra continuar legível em cima de qualquer foto.
const ShareableActivityCard = forwardRef<View, ShareableActivityCardProps>(
  ({ activityType, activityName, distanceKm, durationLabel, paceLabel, captureM2 }, ref) => {
    return (
      <View ref={ref} style={styles.card} collapsable={false}>
        <View style={styles.brandChip}>
          <MaterialCommunityIcons name="shield-check" size={14} color="#BCFF00" />
          <Text style={styles.brandText}>SEVEN CLUB</Text>
        </View>

        <View style={styles.mainChip}>
          <View style={styles.typeRow}>
            <MaterialCommunityIcons
              name={activityType === 'ride' ? 'bike' : 'run'}
              size={16}
              color="#BCFF00"
            />
            <Text style={styles.activityName} numberOfLines={1}>
              {activityName}
            </Text>
          </View>

          <View style={styles.mainStat}>
            <Text style={styles.mainStatValue}>{distanceKm}</Text>
            <Text style={styles.mainStatUnit}>km</Text>
          </View>
        </View>

        <View style={styles.statsRow}>
          <View style={styles.statChip}>
            <Text style={styles.statLabel}>DURAÇÃO</Text>
            <Text style={styles.statValue}>{durationLabel}</Text>
          </View>

          <View style={styles.statChip}>
            <Text style={styles.statLabel}>PACE</Text>
            <Text style={styles.statValue}>{paceLabel}/km</Text>
          </View>

          {captureM2 !== null && (
            <View style={styles.statChip}>
              <Text style={styles.statLabel}>TERRITÓRIO</Text>
              <Text style={styles.statValue}>{Math.round(captureM2)} m²</Text>
            </View>
          )}
        </View>
      </View>
    );
  }
);

ShareableActivityCard.displayName = 'ShareableActivityCard';

export default ShareableActivityCard;
