import {View, Text, Image, Alert, Animated, ScrollView} from 'react-native';
import React, {useEffect, useState} from "react";
import {List} from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Feed() {
    const [photos, setPhotos] = useState([]);

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
        <ScrollView className='flex-1'>
            <View className='flex-1 px-6 py-20'>
                <Text className='text-2xl font-bold'>Feed</Text>
                <List.Subheader>Photos</List.Subheader>
                <List.Section className='grid grid-cols-3 gap-4'>
                    {photos.map((photo, index) => (
                        <Image
                            key={index}
                            source={{uri: photo.url}}
                            className='w-1/3 h-1/3 rounded'
                        />
                    ))}
                </List.Section>
            </View>
        </ScrollView>
    );
}