import React, { useRef, useState } from 'react';
import { View, TextInput, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native';
import { styles } from './styles';

interface OtpCodeInputProps {
  length?: number;
  onChangeCode: (code: string) => void;
}

export default function OtpCodeInput({ length = 6, onChangeCode }: OtpCodeInputProps) {
  const inputRefs = useRef<Array<TextInput | null>>([]);
  const [digits, setDigits] = useState<string[]>(Array(length).fill(''));
  const [focusedIndex, setFocusedIndex] = useState(0);

  function handleChangeDigit(text: string, index: number) {
    const value = text.replace(/[^0-9]/g, '').slice(-1);
    const next = [...digits];
    next[index] = value;
    setDigits(next);
    onChangeCode(next.join(''));

    if (value && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handleKeyPress(e: NativeSyntheticEvent<TextInputKeyPressEventData>, index: number) {
    if (e.nativeEvent.key === 'Backspace' && !digits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  return (
    <View style={styles.row}>
      {digits.map((digit, index) => {
        const isActive = index === focusedIndex;
        return (
          <TextInput
            key={index}
            ref={(ref) => { inputRefs.current[index] = ref; }}
            style={[styles.box, isActive && styles.boxActive]}
            value={digit}
            onChangeText={(text) => handleChangeDigit(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            onFocus={() => setFocusedIndex(index)}
            keyboardType="number-pad"
            maxLength={1}
            textAlign="center"
          />
        );
      })}
    </View>
  );
}