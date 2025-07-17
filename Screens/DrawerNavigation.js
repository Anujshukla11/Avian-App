// Screens/DrawerNavigation.js

import React from "react";
import {
  createDrawerNavigator,
  DrawerContentScrollView,
  DrawerItemList,
  DrawerItem,
} from "@react-navigation/drawer";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import { Alert, View, StyleSheet } from "react-native";

import HomeScreen from './HomeScreen';
import HistoryScreen from './HistoryScreen';
import MonitorScreen from './MonitorScreen';
import ProfileScreen from './ProfileScreen';

const Drawer = createDrawerNavigator();

function CustomDrawerContent(props) {
  const navigation = useNavigation();

  const handleLogout = async () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to logout?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Logout",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("userToken");
            navigation.replace("Login");
          },
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <View style={styles.flexContainer}>
      <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerScroll}>
        <DrawerItemList {...props} />
      </DrawerContentScrollView>

      <View style={styles.logoutContainer}>
        <DrawerItem
          label="Logout"
          labelStyle={{ color: 'red', fontWeight: 'bold' }}
          onPress={handleLogout}
        />
      </View>
    </View>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="Home"
      drawerContent={(props) => <CustomDrawerContent {...props} />}
      screenOptions={{
        drawerStyle: { backgroundColor: '#e6f2ff', width: 240 },
        drawerActiveTintColor: '#1e90ff',
        drawerLabelStyle: { fontSize: 16 },
        headerStyle: { backgroundColor: '#1e90ff' },
        headerTintColor: 'white',
        headerTitleAlign: 'center',
      }}
    >
      <Drawer.Screen name="Home" component={HomeScreen} />
      <Drawer.Screen name="Monitor" component={MonitorScreen} />
      <Drawer.Screen name="History" component={HistoryScreen} />
      <Drawer.Screen name="Profile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
}

const styles = StyleSheet.create({
  flexContainer: {
    flex: 1,
    justifyContent: 'space-between',
  },
  drawerScroll: {
    flexGrow: 1,
  },
  logoutContainer: {
    borderTopWidth: 1,
    borderColor: '#ccc',
    paddingBottom: 20,
  },
});
