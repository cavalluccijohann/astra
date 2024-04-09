import {
    Alert,
    Image,
    View,
    RefreshControl, FlatList, TouchableOpacity, Text, Button,
    Modal
} from 'react-native';
import React, {useEffect, useState} from "react";
import Header from "../component/Header";
import {useNavigation, useRoute} from '@react-navigation/native';
import {$fetch} from "../core/utils";
import Iconicons from "react-native-vector-icons/Ionicons"; // Importer le hook useRoute


export default function Album() {
    const navigation = useNavigation();
    const route = useRoute(); // Utiliser le hook useRoute pour récupérer les paramètres de la route
    const {albumId, albumName, isDefault, album} = route.params; // Extraire les paramètres de la route
    const [modalVisible, setModalVisible] = useState(false);

    const albumVisible = album.isPublic ? 'Public' : 'Private';
    const albumVisibleReverse = album.isPublic ? 'Private' : 'Public';

    const [loading, setLoading] = useState(true);
    const [photos, setPhotos] = useState([]);

    const fetchPhotos = async () => {
        try {
            const data = await $fetch('GET', `album/${albumId}`);
            setPhotos(data.content.photos);
        } catch (error) {
            console.log('Error fetching album photos:', error);
            Alert.alert('Error fetching album photos');
        } finally {
            setLoading(false);
        }
    };

    const fetchDeleteAlbum = async () => {
        try {
            await $fetch('DELETE', `album/${albumId}`);
            navigation.goBack();
        } catch (error) {
            console.log('Error deleting album:', error);
            Alert.alert('Error deleting album');
        } finally {
            setLoading(false);
        }
    }

    const fetchStatusAlbum = async () => {
        try {
            await $fetch('PUT', `album/${albumId}`);
        } catch (error) {
            console.log('Error changing album status:', error);
            Alert.alert('Error changing album status');
        } finally {
            setLoading(false);
        }
    }

    const handleModalOpen = () => {
        setModalVisible(true);
    };

    const handleModalClose = () => {
        setModalVisible(false);
    };

    const handleRefresh = () => {
        setLoading(true);
        fetchPhotos().then(r => r);
    };

    const handlePhotoPress = (photo: never, isDefault: boolean) => {
        navigation.navigate('Photo', {photo, isDefault, albumId});
    };

    const handleStatusPress = () => {
        setLoading(true);
        fetchStatusAlbum().then(r => r);
        navigation.goBack();
    };

    const handleDeleteAlbum = async () => {
        setLoading(true);
        fetchDeleteAlbum().then(r => r);
    }

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            handleRefresh();
        });
        console.log('Album screen mounted', album);

        return unsubscribe;
    }, [navigation]);


    return (
        <View className='flex-1'>
            <View className="pb-5 bg-neutral-950">
                <View className='flex-row justify-between items-end h-24'>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text className='text-white pl-5'>
                            <Iconicons name={'arrow-back'} size={30} color={'white'}/>
                        </Text>
                    </TouchableOpacity>
                    <View className='flex-1 flex-col justify-center items-center'>
                        <Text className='text-white text-xl'>{albumName}</Text>
                        <Text className='text-white text-xl opacity-50'>{albumVisible}</Text>
                    </View>

                    {!isDefault ? (
                        <TouchableOpacity className='pr-5' onPress={handleModalOpen}>
                            <Iconicons name={'ellipsis-horizontal'} size={30} color={'white'}/>
                        </TouchableOpacity>
                    ) : null}
                </View>
            </View>


            <FlatList
                data={photos}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({item}) => (
                    <TouchableOpacity className='flex-1' onPress={() => handlePhotoPress(item, isDefault)}>
                        <Image source={{uri: item.url}} style={{flex: 1, aspectRatio: 1}}/>
                    </TouchableOpacity>
                )}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh}/>}
            />

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleModalClose}
            >
                <View className='flex-1 justify-center items-center bg-black/50 bg-opacity-50 rounded'>
                    <View className='bg-white p-4 rounded w-2/3'>
                        <TouchableOpacity className='py-2' onPress={handleStatusPress}>
                            <Text className='text-blue-500 mb-2'>Passer a un album {albumVisibleReverse}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity className='py-2' onPress={handleDeleteAlbum}>
                            <Text className='text-red-500 mb-2'>Supprimer l'album</Text>
                        </TouchableOpacity>
                        <Button color='red' title="Fermer" onPress={handleModalClose}/>
                    </View>
                </View>
            </Modal>
        </View>
    )
}
