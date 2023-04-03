import React, { useState, useEffect } from 'react';
import { SafeAreaView, StyleSheet } from 'react-native';
import Screen from './components/Screen';
import HistoryScreen from './components/HistoryScreen';
import {
  fetchCalculationHistory,
  createNewUser,
  checkUserExists,
  deleteTransactions,
} from './api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface CalculatorState {
  firstOperand: string;
  secondOperand: string;
  operator: string | null;
  isSecondOperand: boolean;
}

const initialState: CalculatorState = {
  firstOperand: '',
  secondOperand: '',
  operator: null,
  isSecondOperand: false,
};

const App = () => {
  const [state, setState] = useState<CalculatorState>(initialState);
  const [userId, setUserId] = useState<string | null>(null);
  useState<boolean>(false);

  const calculate = async (
    buttonValue: string,
    state: CalculatorState
  ): Promise<CalculatorState> => {
    if (buttonValue.match(/[0-9]/)) {
      // Handle number input
      if (state.isSecondOperand) {
        return {
          ...state,
          secondOperand: state.secondOperand + buttonValue,
        };
      } else {
        // Check if the first operand is an empty string and the button value is '0'
        if (state.firstOperand === '' && buttonValue === '0') {
          // Do not append '0' to the empty string
          return state;
        } else {
          return {
            ...state,
            firstOperand: state.firstOperand + buttonValue,
          };
        }
      }
    } else if (buttonValue === '.') {
      // Handle decimal input
      const currentOperand = state.isSecondOperand
        ? state.secondOperand
        : state.firstOperand;

      // Check if the current operand already has a decimal point
      if (!currentOperand.includes('.')) {
        return state.isSecondOperand
          ? { ...state, secondOperand: currentOperand + '.' }
          : { ...state, firstOperand: currentOperand + '.' };
      }
    } else if (buttonValue.match(/[\/*\-+]/)) {
      // Handle operator input
      return {
        ...state,
        operator: buttonValue,
        isSecondOperand: true,
      };
    } else if (buttonValue === '=') {
      if (state.firstOperand && state.operator && state.secondOperand) {
        const firstOperand = parseFloat(state.firstOperand);
        const secondOperand = parseFloat(state.secondOperand);
        let result;

        switch (state.operator) {
          case '+':
            result = firstOperand + secondOperand;
            break;
          case '-':
            result = firstOperand - secondOperand;
            break;
          case '×':
            result = firstOperand * secondOperand;
            break;
          case '÷':
            result = firstOperand / secondOperand;
            break;
          default:
            return state;
        }
        return initialState;
      }
    } else if (buttonValue === '+/-') {
      // Handle unary operation (change the sign)
      if (state.isSecondOperand) {
        if (state.secondOperand === '') {
          return state;
        } else {
          return {
            ...state,
            secondOperand: (-parseFloat(state.secondOperand)).toString(),
          };
        }
      } else {
        if (state.firstOperand === '') {
          return state;
        } else {
          return {
            ...state,
            firstOperand: (-parseFloat(state.firstOperand)).toString(),
          };
        }
      }
    } else if (buttonValue === '%') {
      // Handle percentage operation
      if (state.isSecondOperand) {
        return {
          ...state,
          secondOperand: (parseFloat(state.secondOperand) / 100).toString(),
        };
      } else {
        return {
          ...state,
          firstOperand: (parseFloat(state.firstOperand) / 100).toString(),
        };
      }
    } else if (buttonValue === 'AC') {
      return initialState;
    }

    return state;
  };

  const handleButtonPress = async (buttonValue: string) => {
    if (buttonValue === 'AC') {
      // Reset the state to the initial state when the 'AC' button is pressed
      setState(initialState);
    } else {
      // Calculate and update the state for other button values
      const newState = await calculate(buttonValue, state);
      setState(newState);
    }
  };

  const displayValue = `${state.firstOperand}${
    state.operator ? ` ${state.operator}` : ''
  }${state.isSecondOperand ? ` ${state.secondOperand}` : ''}`;

  const [showHistory, setShowHistory] = useState(false);
  const [calculationHistory, setCalculationHistory] = useState<
    { calculation: string }[]
  >([]);

  useEffect(() => {
    const initUser = async () => {
      try {
        let isFirstTimeUser = await AsyncStorage.getItem('isFirstTimeUser');
        let userUUID = await AsyncStorage.getItem('userUUID');

        if (
          isFirstTimeUser === null ||
          !userUUID ||
          !(await checkUserExists(userUUID))
        ) {
          userUUID = await createNewUser();
          await AsyncStorage.setItem('userUUID', userUUID);
          await AsyncStorage.setItem('isFirstTimeUser', 'false');
        }

        console.log('User UUID:', userUUID);
        setUserId(userUUID);
      } catch (error) {
        console.error('Error initializing user:', error);
      }
    };

    initUser();
  }, []);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        if (userId) {
          const history: any = await fetchCalculationHistory(userId);
          if (history) {
            setCalculationHistory(history.transactions);
          } else {
            setCalculationHistory([]);
          }
        }
      } catch (error: any) {
        if (error.message !== 'null') {
          console.error('Error fetching calculation history:', error);
        }
      }
    };

    if (showHistory) {
      fetchHistory();
    }
  }, [showHistory, userId]);

  const toggleHistory = () => {
    setShowHistory(!showHistory);
  };

  const deleteHistory = async () => {
    try {
      if (userId) {
        await deleteTransactions(userId);
        setCalculationHistory([]); // Clear the history state
      }
    } catch (error) {
      console.error('Error deleting history:', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {showHistory ? (
        <HistoryScreen
          history={calculationHistory ? calculationHistory : []}
          onViewHistory={toggleHistory}
          userId={userId!}
          onDeletedHistory={deleteHistory}
        />
      ) : (
        <Screen
          user={userId!}
          initialDisplayValue={displayValue}
          onButtonPress={(value) => handleButtonPress(value)}
          onViewHistory={toggleHistory}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: '#292A2D',
  },
});

export default App;
