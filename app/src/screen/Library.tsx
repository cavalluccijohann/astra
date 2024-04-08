import {Alert, Image, ScrollView, View, Text, Modal, Button, TouchableOpacity, TextInput} from 'react-native';
import React, {useEffect, useState} from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {List} from "react-native-paper";
import Header from "../component/Header";
import {$fetch} from "../core/utils";
import {red600} from "react-native-paper/lib/typescript/styles/themes/v2/colors";

type Photo = {
    id: string;
    name: string;
    url: string;
};


export default function Library() {
    const [albums, setAlbums] = useState([]);
    const [photos, setPhotos] = useState([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [albumName, setAlbumName] = useState('');

    const handleCreateAlbum = async () => {
        const authToken = await AsyncStorage.getItem('authToken');
        try {
            console.log('Creating album:', albumName);
            await $fetch('POST', 'album', JSON.stringify({name: albumName}));
        } catch (error) {
            console.log('Error fetching user library:', error);
            Alert.alert('Error fetching user library');
        }
        setAlbumName('');
        setModalVisible(false);
    };


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

        /*const fetchUserLibrary = async () => {
            const authToken = await AsyncStorage.getItem('authToken');
            try {
                const data = await $fetch('GET', 'photo');
                setPhotos(data.content.photos);
            } catch (error) {
                console.log('Error fetching user library:', error);
                Alert.alert('Error fetching user library');
            }
        };
*/

        fetchUserAlbums().then(r => r);
    }, []);


    return (
        <View className='flex-1'>
            <Header name='Library'/>
            <ScrollView className='flex-1 '>
                <List.Section className='flex flex-row flex-wrap justify-start px-3'>
                    {albums.map((album, index) => (
                        <View key={index} style={{marginBottom: 10}} className='w-1/2 mx-0'>
                            {album.photos.length > 0 ? (
                                <Image
                                    source={{uri: album.photos[0].url}}
                                    style={{aspectRatio: 1}}
                                    className='rounded w-10/12'
                                />
                            ) : (
                                <Image
                                    source={{uri: 'https://static.thenounproject.com/png/17840-200.png'}}
                                    style={{aspectRatio: 1}}
                                    className='rounded w-10/12 bg-gray-300'
                                />
                            )}

                            <Text className='text-center mt-2 w-10/12'>{album.title}</Text>
                        </View>
                    ))}
                    <TouchableOpacity className='w-10/12' onPress={() => setModalVisible(true)}>
                        <Image
                            source={{uri: 'https://static.thenounproject.com/png/104062-200.png'}}
                            style={{aspectRatio: 1}}
                            className='rounded w-1/2 bg-gray-300'
                        />
                        <Text className='text-center mt-2 w-1/2'>Create New Album</Text>
                    </TouchableOpacity>

                    <Modal
                        animationType="slide"
                        transparent={true}
                        visible={modalVisible}
                        onRequestClose={() => {
                            setModalVisible(!modalVisible);
                        }}
                    >
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <View className='bg-white p-5 rounded'>
                                <Text className='text-xl mb-5'>Create New Album</Text>
                                <TextInput
                                    className='rounded border-2 mb-5 p-2 border-gray-600'
                                    placeholder="Album Name"
                                    onChangeText={(text) => setAlbumName(text)}
                                    value={albumName}
                                />
                                <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                                    <Button title="Cancel" color="red" onPress={() => setModalVisible(false)}/>
                                    <Button title="Create" onPress={handleCreateAlbum}/>
                                </View>
                            </View>
                        </View>
                    </Modal>
                </List.Section>
            </ScrollView>
        </View>
    );
}
