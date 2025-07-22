import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';

export default function App() {
  const [permission, requestPermission] = useCameraPermissions();
  const [cameraType, setCameraType] = useState("back");

  if (!permission) return <View style={styles.center}><Text>Loading camera...</Text></View>;
  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ marginBottom: 10 }}>We need camera access</Text>
        <TouchableOpacity onPress={requestPermission} style={styles.button}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <CameraView style={styles.camera} facing={cameraType} />
      <TouchableOpacity
        onPress={() => setCameraType(prev => (prev === "back" ? "front" : "back"))}
        style={styles.toggleButton}
      >
        <Text style={styles.buttonText}>Flip Camera</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  center: {
    flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20,
  },
  button: {
    backgroundColor: '#1490ff', padding: 10, borderRadius: 6,
  },
  toggleButton: {
    position: 'absolute', bottom: 30, alignSelf: 'center',
    backgroundColor: '#1490ff', padding: 12, borderRadius: 8,
  },
  buttonText: {
    color: '#fff', fontWeight: 'bold',
  },
});
