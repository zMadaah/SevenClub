import React from 'react';

export type GameMode =
  | 'solo'
  | 'private'
  | 'crew';

export type ActivityMode =
  | 'running'
  | 'cycling';

export interface HomeHeaderProps {
  avatar?: string;
  username?: string;
  selectedCategory: GameMode;
  activityMode: ActivityMode;
  onCategoryChange(category: GameMode): void;
  onActivityChange(activity: ActivityMode): void;
  onNotificationPress(): void;
}