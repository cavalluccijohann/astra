import {
    Alert,
    Image,
    View,
    Text,
    RefreshControl, FlatList, TouchableOpacity,
    Modal, Button
} from 'react-native';
import RNPickerSelect from 'react-native-picker-select';
import React, {useEffect, useState} from "react";
import {useNavigation, useRoute} from "@react-navigation/native";
import {$fetch} from "../core/utils";
import Iconicons from "react-native-vector-icons/Ionicons";

export default function Photo() {
    const [photos, setPhotos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [modalAddingVisible, setModalAddingVisible] = useState(false);
    const [album, setAlbum] = useState([]);
    const [selectedAlbum, setSelectedAlbum] = useState(null);


    const route = useRoute();
    const {photo, isDefault, albumId} = route.params;
    const navigation = useNavigation();


    const fetchDeletePhoto = async () => {
        try {
            console.log('photo.id', photo.id);
            await $fetch('DELETE', `photo/${photo.id}`, JSON.stringify({deleteAlbum: false}));
            navigation.goBack();
        } catch (error) {
            console.log('Error deleting photo:', error);
            Alert.alert('Error deleting photo');
        }
    }

    const fetchDeletePhotoAlbum = async () => {
        try {
            await $fetch('DELETE', `photo/${photo.id}`, JSON.stringify({deleteAlbum: true, albumId: albumId}));
            navigation.goBack();
        } catch (error) {
            console.log('Error deleting photo:', error);
            Alert.alert('Error deleting photo');
        }
    }

    const fetchAlbums = async () => {
        try {
            const data = await $fetch('GET', 'album/user');
            setAlbum(data.content);
        } catch (error) {
            console.log('Error fetching user albums:', error);
            Alert.alert('Error fetching user albums');
        }
    }

    const fetchAddToAlbum = async () => {
        try {
            console.log('selectedAlbum p', selectedAlbum);
            await $fetch('PUT', `photo/${photo.id}`, JSON.stringify({albumId: selectedAlbum}));
            handleModalAddingClose();
        } catch (error) {
            console.log('Error adding photo to album:', error);
            Alert.alert('Error adding photo to album');
        }
    }

    function handleAddToAlbum() {
        fetchAddToAlbum().then(r => r);
    }


    // Fonction pour afficher la modale
    const handleModalOpen = () => {
        setModalVisible(true);
    };

    // Fonction pour fermer la modale
    const handleModalClose = () => {
        setModalVisible(false);
    };

    // Fonction pour afficher la modale
    const handleModalAddingOpen = () => {
        setModalAddingVisible(true);
        fetchAlbums().then(r => r);

    };

    // Fonction pour fermer la modale
    const handleModalAddingClose = () => {
        setModalAddingVisible(false);
    };


    const handleDeletePhoto = async () => {
        fetchDeletePhotoAlbum().then(r => r);
    };

    const handleDeletePermanently = async () => {
        fetchDeletePhoto().then(r => r);
    };

    const handleAlbumSelection = (value) => {
        setSelectedAlbum(value);
        console.log('selectedAlbum', photo.id);
    };

    useEffect(() => {

        }
        , []);


    return (
        <View className="flex-1 bg-neutral-950">
            <View className='flex-row justify-between items-end h-24'>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Text className='text-white pl-5'>
                        <Iconicons name={'arrow-back'} size={30} color={'white'}/>
                    </Text>
                </TouchableOpacity>
                <View className='flex-1 flex-row justify-end items-end'>
                    {isDefault ? (
                        <TouchableOpacity className='pr-5' onPress={handleModalAddingOpen}>
                            <Iconicons name={'add'} size={30} color={'white'}/>
                        </TouchableOpacity>
                    ) : null}

                    <TouchableOpacity className='pr-5' onPress={handleModalOpen}>
                        <Iconicons name={'ellipsis-horizontal'} size={30} color={'white'}/>
                    </TouchableOpacity>
                </View>
            </View>

            <View className='flex-1 justify-center items-center bg-neutral-950'>
                <Image source={{uri: photo.url}} className='w-full h-1/2'/>
            </View>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={handleModalClose}
            >
                <View className='flex-1 justify-center items-center bg-black/50 bg-opacity-50'>
                    <View className='bg-white p-4 rounded w-2/3'>
                        {isDefault ? (
                                <TouchableOpacity onPress={handleDeletePermanently}>
                                    <Text className='text-red-500'>Supprimer définitivement</Text>
                                </TouchableOpacity>
                            ) :
                            <TouchableOpacity onPress={handleDeletePhoto}>
                                <Text className='text-red-500'>Supprimer de l'album</Text>
                            </TouchableOpacity>}
                        <Button title="Fermer" onPress={handleModalClose}/>
                    </View>
                </View>
            </Modal>

            <Modal
                animationType="slide"
                transparent={true}
                visible={modalAddingVisible}
                onRequestClose={handleModalAddingClose}
            >
                <View className='flex-1 justify-center items-center bg-black/50 bg-opacity-50'>
                    <View className='bg-white p-4 rounded w-2/3'>
                        <Text className='mb-2'>Sélectionner un album :</Text>
                        <RNPickerSelect
                            value={selectedAlbum}
                            onValueChange={handleAlbumSelection}
                            items={album
                                .filter(albumItem => albumItem.isDefault !== true)
                                .map((albumItem) => ({
                                    label: albumItem.title,
                                    value: albumItem.id,
                                }))
                            }
                        />
                        <View className='mt-5' style={{flexDirection: 'row', justifyContent: 'space-between'}}>
                            <Button color='red' title="Fermer" onPress={handleModalAddingClose}/>
                            <Button title="Valider" onPress={handleAddToAlbum}/>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
}