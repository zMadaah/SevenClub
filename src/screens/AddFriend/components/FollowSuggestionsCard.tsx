import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Svg, { Image as SvgImage, Path, ClipPath, Defs } from 'react-native-svg';

import { FollowSuggestion } from '../../../services/mock/followSuggestions';
import { colors } from '../../../theme/colors';
import { styles } from './FollowSuggestionsCard.styles';

interface FollowSuggestionCardProps {
  person: FollowSuggestion;
  following: boolean;
  onToggleFollow: () => void;
}

const SHIELD_PATH = 'M4 4 H68 V42 Q68 64 36 76 Q4 64 4 42 Z';

export default function FollowSuggestionCard({
  person,
  following,
  onToggleFollow,
}: FollowSuggestionCardProps) {
  return (
    <View style={styles.card}>
      <Svg width={72} height={80} viewBox="0 0 72 80" style={styles.avatarSvg}>
        <Defs>
          <ClipPath id={`clip-${person.id}`}>
            <Path d={SHIELD_PATH} />
          </ClipPath>
        </Defs>
        <SvgImage
          href={{ uri: person.avatarUrl }}
          width={72}
          height={80}
          preserveAspectRatio="xMidYMid slice"
          clipPath={`url(#clip-${person.id})`}
        />
        <Path d={SHIELD_PATH} fill="none" stroke={colors.accent} strokeWidth={3} />
      </Svg>

      <Text style={styles.name}>{person.name}</Text>
      <Text style={styles.role}>{person.role}</Text>

      <TouchableOpacity
        style={[styles.followButton, following && styles.followingButton]}
        onPress={onToggleFollow}
      >
        <Text style={[styles.followButtonText, following && styles.followingButtonText]}>
          {following ? 'SEGUINDO' : 'SEGUIR'}
        </Text>
      </TouchableOpacity>
    </View>
  );
}