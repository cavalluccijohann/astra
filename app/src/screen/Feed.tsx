import React, {useEffect, useState} from 'react';
import {View, Image, Alert, RefreshControl, FlatList, TouchableOpacity, TextInput} from 'react-native';
import Header from '../component/Header';
import {$fetch} from '../core/utils';
import {useNavigation} from "@react-navigation/native";

type Photo = {
    id: string;
    name: string;
    url: string;
    location: string;
    date: string;
    brandCamera: string;
    camera: string;
    type: string;
};

type Album = {
    id: string;
    name: string;
    photos: Photo[];
};

export default function Feed() {
    const [photos, setPhotos] = useState<Photo[]>([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();
    const [searchMeta, setSearchMeta] = useState('');
    let searchTimeout: any;


    const fetchPublicAlbum = async () => {
        try {
            const data = await $fetch<{ content: Photo[] }>('GET', 'album');
            setPhotos(data.content);
        } catch (error) {
            console.error(error);
            Alert.alert('Error fetching feed');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPublicAlbum().then(r => r);
    }, []);

    const handleRefresh = () => {
        setLoading(true);
        fetchPublicAlbum().then(r => r);
    };

    const handlePhotoPress = (photo: Photo) => {
        navigation.navigate('Photo', {photo, isDefault: false, albumId: ''});
    };

    const handleSearchMeta = (text: string) => {
        setSearchMeta(text);
        // Annuler la recherche précédente si elle est en cours
        clearTimeout(searchTimeout);

        // Lancer une nouvelle recherche après 2 secondes
        const searchTimeout = setTimeout(() => {
            if (text === '') {
                fetchPublicAlbum().then(r => r);
            } else {
                const filteredPhotos = photos.filter(photo => {
                    return (
                        (photo.name && photo.name.toLowerCase().includes(text.toLowerCase())) ||
                        (photo.location && photo.location.toLowerCase().includes(text.toLowerCase())) ||
                        (photo.brandCamera && photo.brandCamera.toLowerCase().includes(text.toLowerCase())) ||
                        (photo.camera && photo.camera.toLowerCase().includes(text.toLowerCase())) ||
                        (photo.type && photo.type.toLowerCase().includes(text.toLowerCase()))
                    );
                });

                setPhotos(filteredPhotos);
            }
        }, 1000);
    }

    return (
        <View style={{flex: 1}}>
            <Header name='Feed'/>
            <View className="w-full bg-neutral-950">
                <TextInput placeholder="Search" className="w-full h-12 bg-white text-neutral-100 px-4" onChangeText={handleSearchMeta} value={searchMeta}/>
            </View>
            <FlatList
                data={photos}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({item}) => (
                    <TouchableOpacity style={{flex: 1, aspectRatio: 1}} onPress={() => handlePhotoPress(item)}>
                        <Image source={{uri: item.url}} style={{flex: 1, aspectRatio: 1}}/>
                    </TouchableOpacity>
                )}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh}/>}
            />
        </View>
    );
}
