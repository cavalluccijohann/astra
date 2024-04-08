import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, TextInput } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Header from "../component/Header";

type User = {
  username: string;
  email: string;
}

export default function Account() {
  const [user, setUser] = useState<User>({
    username: '',
    email: '',
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userToken = await AsyncStorage.getItem('authToken');
        const response = await fetch('https://api.astra.hrcd.fr/auth/current', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userToken}`,
          },
        });
        const data = await response.json();
        setUser(data);
      } catch (error) {
        console.log('Error fetching user:', error);
      }
      setLoading(false);
    };

    fetchData().then(r => r);
  }, []);

  const removeAuthToken = async () => {
    await AsyncStorage.removeItem('authToken');
  };

  return (
    <View className='flex-1'>
      <Header name='Account' />
      <ScrollView className='flex-1'>
        {loading ? (
          <Text>Loading...</Text>
        ) : (
          <>
            <TextInput value={user.username} className='border border-gray-300 rounded p-2 m-2' />
            <TextInput value={user.email} className='border border-gray-300 rounded p-2 m-2' />
            <Text onPress={() => {}} className='bg-blue-500 text-white p-2 m-2 rounded'>
              Update
            </Text>
          </>
        )}
        <Text onPress={removeAuthToken} className='bg-red-500 text-white p-2 m-2 rounded'>
          Logout
        </Text>
      </ScrollView>
    </View>
  );
}
