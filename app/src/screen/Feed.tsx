import {View, Image, Alert} from 'react-native';
import React, {useEffect, useState} from "react";
import MasonryList from 'react-native-masonry-list';
import AsyncStorage from "@react-native-async-storage/async-storage";
import Header from "../component/Header";

type Photo = {
    id: string;
    name: string;
    url: string;
};

export default function Feed() {
    const [photos, setPhotos] = useState<Photo[]>([]);

    useEffect(() => {
        const fetchPublicAlbum = async () => {
            const authToken = await AsyncStorage.getItem('authToken');
            try {
                const response = await fetch('https://api.astra.hrcd.fr/album', {
                    method: 'GET',
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                    },
                });
                const data = await response.json();
                const photos = [];
                for (let i = 0; i < data.content.length; i++) {
                    for (let j = 0; j < data.content[i].photos.length; j++) {
                        photos.push(data.content[i].photos[j]);
                    }
                }
                setPhotos(photos);
            } catch (error) {
                console.log('Error fetching user library:', error);
                Alert.alert('Error fetching user library');
            }
        };

        fetchPublicAlbum().then(r => r);
    }, []);

    return (
        <View className='flex-1'>
            <Header name='Feed' />
            <MasonryList
              images={photos.map(photo => ({ uri: photo.url }))}
              spacing={2}
              columns={2}
              renderItem={({ item, index }) => (
                <Image
                  source={item}
                  style={{ flex: 1, aspectRatio: 1 }}
                />
              )}
            />
        </View>
    );
}
