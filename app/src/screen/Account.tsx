import { View, Text, Button } from 'react-native';
import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Account() {
  const removeAuthToken = async () => {
    await AsyncStorage.removeItem('authToken');
  };

  return (
    <View style={{ flex: 1, marginTop: 20 }}>
      <Text>Account</Text>
      <Button title="Remove Auth Token" onPress={removeAuthToken} />
    </View>
  );
}
