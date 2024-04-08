import { Alert, Image, ScrollView, View } from 'react-native';
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { List } from "react-native-paper";
import Header from "../component/Header";

type Photo = {
  id: string;
  name: string;
  url: string;
};

export default function Library() {
  const [photos, setPhotos] = useState<Photo[]>([]);

  useEffect(() => {
    const fetchUserLibrary = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      try {
        const response = await fetch('https://api.astra.hrcd.fr/photo', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${authToken}`,
          },
        });
        const data = await response.json();
        setPhotos(data.content.photos);
      } catch (error) {
        console.log('Error fetching user library:', error);
        Alert.alert('Error fetching user library');
      }
    };

    fetchUserLibrary().then(r => r);
  }, []);

  return (
    <View className='flex-1'>
      <Header name='Library' />
      <ScrollView className='flex-1'>
        <List.Section className='flex flex-wrap'>
          {photos.map((photo, index) => (
            <Image
              key={index}
              source={{ uri: photo.url }}
              style={{ width: '49%', aspectRatio: 1 }}
            />
          ))}
        </List.Section>
      </ScrollView>
    </View>
  );
}
