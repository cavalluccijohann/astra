import { Alert, Button, Text, View } from 'react-native';
import React from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Library() {
  async function getUserAlbums() {
    const authToken = await AsyncStorage.getItem('authToken');
    try {
      const response = await fetch('https://api.astra.hrcd.fr/album/user', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ authToken }`,
        },
      });
      console.log('response', response);
      return await response.json();
    } catch (error) {
      console.log('error', error);
      Alert.alert('Error fetching user albums');
    }
  }
  async function getUserLibrary() {
    const authToken = await AsyncStorage.getItem('authToken');
    try {
      const response = await fetch('https://api.astra.hrcd.fr/photo', {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${ authToken }`,
        },
      });
      console.log('response', response);
      return await response.json();
    } catch (error) {
      console.log('error', error);
      Alert.alert('Error fetching user library');
    }
  }
  const albums = getUserAlbums();
  return (
    <View className='p-10 m-20'>
      <Text>Library</Text>
      <Button title="Get User Albums" onPress={getUserAlbums} />
      <Button title="Get User Library" onPress={getUserLibrary} />
      <Text>{ JSON.stringify(albums) }</Text>
      <Text>{ JSON.stringify(getUserLibrary()) }</Text>
    </View>
  );
}
