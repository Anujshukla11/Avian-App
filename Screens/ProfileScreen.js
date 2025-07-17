import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailSaved, setEmailSaved] = useState(false);
  const [tempEmail, setTempEmail] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
      } else {
        setUsername('Not set');
      }

      const storedEmail = await AsyncStorage.getItem('email');
      if (storedEmail) {
        setEmail(storedEmail);
        setTempEmail(storedEmail);
        setEmailSaved(true);
      }
    };

    fetchUsername();
  }, []);

  const handleSaveEmail = async () => {
    if (!/^\S+@\S+\.\S+$/.test(tempEmail)) {
      alert('Please enter a valid email address');
      return;
    }

    await AsyncStorage.setItem('email', tempEmail);
    setEmail(tempEmail);
    setEmailSaved(true);
  };

  const handleChangeEmail = () => {
    setEmailSaved(false);
  };

  const handleLogout = async () => {
    await AsyncStorage.removeItem('username');
    await AsyncStorage.removeItem('password');
    await AsyncStorage.removeItem('email');
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.appName}>Avian: AI Safety Companion</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Username:</Text>
        <TextInput style={styles.readonlyInput} value={username} editable={false} />
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Email:</Text>
        {emailSaved ? (
          <View style={styles.inlineRow}>
            <TextInput style={styles.readonlyInput} value={email} editable={false} />
            <TouchableOpacity style={styles.inlineButton} onPress={handleChangeEmail}>
              <Text style={styles.buttonText}>Change</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <View style={styles.inlineRow}>
            <TextInput
              style={styles.input}
              value={tempEmail}
              onChangeText={setTempEmail}
              placeholder="Enter email"
            />
            <TouchableOpacity style={styles.inlineButton} onPress={handleSaveEmail}>
              <Text style={styles.buttonText}>Save</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <View style={styles.aboutSection}>
        <Text style={styles.aboutTitle}>About This App</Text>
        <Text style={styles.aboutText}>
          Avian is not just an app; it's a symbol of care, vigilance, and the silent support that walks with you wherever
          you go. Developed with heartfelt intention, Avian uses cutting-edge AI technologies like gaze detection and
          automatic recording to provide a proactive layer of safety in everyday environments — especially designed with
          women’s security in mind.
          {'\n\n'}
          This app was built out of love and concern, inspired by someone special — to ensure that even in the absence of
          loved ones, there's always a companion looking out for you. Whether you're commuting, walking alone, or just
          need the peace of mind that someone is virtually by your side, Avian is here for you.
          {'\n\n'}
          My dream is for every person to feel a little more protected, a little more empowered, and a lot more valued
          simply by having Avian with them. Thank you for believing in this idea, for giving it a space on your phone and
          in your life. Let’s walk safer, together.
        </Text>
      </View>

      <View style={styles.footer}>
        <Text style={styles.versionText}>Version: 3.23.24</Text>
        <Text style={styles.madeByText}>Made with ❤️ by Anuj</Text>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    backgroundColor: '#f9f9f9',
    flexGrow: 1,
  },
  appName: {
    fontSize: 22,
    fontWeight: 'bold',
    alignSelf: 'center',
    marginBottom: 30,
    color: '#222',
  },
  section: {
    marginBottom: 25,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '600',
  },
  input: {
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
    backgroundColor: '#fff',
  },
  readonlyInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flex: 1,
    backgroundColor: '#eee',
  },
  inlineRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineButton: {
    marginLeft: 10,
    backgroundColor: '#007AFF',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
  },
  aboutSection: {
    marginTop: 10,
    marginBottom: 30,
  },
  aboutTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 12,
  },
  aboutText: {
    fontSize: 15,
    lineHeight: 22,
    color: '#444',
  },
  footer: {
    marginTop: 'auto',
    alignItems: 'center',
    marginBottom: 30,
  },
  versionText: {
    fontSize: 15,
    marginTop: 10,
    color: '#555',
  },
  madeByText: {
    fontSize: 15,
    color: '#888',
    marginTop: 4,
  },
  logoutButton: {
    marginTop: 20,
    backgroundColor: '#FF4D4D',
    paddingHorizontal: 40,
    paddingVertical: 12,
    borderRadius: 8,
  },
  logoutText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default ProfileScreen;
