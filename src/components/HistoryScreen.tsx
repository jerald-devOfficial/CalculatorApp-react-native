import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { deleteTransactions } from '../api';

interface HistoryScreenProps {
  userId: string;
  history: {
    calculation: string;
  }[];
  onViewHistory: () => void;
  onDeletedHistory: () => void;
}

const HistoryScreen: React.FC<HistoryScreenProps> = ({
  userId,
  history,
  onViewHistory,
  onDeletedHistory,
}) => {
  const handleDelete = async () => {
    Alert.alert(
      'Delete History',
      'Are you sure you want to delete all history?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          onPress: async () => {
            await deleteTransactions(userId);
            onDeletedHistory();
          },
          style: 'destructive',
        },
      ],
      { cancelable: false }
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.historyTitle}>History</Text>
        {history && history.length > 0 && (
          <TouchableOpacity onPress={handleDelete} style={styles.deleteIcon}>
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={24}
              color="#F5F5F5"
            />
          </TouchableOpacity>
        )}
      </View>

      <View style={[styles.historyContainer]}>
        <ScrollView>
          <View style={styles.historyMain}>
            <View style={styles.historyUl}>
              {history && history.length > 0 ? (
                history.map((item, index) => (
                  <View
                    key={index}
                    style={[
                      styles.historyList,
                      history.length === 1
                        ? styles.historyListOnlyOne
                        : history.length > 1 && index === 0
                        ? styles.historyListMoreThanOneTop
                        : history.length > 1 &&
                          index === history.length - 1 &&
                          styles.historyListMoreThanOneBottom,
                    ]}
                  >
                    <Text style={styles.historyItem}>{item.calculation}</Text>
                  </View>
                ))
              ) : (
                <View style={styles.emptyHistoryContainer}>
                  <Text style={styles.emptyStateText}>
                    Empty!{'\n'}Do some calculations.
                  </Text>
                </View>
              )}
            </View>
          </View>
        </ScrollView>
      </View>

      <TouchableOpacity onPress={onViewHistory} style={styles.backButton}>
        <Text style={styles.backButtonText}>Back</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#292A2D',
    paddingVertical: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 23,
    color: '#ffffff',
    fontWeight: '600',
  },
  deleteIcon: {
    paddingRight: 30,
    position: 'absolute',
    right: 0,
  },
  emptyHistoryContainer: {
    backgroundColor: '#3B3D43',
    borderRadius: 15,
    padding: 54,
  },
  historyContainer: {
    flex: 1,
  },
  historyList: {
    padding: 24,
    backgroundColor: '#4D5057',
  },
  historyItem: {
    fontSize: 20,
    color: '#FFFFFF',
    fontWeight: '600',
  },
  emptyStateText: {
    fontSize: 20,
    color: 'white',
    textAlign: 'center',
    fontWeight: '600',
  },
  backButton: {
    alignSelf: 'center',
    backgroundColor: '#f2f2f2',
    borderRadius: 5,
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop: 20,
  },
  backButtonText: {
    fontSize: 18,
    color: '#292A2D',
  },
  historyMain: {
    width: '100%',
    position: 'relative',
    marginHorizontal: 'auto',
  },
  historyUl: {
    display: 'flex',
    paddingHorizontal: 20,
    gap: 2,
    color: 'white',
    fontSize: 20,
    fontWeight: '600',
  },
  historyListOnlyOne: {
    borderRadius: 15,
  },
  historyListMoreThanOneTop: {
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
  },
  historyListMoreThanOneBottom: {
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 15,
  },
});

export default HistoryScreen;
