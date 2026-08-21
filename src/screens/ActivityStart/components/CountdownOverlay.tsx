import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Animated, Easing } from 'react-native';
import { styles } from './CountdownOverlay.styles';

interface CountdownOverlayProps {
  seconds: number;
  onFinish: () => void;
}

// Contagem regressiva antes de começar a rastrear de verdade — dá um
// tempo pra pessoa se preparar (guardar o celular no braço, ajustar o
// fone) sem que os primeiros segundos "percam" tempo de atividade.
export default function CountdownOverlay({ seconds, onFinish }: CountdownOverlayProps) {
  const [count, setCount] = useState(seconds);
  const scale = useRef(new Animated.Value(1)).current;
  const onFinishRef = useRef(onFinish);
  onFinishRef.current = onFinish;

  useEffect(() => {
    if (count <= 0) {
      onFinishRef.current();
      return;
    }

    scale.setValue(1.3);
    Animated.timing(scale, {
      toValue: 1,
      duration: 350,
      easing: Easing.out(Easing.back(1.5)),
      useNativeDriver: true,
    }).start();

    const timeout = setTimeout(() => setCount((c) => c - 1), 1000);
    return () => clearTimeout(timeout);
  }, [count]);

  return (
    <View style={styles.overlay} pointerEvents="auto">
      <Text style={styles.label}>PREPARE-SE</Text>
      <Animated.Text style={[styles.count, { transform: [{ scale }] }]}>{count}</Animated.Text>
    </View>
  );
}
