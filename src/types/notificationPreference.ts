export interface NotificationPreferences {
  heartedActivity: boolean;
  heartedStatus: boolean;
  commentOnActivity: boolean;
  commentOnStatus: boolean;
  repliedToComment: boolean;
  followingYou: boolean;
  followRequest: boolean;
  questionAnswered: boolean;
  privateLobbyInvite: boolean;
  clubInvite: boolean;
  territoryStolenSingle: boolean;
  territoryStolenPrivateLobby: boolean;
  referralCodeUsed: boolean;
  marketingAnnouncements: boolean;
  captureThreshold5OrLess: boolean;
  captureThreshold5To20: boolean;
}

export const DEFAULT_NOTIFICATION_PREFERENCES: NotificationPreferences = {
  heartedActivity: true,
  heartedStatus: true,
  commentOnActivity: true,
  commentOnStatus: true,
  repliedToComment: true,
  followingYou: true,
  followRequest: true,
  questionAnswered: true,
  privateLobbyInvite: true,
  clubInvite: true,
  territoryStolenSingle: true,
  territoryStolenPrivateLobby: true,
  referralCodeUsed: true,
  marketingAnnouncements: true,
  captureThreshold5OrLess: false,
  captureThreshold5To20: false,
};