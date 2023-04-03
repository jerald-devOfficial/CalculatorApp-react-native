import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface DisplayProps {
  calculation: string;
  result: string;
  displayState: 'calculation' | 'result';
}

const Display: React.FC<DisplayProps> = ({
  calculation,
  result,
  displayState,
}) => {
  return (
    <View style={styles.container}>
      {displayState === 'result' && (
        <Text style={styles.calculationText}>{calculation}</Text>
      )}
      <Text
        style={[
          styles.resultText,
          displayState === 'calculation' ? styles.calculation : null,
        ]}
      >
        {displayState === 'calculation' ? calculation : result}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  calculationText: {
    fontSize: 16,
    color: '#5B5E67',
    textAlign: 'right',
  },
  resultText: {
    fontSize: 48,
    color: 'white',
    textAlign: 'right',
  },
  calculation: {
    fontSize: 48,
    color: 'white',
  },
});

export default Display;
