import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    VerifyCode: { purpose: 'signup' | 'reset'; contact: string; verificationId: string };
    CreatePassword: { verificationId: string };
    ForgotPassword: undefined;
    NewPassword: { verificationId: string };
    Main: NavigatorScreenParams<BottomTabsParamList> | undefined;
    Profile: undefined;
    Private: undefined;
    ActivityStart: { presetRouteId?: string } | undefined;
    ShareActivity: {
      distanceMeters: number;
      durationLabel: string;
      paceLabel: string;
      activityType: 'run' | 'ride';
    };
    RoutePlan: undefined;
    JoinLobby: undefined;
    CreateLobby: { lobbyId?: string } | undefined;
    LobbyConfirmed: {
        lobbyId: string;
        lobbyName: string;
        inviteCode: string;
    };
    EditProfile: undefined;
    AddFriend: undefined;
    ReferralCode: undefined;
    SupportChat: undefined;
    MyStats: undefined;
    ViewHistory: undefined;
    Notifications: undefined;
    ManageNotifications: undefined;
    ViewTerritories: undefined;
    ViewActivities: undefined;
    Crew: undefined;
    CreateCrew: undefined;
    JoinCrew: undefined;
    CrewConfirmed: {
        crewId: string;
        crewName: string;
        inviteCode: string;
    };
    Leaderboard: undefined;
    Rivals: undefined;
    MapVisibility: undefined;
    ProfileVisibility: undefined;
    BlockedUsers: undefined;
    CreatePost: undefined;
    LobbyChat: undefined;
    CrewChat: undefined;
};

export type BottomTabsParamList = {
  Home: undefined;
  Social: undefined;
  Progress: undefined;
  Leaderboard: undefined;
};
