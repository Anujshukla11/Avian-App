import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function LoginScreen({ navigation }) {
  const [isLogin, setIsLogin] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSignup = async () => {
    if (!username || !password) {
      Alert.alert('Please enter both username and password.');
      return;
    }
    try {
      await AsyncStorage.setItem(
        'userData',
        JSON.stringify({ username, password })
      );
      await AsyncStorage.setItem('username', username); // ✅ Store username

      Alert.alert('Account created successfully!');
      setIsLogin(true); // Switch to login screen after signup
      setUsername('');
      setPassword('');
    } catch (e) {
      console.error('Error saving user data', e);
      Alert.alert('Failed to save user data.');
    }
  };

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Please enter both username and password.');
      return;
    }
    try {
      const storedData = await AsyncStorage.getItem('userData');
      if (!storedData) {
        Alert.alert('No user found. Please signup first.');
        return;
      }
      const parsed = JSON.parse(storedData);
      if (parsed && parsed.username === username && parsed.password === password) {
        await AsyncStorage.setItem('username', username); // ✅ Store username again here
        navigation.navigate('MainApp');
      } else {
        Alert.alert('Invalid username or password.');
      }
    } catch (e) {
      console.error('Error reading user data', e);
      Alert.alert('Failed to read user data.');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <Text style={styles.title}>Avian - Women's Safety App</Text>

      <TextInput
        placeholder="Username"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
        autoCorrect={false}
      />

      <TextInput
        placeholder="Password"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity
        style={styles.button}
        onPress={isLogin ? handleLogin : handleSignup}
      >
        <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Signup'}</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
        <Text style={styles.switchText}>
          {isLogin
            ? "Don't have an account? Signup"
            : "Already have an account? Login"}
        </Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f0f8ff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 30,
    color: '#1e90ff',
    textAlign: 'center',
  },
  input: {
    width: '100%',
    padding: 12,
    borderWidth: 1,
    borderColor: '#1e90ff',
    borderRadius: 8,
    marginBottom: 15,
    backgroundColor: 'white',
  },
  button: {
    backgroundColor: '#1e90ff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
    marginBottom: 10,
    marginTop: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  switchText: {
    color: '#1e90ff',
    marginTop: 10,
    textDecorationLine: 'underline',
  },
});
