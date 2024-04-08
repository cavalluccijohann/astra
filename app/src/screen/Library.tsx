import { Alert, Image, ScrollView, View, Text, RefreshControl, FlatList } from 'react-native';
import React, { useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { List } from "react-native-paper";
import Header from "../component/Header";
import { $fetch } from "../core/utils";

type Photo = {
  id: string;
  name: string;
  url: string;
};

export default function Library() {
  const [albums, setAlbums] = useState([]);
  const [photos, setPhotos] = useState([]);

  useEffect(() => {
    const fetchUserAlbums = async () => {
        try {
            const data = await $fetch('GET', 'album/user')
            setAlbums(data.content);
        } catch (error) {
            console.log('Error fetching user albums:', error);
            Alert.alert('Error fetching user albums');
        }
    }

    const fetchUserLibrary = async () => {
      const authToken = await AsyncStorage.getItem('authToken');
      try {
        const data = await $fetch('GET', 'photo');
        setPhotos(data.content.photos);
      } catch (error) {
        console.log('Error fetching user library:', error);
        Alert.alert('Error fetching user library');
      }
    };

    fetchUserAlbums().then(r => r);
    console.log('albums', albums);

    }, []);

  return (
    <View className='flex-1'>
      <Header name='Library' />
      <ScrollView className='flex-1 '>
        <List.Section className='flex flex-row flex-wrap justify-center px-3'>
          {albums.map((album, index) => (
              <View key={index} style={{ marginBottom: 10 }} className='w-1/2 mb-4 mx-0'>
                  {album.photos.length > 0 ? (
                    <Image
                        source={{ uri: album.photos[0].url }}
                        style={{ aspectRatio: 1 }}
                        className='rounded w-10/12'
                    />
                  ) : (
                    <Image
                        source={{ uri: 'https://fomantic-ui.com/images/wireframe/image.png' }}
                        style={{ aspectRatio: 1 }}
                        className='rounded w-10/12'
                    />
                    )}
                <Text className='text-center mt-2 w-10/12'>{album.title}</Text>
              </View>
            ))}
        </List.Section>
      </ScrollView>
    </View>
  );
}
