// utils/getData.js
import AsyncStorage from '@react-native-async-storage/async-storage';

export const getCurrentUserData = async () => {
  try {
    const currentUsername = await AsyncStorage.getItem('currentUser');
    if (!currentUsername) return null;

    const allUsers = await AsyncStorage.getItem('users');
    const parsedUsers = allUsers ? JSON.parse(allUsers) : {};

    return parsedUsers[currentUsername] || null;
  } catch (error) {
    console.log('Error fetching user data:', error);
    return null;
  }
};
