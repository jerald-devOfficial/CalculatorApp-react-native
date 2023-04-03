import { Platform } from 'react-native';

const API_URL = 'api-url-to-be-provided';

export const saveResult = async (
  calculation: string,
  userId: string
): Promise<void> => {
  try {
    if (userId) {
      const response = await fetch(
        `${API_URL}/app/user/${userId}/transaction`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ calculation }),
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error(
          'Error saving result:',
          response.status,
          response.statusText,
          text
        );
        return;
      }
    }
  } catch (error) {
    console.error('Error saving result:', error);
  }
};

export const fetchCalculationHistory = async (
  userId: string
): Promise<{ calculation: string }[] | null> => {
  try {
    if (userId) {
      const response = await fetch(`${API_URL}/app/user/${userId}/transaction`);
      const data: any = await response.json();

      // console.log('Fetch calculation history response:', data);

      return data;
    }
  } catch (error) {
    console.log('Error object:', error);
    console.error('Error fetching calculation history:', error);
    return null;
  }

  return null;
};

export const createNewUser = async (): Promise<string> => {
  try {
    const response = await fetch(`${API_URL}/app/user`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        os: Platform.OS,
      }),
    });

    if (!response.ok) {
      const text = await response.text();
      console.error(
        'Error creating new user:',
        response.status,
        response.statusText,
        text
      );
      throw new Error('Error creating new user');
    }

    const result = await response.json();
    console.log('User created successfully:', result); // Add this line
    return result.user.uuid;
  } catch (error) {
    console.error('Error creating new user:', error);
    throw error;
  }
};

export const checkUserExists = async (userUUID: string): Promise<boolean> => {
  try {
    const response = await fetch(`${API_URL}/app/user/${userUUID}`, {
      method: 'GET',
    });

    if (response.ok) {
      return true;
    } else {
      return false;
    }
  } catch (error) {
    console.error('Error checking user existence:', error);
    return false;
  }
};

export const deleteTransactions = async (userId: string): Promise<void> => {
  try {
    if (userId) {
      const response = await fetch(
        `${API_URL}/app/user/${userId}/transaction`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) {
        const text = await response.text();
        console.error(
          'Error deleting transactions:',
          response.status,
          response.statusText,
          text
        );
        throw new Error('Error deleting transactions');
      }
    }
  } catch (error) {
    console.error('Error deleting transactions:', error);
    throw error;
  }
};
