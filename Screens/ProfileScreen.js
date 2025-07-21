import React, { useEffect, useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Animated,
  Easing,
  Dimensions,
  Pressable,
  Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { height } = Dimensions.get('window');
const LONG_PRESS_DURATION = 1000;

let tripleTapCount = 0;
let lastTapTime = 0;

const ProfileScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [emailSaved, setEmailSaved] = useState(false);
  const [tempEmail, setTempEmail] = useState('');

  const [showShortEasterEgg, setShowShortEasterEgg] = useState(false);
  const [showBigEasterEgg, setShowBigEasterEgg] = useState(false);

  const bgColorAnim = useRef(new Animated.Value(0)).current;
  const heartScale = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    const fetchUserData = async () => {
      const storedUsername = await AsyncStorage.getItem('username');
      if (storedUsername) {
        setUsername(storedUsername);
        handleSpecialDates(storedUsername);
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

    fetchUserData();
  }, []);

  const handleSpecialDates = (currentUser) => {
    if (currentUser.toLowerCase() === 'honeybunny') {
      const today = new Date();
      const day = today.getDate();
      const month = today.getMonth(); // 0-based (0 = Jan)

      if (day === 23) {
        Alert.alert('❤️ Happy Anniversary!', 'Every 23rd is a day to celebrate us.');
      }

      if (day === 8 && month === 8) {
        Alert.alert('🎉 Happy Birthday!', 'Happy Birthday to the most amazing person ever 💖');
      }
    }
  };

  useEffect(() => {
    if (showBigEasterEgg) {
      Animated.timing(bgColorAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: false,
      }).start();

      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }).start();

      Animated.loop(
        Animated.sequence([
          Animated.timing(heartScale, {
            toValue: 1,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
          Animated.timing(heartScale, {
            toValue: 0.8,
            duration: 600,
            easing: Easing.ease,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      Animated.timing(bgColorAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start();

      Animated.timing(slideAnim, {
        toValue: height,
        duration: 300,
        easing: Easing.in(Easing.ease),
        useNativeDriver: true,
      }).start();

      heartScale.setValue(0);
    }
  }, [showBigEasterEgg]);

  const handleAppNamePress = () => {
    const now = Date.now();
    if (now - lastTapTime < 300) {
      tripleTapCount += 1;
    } else {
      tripleTapCount = 1;
    }
    lastTapTime = now;

    if (tripleTapCount >= 3) {
      setShowShortEasterEgg(true);
      setTimeout(() => setShowShortEasterEgg(false), 3000);
      tripleTapCount = 0;
    }
  };

  const longPressTimeout = useRef(null);

  const onTouchStart = (e) => {
    if (e.nativeEvent.touches.length === 2) {
      longPressTimeout.current = setTimeout(() => {
        setShowBigEasterEgg(true);
      }, LONG_PRESS_DURATION);
    }
  };

  const onTouchEnd = () => {
    clearTimeout(longPressTimeout.current);
  };

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
    await AsyncStorage.clear();
    navigation.replace('Login');
  };

  const backgroundColor = bgColorAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['#f9f9f9', '#ffe6ea'],
  });

  return (
    <Animated.View
      style={[styles.flexOne, { backgroundColor }]}
      onTouchStart={onTouchStart}
      onTouchEnd={onTouchEnd}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <TouchableOpacity onPress={handleAppNamePress}>
          <Text style={styles.appName}>Avian: AI Safety Companion</Text>
        </TouchableOpacity>

        {showShortEasterEgg && (
          <Text style={styles.shortEasterEggText}>
            🐣 Surprise! You found the Easter Egg. You're curious — and that's awesome!
          </Text>
        )}

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
                keyboardType="email-address"
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

      {showBigEasterEgg && (
        <Animated.View
          style={[
            styles.bigEggContainer,
            { transform: [{ translateY: slideAnim }] },
          ]}
          pointerEvents="box-none"
        >
          <Animated.Text
            style={[styles.heartBig, { transform: [{ scale: heartScale }] }]}
          >
            ❤️
          </Animated.Text>
          <ScrollView style={styles.bigEggTextContainer}>
            <Text style={styles.bigEggText}>
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
          </ScrollView>
          <TouchableOpacity
            style={styles.closeBigEggButton}
            onPress={() => setShowBigEasterEgg(false)}
          >
            <Text style={styles.closeBigEggText}>Close</Text>
          </TouchableOpacity>
        </Animated.View>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  // styles as before
  flexOne: { flex: 1 },
  container: { padding: 24, 
              flexGrow: 1 
            },
  appName: { 
    fontSize: 22, 
    fontWeight: 'bold', 
    alignSelf: 'center', 
    marginBottom: 20, 
    color: '#222' 
  },
  shortEasterEggText: { 
    color: '#D2691E', 
    textAlign: 'center', 
    fontSize: 14, 
    fontStyle: 'italic', 
    marginBottom: 25 
  },
  section: { marginBottom: 25 },
  label: { 
    fontSize: 16, 
    marginBottom: 8, 
    fontWeight: '600' 
  },
  input: { 
    borderWidth: 1, 
    borderColor: '#aaa', 
    borderRadius: 8, 
    paddingHorizontal: 12, 
    paddingVertical: 10, 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  readonlyInput: { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 10, flex: 1, backgroundColor: '#eee' },
  inlineRow: { flexDirection: 'row', alignItems: 'center' },
  inlineButton: { marginLeft: 10, backgroundColor: '#007AFF', paddingHorizontal: 14, paddingVertical: 10, borderRadius: 8 },
  buttonText: { color: '#fff', fontWeight: '600' },
  aboutSection: { marginTop: 10, marginBottom: 30 },
  aboutTitle: { fontSize: 18, fontWeight: '700', marginBottom: 12 },
  aboutText: { fontSize: 15, lineHeight: 22, color: '#444' },
  footer: { marginTop: 'auto', alignItems: 'center', marginBottom: 30 },
  versionText: { fontSize: 15, marginTop: 10, color: '#555' },
  madeByText: { fontSize: 15, color: '#888', marginTop: 4 },
  logoutButton: { marginTop: 20, backgroundColor: '#FF4D4D', paddingHorizontal: 40, paddingVertical: 12, borderRadius: 8 },
  logoutText: { color: '#fff', fontWeight: 'bold' },
  bigEggContainer: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '60%', backgroundColor: '#fff0f4', borderTopLeftRadius: 20, borderTopRightRadius: 20, padding: 20, shadowColor: '#000', shadowOffset: { width: 0, height: -3 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 10 },
  heartBig: { fontSize: 48, alignSelf: 'center', marginBottom: 15 },
  bigEggTextContainer: { flex: 1, marginBottom: 15 },
  bigEggText: { fontSize: 15, lineHeight: 22, color: '#444' },
  closeBigEggButton: { backgroundColor: '#FF4D4D', paddingVertical: 10, borderRadius: 10, alignSelf: 'center', width: '50%' },
  closeBigEggText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
});

export default ProfileScreen;
