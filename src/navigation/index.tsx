import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import BottomTabs from './BottomTabs';


import Profile from '../screens/Profile';
import Private from '../screens/Private';
import ActivityStart from '../screens/ActivityStart';
import RoutePlan from '../screens/RoutePlan';
import CreateLobby from '../screens/CreateLobby';
import JoinLobby from '../screens/JoinLobby';
import LobbyConfirmed from '../screens/LobbyConfirmed';
import EditProfile from '../screens/EditProfile';
import AddFriend from '../screens/AddFriend';
import SupportChat from '../screens/SupportChat';
import MyStats from '../screens/MyStats';   
import ViewHistory from '../screens/ViewHistory';
import Notifications from '../screens/Notifications';
import ManageNotifications from '../screens/ManageNotification' ; 



import { RootStackParamList } from './types';
import { ActiveLobbyProvider } from '../contexts/ActiveLobbyContext';
import { SavedRoutesProvider } from '../contexts/SavedRoutesContext';

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function Navigation() {

    return (
        <ActiveLobbyProvider>
            <SavedRoutesProvider>
                <NavigationContainer>

                    <Stack.Navigator screenOptions={{ headerShown: false }}>
                        <Stack.Screen name="Main" component={BottomTabs} />
                        <Stack.Screen name="Profile" component={Profile} />
                        <Stack.Screen name="Private" component={Private} />
                        <Stack.Screen name="ActivityStart" component={ActivityStart} />
                        <Stack.Screen name="RoutePlan" component={RoutePlan} />
                        <Stack.Screen name="CreateLobby" component={CreateLobby} />
                        <Stack.Screen name="JoinLobby" component={JoinLobby} />
                        <Stack.Screen name="LobbyConfirmed" component={LobbyConfirmed} />
                        <Stack.Screen name="EditProfile" component={EditProfile} />
                        <Stack.Screen name="SupportChat" component={SupportChat} />
                        <Stack.Screen name="MyStats" component={MyStats} />
                        <Stack.Screen name="ViewHistory" component={ViewHistory} />
                        <Stack.Screen name="Notifications" component={Notifications} />
                        <Stack.Screen name="ManageNotifications" component={ManageNotifications} />
                        <Stack.Screen name="AddFriend" component={AddFriend} />

                    </Stack.Navigator>
                </NavigationContainer>
            </SavedRoutesProvider>
        </ActiveLobbyProvider>
    );
}