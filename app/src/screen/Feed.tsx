import React, { useEffect, useState } from 'react';
import { View, Image, Alert, RefreshControl, FlatList } from 'react-native';
import Header from '../component/Header';
import { $fetch } from '../core/utils';

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

    const fetchPublicAlbum = async () => {
        try {
            const data = await $fetch<{ content: Photo[] }>('GET', 'album');
            setPhotos(data.content);
        } catch (error) {
            console.log('Error fetching user library:', error);
            Alert.alert('Error fetching user library');
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

    return (
      <View style={{ flex: 1 }}>
          <Header name='Feed' />
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
    );
}
