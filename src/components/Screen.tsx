import React, { Fragment, useState } from 'react';
import { StyleSheet, TouchableOpacity, View } from 'react-native';
import { saveResult } from '../api';
import Button from './Button';
import Display from './Display';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

interface ScreenProps {
  user: string;
  initialDisplayValue: string;
  onButtonPress: (value: string) => void;
  onViewHistory: () => void;
}

const Screen: React.FC<ScreenProps> = ({
  user,
  initialDisplayValue,
  onButtonPress,
  onViewHistory,
}) => {
  const [calculation, setCalculation] = useState('');
  const [result, setResult] = useState(initialDisplayValue);
  const [displayState, setDisplayState] = useState<'calculation' | 'result'>(
    'calculation'
  );

  const evaluate = (expression: string) => {
    try {
      const formattedExpression = expression
        .replace(/×/g, '*')
        .replace(/÷/g, '/');
      // eslint-disable-next-line no-eval
      const result = eval(formattedExpression);
      if (result !== undefined) {
        return result.toString();
      }
      console.log('Result from eval: ', result);
    } catch (error) {
      console.error('Invalid expression:', error);
    }
    return '';
  };

  const handleButtonPress = async (value: string) => {
    onButtonPress(value);

    if (value === '=') {
      if (calculation.trim() !== '') {
        await setResult(evaluate(calculation));
        await setDisplayState('result');

        if (user) {
          saveResult(`${calculation} \n= ${evaluate(calculation)}`, user).catch(
            (error) => {
              console.error('Error saving result:', error);
            }
          );
        }
      }
    } else if (value === '+/-') {
      setCalculation((prevCalculation) => {
        const calculationParts = prevCalculation.split(/([+\-×÷/*]\s)/);
        const lastPartIndex = calculationParts.length - 1;
        const lastPart = calculationParts[lastPartIndex];
        const updatedLastPart =
          lastPart[0] === '-' ? lastPart.slice(1) : `-${lastPart}`;
        calculationParts[lastPartIndex] = updatedLastPart;

        return calculationParts.join('');
      });
    } else {
      setDisplayState('calculation');
      setCalculation((prevCalculation) => {
        if (value.match(/[0-9]/)) {
          return prevCalculation + value;
        } else if (value === '.') {
          if (!prevCalculation.includes('.')) {
            return prevCalculation + value;
          }
        } else if (value.match(/[×÷\-+]/)) {
          return prevCalculation + ' ' + value + ' ';
        } else if (value === 'AC') {
          return '';
        } else if (value === '%') {
          const calculationParts = prevCalculation.split(' ');
          const lastPartIndex = calculationParts.length - 1;
          const lastPart = calculationParts[lastPartIndex];
          const updatedLastPart = (parseFloat(lastPart) / 100).toString();
          calculationParts[lastPartIndex] = updatedLastPart;

          return calculationParts.join(' ');
        }
        return prevCalculation;
      });
    }
  };

  const getButtonColor = (value: string) => {
    if (value.match(/[0-9.]/) || value === '⟲') {
      return '#3B3D43';
    } else if (value === 'AC' || value === '+/-' || value === '%') {
      return '#5B5E67';
    } else {
      return '#3764B4';
    }
  };

  const buttonRows = [
    ['AC', '+/-', '%', '÷'],
    ['7', '8', '9', '×'],
    ['4', '5', '6', '-'],
    ['1', '2', '3', '+'],
    ['.', '0', '⟲', '='],
  ];

  return (
    <View style={styles.container}>
      <Display
        calculation={calculation}
        result={result}
        displayState={displayState}
      />

      {buttonRows.map((row, rowIndex) => (
        <View key={rowIndex} style={styles.buttonContainer}>
          {row.map((value) => (
            <Fragment key={value}>
              {value === '⟲' ? (
                <TouchableOpacity
                  key={value}
                  style={[
                    styles.button,
                    { backgroundColor: getButtonColor(value) },
                  ]}
                  onPress={onViewHistory}
                >
                  <MaterialCommunityIcons
                    name="history"
                    size={24}
                    color="#F5F5F5"
                  />
                </TouchableOpacity>
              ) : (
                <Button
                  key={value}
                  value={value}
                  onButtonPress={handleButtonPress}
                  color={getButtonColor(value)}
                />
              )}
            </Fragment>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    marginBottom: 40,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 5,
    columnGap: 5,
  },
  button: {
    width: 70,
    height: 70,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default Screen;
