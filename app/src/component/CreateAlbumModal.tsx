import React, { useState } from 'react';
import { Modal, Text, View, TextInput, Button, Alert } from 'react-native';
import { $fetch } from '../core/utils';
import AsyncStorage from '@react-native-async-storage/async-storage';

type CreateAlbumModalProps = {
    visible: boolean;
    onClose: () => void;
    onCreate: () => void;
};

const CreateAlbumModal: React.FC<CreateAlbumModalProps> = ({ visible, onClose, onCreate }) => {
    const [albumName, setAlbumName] = useState('');

    const handleCreateAlbum = async () => {
        const authToken = await AsyncStorage.getItem('authToken');
        try {
            await $fetch('POST', 'album', JSON.stringify({ name: albumName }));
            onCreate();
        } catch (error) {
            console.log('Error fetching user library:', error);
            Alert.alert('Error fetching user library');
        }
        setAlbumName('');
        onClose();
    };

    return (
        <Modal
            animationType="slide"
            transparent={true}
            visible={visible}
            onRequestClose={() => onClose()}
        >
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <View className='bg-white p-5 rounded'>
                    <Text className='text-xl mb-5'>Create New Album</Text>
                    <TextInput
                        className='rounded border-2 mb-5 p-2 border-gray-600'
                        placeholder="Album Name"
                        onChangeText={(text) => setAlbumName(text)}
                        value={albumName}
                    />
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                        <Button title="Cancel" color="red" onPress={() => onClose()} />
                        <Button title="Create" onPress={handleCreateAlbum} />
                    </View>
                </View>
            </View>
        </Modal>
    );
};

export default CreateAlbumModal;
