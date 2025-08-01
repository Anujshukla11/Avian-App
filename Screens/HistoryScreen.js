import React from "react";
import { View, Text, StyleSheet } from 'react-native';

export default function HistoryScreen(){
    return (
        <View style={styles.container}>
            <Text style={styles.text}>History Screen</Text> 
        </View>
    );
}

const styles = StyleSheet.create({
    container: {flex: 1, justifyContent: 'center', alignItems: 'center'},
    text: {fontSize: 20, fontWeight: 'bold', color: '#1e90ff'},
});