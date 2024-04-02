import { View, Text, Button } from 'react-native';
import React from "react";
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function Account() {
  const removeAuthToken = async () => {
    await AsyncStorage.removeItem('authToken');
  };

  return (
    <View className='mt-20'>
      <Text className='text-red-500'>Account</Text>
      <Button title="Remove Auth Token" onPress={removeAuthToken} />
    </View>
  );
}
