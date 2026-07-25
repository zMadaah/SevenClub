import type { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
    Login: undefined;
    SignUp: undefined;
    VerifyCode: { purpose: 'signup' | 'reset'; contact: string };
    CreatePassword: { contact: string };
    ForgotPassword: undefined;
    NewPassword: { contact: string };
    Main: undefined;
    Profile: undefined;
    Private: undefined;
    ActivityStart: undefined;
    RoutePlan: undefined;
    JoinLobby:undefined;
    CreateLobby:undefined;
    LobbyConfirmed: {
        lobbyId: string;
        lobbyName: string;
        inviteCode: string;
    };
    EditProfile: undefined;
    AddFriend: undefined;
    SupportChat: undefined;
    MyStats: undefined;
    ViewHistory: undefined;
    Notifcations: undefined;
    ManageNotifications: undefined;
    ViewTerritories: undefined;
    ViewActivity: undefined;
};

export type BottomTabsParamList = {
  Home: undefined;
  Social: undefined;
  Progress: undefined;
};