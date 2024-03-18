import { Camera, CameraType } from 'expo-camera';
import React, { useState } from 'react';
import { TouchableOpacity, View, Text } from 'react-native';

export default function CameraComponent() {
    const [type, setType] = useState(CameraType.back);
    const [isCameraReady, setIsCameraReady] = useState(false);
    let camera: Camera | null = null;

    const toggleCameraType = () => {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    };

    const onCameraReady = () => {
        setIsCameraReady(true);
    };

    const takePicture = async () => {
        if (camera) {
            const photo = await camera.takePictureAsync();
            // Faites quelque chose avec la photo, comme l'afficher dans une image ou la télécharger
        }
    };

    return (
        <View style={{ flex: 1 }}>
            <Camera
                style={{ flex: 1 }}
                type={type}
                onCameraReady={onCameraReady}
                ref={(ref: Camera | null) => {
                    camera = ref;
                }}
            >
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'center', alignItems: 'flex-end' }}>
                    <TouchableOpacity onPress={toggleCameraType} style={{ padding: 20 }}>
                        <Text>Flip Camera</Text>
                    </TouchableOpacity>
                    {isCameraReady && (
                        <TouchableOpacity onPress={takePicture} style={{ padding: 20 }}>
                            <Text>Take Picture</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </Camera>
        </View>
    );
}
