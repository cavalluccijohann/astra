import {
    Alert,
    Image,
    View,
    RefreshControl, FlatList
} from 'react-native';
import React, {useEffect, useState} from "react";
import Header from "../component/Header";
import { useRoute } from '@react-navigation/native';
import {$fetch} from "../core/utils"; // Importer le hook useRoute



export default function Album() {
    const route = useRoute(); // Utiliser le hook useRoute pour récupérer les paramètres de la route
    const { albumId, albumName } = route.params;
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

    const handleRefresh = () => {
        setLoading(true);
        fetchPhotos().then(r => r);

    };

    useEffect(() => {
        fetchPhotos().then(r => r);
    }
    , []);

    return (
        <View className='flex-1'>
            <Header name={albumName} />
            <FlatList
                data={photos}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <Image source={{ uri: item.url }} style={{ flex: 1, aspectRatio: 1 }} />
                )}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
            />
        </View>
    )
}
