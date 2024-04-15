import React, {useEffect, useState} from 'react';
import {View, Image, Alert, RefreshControl, FlatList, TouchableOpacity} from 'react-native';
import Header from '../component/Header';
import {$fetch} from '../core/utils';
import {useNavigation} from "@react-navigation/native";

type Photo = {
    id: string;
    name: string;
    url: string;
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

    return (
        <View style={{flex: 1}}>
            <Header name='Feed'/>
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
