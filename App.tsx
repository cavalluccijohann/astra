import { Button, Text, TouchableOpacity, View } from 'react-native';
import { NativeWindStyleSheet } from "nativewind";
import { Camera, CameraType } from 'expo-camera';
import { useState } from 'react';
import React from 'react';

export default function App() {
    const [type, setType] = useState(CameraType.back);
    const [permission, requestPermission] = Camera.useCameraPermissions();

    if (!permission) {
        // Camera permissions are still loading
        return <View />;
    }

    if (!permission.granted) {
        // Camera permissions are not granted yet
        return (
            <View className="flex-1 items-center justify-center">
                <Text className="text-center">We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }

    function toggleCameraType() {
        setType(current => (current === CameraType.back ? CameraType.front : CameraType.back));
    }

    return (
        <View className="flex-1 justify-center">
            <Camera type={type} className="flex-1">
                <View className="flex-1 items-center justify-center bg-transparent">
                    <TouchableOpacity onPress={toggleCameraType}>
                        <Text className="text-red-500 text-2xl">Flip Camera</Text>
                    </TouchableOpacity>
                </View>
            </Camera>
        </View>
    );
}

NativeWindStyleSheet.setOutput({
    default: "native",
});
