import React from 'react';
import { StyleSheet, TouchableOpacity, Text } from 'react-native';

interface ButtonProps {
  value: string;
  color?: string;
  onButtonPress: (value: string) => void; // Added this line
}

const Button: React.FC<ButtonProps> = ({ value, color, onButtonPress }) => {
  return (
    <TouchableOpacity
      style={[
        styles.button,
        { backgroundColor: color ? color : 'transparent' },
      ]}
      onPress={() => onButtonPress(value)} // Updated this line
    >
      <Text style={styles.buttonText}>{value}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: 70,
    height: 70,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 24,
    color: 'white',
  },
});

export default Button;
