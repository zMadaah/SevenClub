import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import BottomTabs from './BottomTabs';

import Login from '../screens/Login';
import SignUp from '../screens/SignUp';
import VerifyCode from '../screens/VerifyCode';
import CreatePassword from '../screens/CreatePassword';
import ForgotPassword from '../screens/ForgotPassword';
import NewPassword from '../screens/NewPassword';


import Profile from '../screens/Profile';
import Private from '../screens/Private';
import ActivityStart from '../screens/ActivityStart';
import RoutePlan from '../screens/RoutePlan';
import CreateLobby from '../screens/CreateLobby';
import JoinLobby from '../screens/JoinLobby';
import LobbyConfirmed from '../screens/LobbyConfirmed';
import Crew from '../screens/Crew';
import CreateCrew from '../screens/CreateCrew';
import JoinCrew from '../screens/JoinCrew';
import CrewConfirmed from '../screens/CrewConfirmed';
import EditProfile from '../screens/EditProfile';
import AddFriend from '../screens/AddFriend';
import ReferralCode from '../screens/ReferralCode';
import SupportChat from '../screens/SupportChat';
import MyStats from '../screens/MyStats';
import ViewHistory from '../screens/ViewHistory';
import Notifications from '../screens/Notifications';
import ManageNotifications from '../screens/ManageNotification';
import ViewTerritories from '../screens/ViewTerritories';
import ViewActivities from '../screens/ViewActivities';
import Leaderboard from '../screens/Leaderboard';
import Rivals from '../screens/Rivals';
import MapVisibility from '../screens/MapVisibility';
import ProfileVisibility from '../screens/ProfileVisibility';
import BlockedUsers from '../screens/BlockedUsers';



import { RootStackParamList } from './types';
import { ActiveLobbyProvider } from '../contexts/ActiveLobbyContext';
import { SavedRoutesProvider } from '../contexts/SavedRoutesContext';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import { ActiveCrewProvider } from '../contexts/ActiveCrewContext';
import { FeaturedBadgeProvider } from '../contexts/FeaturedBadgeContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

function RootNavigator() {
  const { isAuthenticated } = useAuth();

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {isAuthenticated ? (
        <>
          <Stack.Screen name="Main" component={BottomTabs} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="Private" component={Private} />
          <Stack.Screen name="ActivityStart" component={ActivityStart} />
          <Stack.Screen name="RoutePlan" component={RoutePlan} />
          <Stack.Screen name="CreateLobby" component={CreateLobby} />
          <Stack.Screen name="LobbyConfirmed" component={LobbyConfirmed} />
          <Stack.Screen name="Crew" component={Crew} />
          <Stack.Screen name="CreateCrew" component={CreateCrew} />
          <Stack.Screen name="JoinCrew" component={JoinCrew} />
          <Stack.Screen name="CrewConfirmed" component={CrewConfirmed} />
          <Stack.Screen name="EditProfile" component={EditProfile} />
          <Stack.Screen name="SupportChat" component={SupportChat} />
          <Stack.Screen name="MyStats" component={MyStats} />
          <Stack.Screen name="ViewHistory" component={ViewHistory} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="ManageNotifications" component={ManageNotifications} />
          <Stack.Screen name="AddFriend" component={AddFriend} />
          <Stack.Screen name="ReferralCode" component={ReferralCode} />
          <Stack.Screen name="JoinLobby" component={JoinLobby} />
          <Stack.Screen name="ViewTerritories" component={ViewTerritories} />
          <Stack.Screen name="ViewActivities" component={ViewActivities} />
          <Stack.Screen name="Leaderboard" component={Leaderboard} />
          <Stack.Screen name="Rivals" component={Rivals} />
          <Stack.Screen name="MapVisibility" component={MapVisibility} />
          <Stack.Screen name="ProfileVisibility" component={ProfileVisibility} />
          <Stack.Screen name="BlockedUsers" component={BlockedUsers} />
        </>
      ) : (
        <>
          <Stack.Screen name="Login" component={Login} />
          <Stack.Screen name="SignUp" component={SignUp} />
          <Stack.Screen name="VerifyCode" component={VerifyCode} />
          <Stack.Screen name="CreatePassword" component={CreatePassword} />
          <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
          <Stack.Screen name="NewPassword" component={NewPassword} />
        </>
      )}
    </Stack.Navigator>
  );
}

export default function Navigation() {
  return (
    <AuthProvider>
      <ActiveLobbyProvider>
        <ActiveCrewProvider>
          <FeaturedBadgeProvider>
          <SavedRoutesProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
          </SavedRoutesProvider>
          </FeaturedBadgeProvider>
        </ActiveCrewProvider>
      </ActiveLobbyProvider>
    </AuthProvider>
  );
}