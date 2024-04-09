import {
    Alert,
    Image,
    ScrollView,
    View,
    Text,
    TouchableOpacity,
    RefreshControl
} from 'react-native';
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {List} from "react-native-paper";
import Header from "../component/Header";
import {$fetch} from "../core/utils";
import CreateAlbumModal from '../component/CreateAlbumModal';
import { useNavigation } from '@react-navigation/native';


type Photo = {
    id: string;
    name: string;
    url: string;
};


export default function Library() {
    const navigation = useNavigation();
    const [albums, setAlbums] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [albumName, setAlbumName] = useState('');
    const [loading, setLoading] = useState(true);


    const handleCreateAlbum = async () => {
        const authToken = await AsyncStorage.getItem('authToken');
        try {
            await $fetch('POST', 'album', JSON.stringify({name: albumName}));
            fetchUserAlbums().then(r => r);
        } catch (error) {
            console.log('Error fetching user library:', error);
            Alert.alert('Error fetching user library');
        }
        setAlbumName('');
        setModalVisible(false);
    };

    const fetchUserAlbums = async () => {
        try {
            const data = await $fetch('GET', 'album/user')
            setAlbums(data.content);
        } catch (error) {
            console.log('Error fetching user albums:', error);
            Alert.alert('Error fetching user albums');
        } finally {
            setLoading(false);
        }
    }

    const handleAlbumPress = (albumId: string, albumName: string, isDefault: boolean, album: never) => {
        // Fonction pour gérer le clic sur un album
        navigation.navigate('Album', { albumId, albumName, isDefault, album });
    }

    const handleRefresh = () => {
        setLoading(true);
        fetchUserAlbums().then(r => r);
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            handleRefresh();
        });

        return unsubscribe;
    }, [navigation]);

    return (
        <View className='flex-1'>
            <Header name='Library'/>
            <ScrollView
                className='flex-1'
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh}/>}
            >
                <List.Section className='flex flex-row flex-wrap justify-start px-3'>
                    {albums.map((album, index) => (
                        <TouchableOpacity className='w-1/2 mx-0' key={index} onPress={() => handleAlbumPress(album.id, album.title, album.isDefault, album)}>
                            <View key={index} className='w-10/12 mx-0 mb-3'>
                                {album.photos.length > 0 ? (
                                    <Image
                                        source={{uri: album.photos[0].url}}
                                        style={{aspectRatio: 1}}
                                        className='rounded w-full'
                                    />
                                ) : (
                                    <Image
                                        source={{uri: 'https://static.thenounproject.com/png/17840-200.png'}}
                                        style={{aspectRatio: 1}}
                                        className='rounded w-full bg-gray-300'
                                    />
                                )}

                                <Text className='text-center mt-2 w-10/12'>{album.title}</Text>
                            </View>
                        </TouchableOpacity>
                    ))}
                    <TouchableOpacity className='w-1/2 mx-0' onPress={() => setModalVisible(true)}>
                        <View className='rounded w-10/12 mb-3 bg-gray-300'>
                            <Image
                                source={{uri: 'https://static.thenounproject.com/png/877484-200.png'}}
                                style={{aspectRatio: 1}}
                                className='rounded w-full'
                            />
                        </View>
                    </TouchableOpacity>
                </List.Section>
                <CreateAlbumModal
                    visible={modalVisible}
                    onClose={() => setModalVisible(false)}
                    onCreate={() => fetchUserAlbums().then(r => r)}
                />
            </ScrollView>
        </View>
    );
}
