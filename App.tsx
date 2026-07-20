import React from 'react';
import { View } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

import Navigation from './src/navigation';


export default function App() {

  return (

    <SafeAreaProvider>
      <Navigation />
    </SafeAreaProvider>
  );
}