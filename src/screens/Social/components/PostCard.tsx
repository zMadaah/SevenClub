import React, { useState } from 'react';
import {  View,  Text,  Image,  TouchableOpacity,  ScrollView,  NativeSyntheticEvent,  NativeScrollEvent,  Dimensions,} from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';

import { FeedPost } from '../../../types/post';
import { useComments } from '../../../contexts/CommentsContext';
import CommentsModal from './CommentsModal';
import { styles } from './PostCard.styles';

interface PostCardProps {
  post: FeedPost;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const CARD_HORIZONTAL_PADDING = 16 * 2; // paddingHorizontal da lista, dos dois lados
const PHOTO_WIDTH = SCREEN_WIDTH - CARD_HORIZONTAL_PADDING;

export default function PostCard({ post }: PostCardProps) {
  const [activePhoto, setActivePhoto] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [commentsVisible, setCommentsVisible] = useState(false);

  const { getComments } = useComments();
  const commentCount = getComments(post.id).length;

  function handleToggleLike() {
    // TODO: trocar por chamada real em services/api.ts assim que existir
    setLiked((prev) => !prev);
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1));
  }

  function handleScroll(e: NativeSyntheticEvent<NativeScrollEvent>) {
    const index = Math.round(e.nativeEvent.contentOffset.x / PHOTO_WIDTH);
    setActivePhoto(index);
  }

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.avatarWrapper}>
          <Image source={{ uri: post.runner.avatarUrl }} style={styles.avatar} />
          <View style={styles.levelBadge}>
            <Text style={styles.levelText}>{post.runner.level}</Text>
          </View>
        </View>

        <View style={styles.headerInfo}>
          <Text style={styles.runnerName}>{post.runner.name}</Text>
          <Text style={styles.runnerMeta}>
            {post.createdAt} · {post.runner.location} {post.runner.countryFlag}
          </Text>
        </View>

        <TouchableOpacity hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Ionicons name="ellipsis-horizontal" size={18} color="#888" />
        </TouchableOpacity>
      </View>

      {post.title ? <Text style={styles.title}>{post.title}</Text> : null}
      {post.caption ? <Text style={styles.caption}>{post.caption}</Text> : null}

      {post.photos.length > 0 && (
        <View style={styles.photoWrapper}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={handleScroll}
            scrollEventThrottle={16}
          >
            {post.photos.map((uri, i) => (
              <Image key={i} source={{ uri }} style={{ width: PHOTO_WIDTH, height: 220 }} />
            ))}
          </ScrollView>

          {post.photos.length > 1 && (
            <View style={styles.dotsRow}>
              {post.photos.map((_, i) => (
                <View key={i} style={[styles.dot, i === activePhoto && styles.dotActive]} />
              ))}
            </View>
          )}
        </View>
      )}

      {post.distanceKm != null && (
        <View style={styles.statsRow}>
          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>distância</Text>
            <Text style={styles.statValue}>
              {post.distanceKm.toFixed(2)} <Text style={styles.statUnit}>km</Text>
            </Text>
          </View>

          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>duração</Text>
            <Text style={styles.statValue}>{post.durationLabel}</Text>
          </View>

          <View style={styles.statBlock}>
            <Text style={styles.statLabel}>ritmo médio</Text>
            <Text style={styles.statValue}>
              {post.avgPaceLabel} <Text style={styles.statUnit}>/km</Text>
            </Text>
          </View>
        </View>
      )}

      {post.territoryKm2 != null && (
        <View style={styles.territoryPill}>
          <MaterialCommunityIcons name="flag-variant" size={14} color="#BCFF00" />
          <Text style={styles.territoryLabel}>território</Text>
          <Text style={styles.territoryValue}>{post.territoryKm2.toFixed(1)} km²</Text>
        </View>
      )}

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerAction} onPress={handleToggleLike}>
          <Ionicons
            name={liked ? 'heart' : 'heart-outline'}
            size={20}
            color={liked ? '#D85A30' : '#111'}
          />
          <Text style={styles.footerCount}>{likeCount}</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.footerAction} onPress={() => setCommentsVisible(true)}>
          <Ionicons name="chatbubble-outline" size={18} color="#111" />
          <Text style={styles.footerCount}>{commentCount}</Text>
        </TouchableOpacity>
      </View>

      <CommentsModal
        visible={commentsVisible}
        onClose={() => setCommentsVisible(false)}
        postId={post.id}
      />
    </View>
  );
}