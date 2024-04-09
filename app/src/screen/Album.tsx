import {
    Alert,
    Image,
    View,
    RefreshControl, FlatList, TouchableOpacity
} from 'react-native';
import React, {useEffect, useState} from "react";
import Header from "../component/Header";
import {useNavigation, useRoute} from '@react-navigation/native';
import {$fetch} from "../core/utils"; // Importer le hook useRoute



export default function Album() {
    const navigation = useNavigation();

    const route = useRoute(); // Utiliser le hook useRoute pour récupérer les paramètres de la route
    const { albumId, albumName, isDefault } = route.params; // Extraire les paramètres de la route
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

    const handlePhotoPress = (photo: never, isDefault: boolean) => {
        navigation.navigate('Photo', { photo, isDefault, albumId });
    };

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            // Code à exécuter lorsque le composant est affiché à nouveau
            // ou que la page est focalisée à nouveau
            handleRefresh();
        });

        return unsubscribe; // Nettoyage lors du démontage du composant
    }, [navigation]);


    return (
        <View className='flex-1'>
            <Header name={albumName} />
            <FlatList
                data={photos}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }) => (
                    <TouchableOpacity className='flex-1' onPress={() => handlePhotoPress(item, isDefault)}>
                        <Image source={{ uri: item.url }} style={{ flex: 1, aspectRatio: 1 }} />
                    </TouchableOpacity>
                )}
                refreshControl={<RefreshControl refreshing={loading} onRefresh={handleRefresh} />}
            />
        </View>
    )
}
