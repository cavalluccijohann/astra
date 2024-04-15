import { Alert, ImageBackground, Text, TouchableOpacity, View } from 'react-native'
import { $fetch } from "../core/utils";
import { Camera } from 'expo-camera'
import React, { useEffect, useRef, useState } from 'react'
import Slider from '@react-native-community/slider';
import * as Location from 'expo-location';

let camera: Camera
export default function App() {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState<any>(null)
  const [cameraType, setCameraType] = useState(Camera.Constants.Type.back)
  const [flashMode, setFlashMode] = useState('off')
  const [zoom, setZoom] = useState(0)
  const [loading, setLoading] = useState(false)
  const [locationAddress, setLocationAddress] = useState('');

  useEffect(() => {
    let isMounted = true;
    (async () => {
      await Camera.requestCameraPermissionsAsync();
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission to access location was denied');
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const addresses = await Location.reverseGeocodeAsync({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      const city = addresses[0]?.city;
      const country = addresses[0]?.country;
      const readableAddress = `${addresses[0]?.name}, ${city}, ${country}`;
      if (isMounted) setLocationAddress(readableAddress);
    })();

    return () => { isMounted = false };
  }, []);

  const __takePicture = async () => {
    const photo = await camera.takePictureAsync({ exif: true });
    photo.exif.location = locationAddress;

    setPreviewVisible(true);
    setCapturedImage(photo);
  };

  const __savePhoto = async () => {
    setLoading(true)
    const images = new FormData();
    images.append('images', {
      uri: capturedImage.uri,
      arrayBuffer: capturedImage.arrayBuffer,
      type: 'image/jpeg',
      name: `photo-${ Date.now() }.jpg`,
      blobValue: capturedImage
    });
    const exifData = JSON.stringify(capturedImage.exif);
    images.append('exif', exifData);
    try {
      await $fetch('POST', 'photo', images);
      Alert.alert('Photo saved');
      __retakePicture();
    } catch (error) {
      console.error('Error saving photo:', error);
      Alert.alert('Error saving photo')
    }
    setLoading(false)
  }
  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
  }
  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }
  }
  const __switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }
  return (
    <View className='flex-1'>
      <View className='flex-1 w-full'>
        { previewVisible && capturedImage ? (
          <CameraPreview photo={ capturedImage } savePhoto={ __savePhoto } retakePicture={ __retakePicture } loading={ loading } />
        ) : (
          <Camera
            type={ cameraType }
            flashMode={ flashMode }
            autoFocus="on"
            className='flex-1'
            zoom={ zoom }
            ref={ (r) => {
              camera = r
            } }
          >
            <View className='flex-1 w-full bg-transparent flex flex-row'>
              <View
                className='absolute left-5 top-20 flex flex-col gap-4 justify-between'
              >
                <TouchableOpacity onPress={ __handleFlashMode }
                                  className={
                                    flashMode === 'off' ?
                                      'bg-gray-900 px-2 py-1 rounded-md flex items-center justify-center' :
                                      'bg-yellow-400 px-2 py-1 rounded-md flex items-center justify-center'
                                  }
                >
                  <Text className='text-sm text-white'>Flash</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={ __switchCamera }
                                  className={ 'bg-gray-900 px-2 py-1 rounded-md flex items-center justify-center' }
                >
                  <Text className='text-sm text-white'>Switch</Text>
                </TouchableOpacity>
              </View>
              <View className='absolute bottom-0 w-full flex flex-row justify-between px-4 mb-4'>
                <Slider
                  style={{ width: 200, height: 40 }}
                  minimumValue={0}
                  maximumValue={0.08}
                  minimumTrackTintColor="#FFFFFF"
                  maximumTrackTintColor="#000000"
                  onValueChange={setZoom}
                />
                <View className='flex-1 flex justify-center items-center'>
                  <TouchableOpacity onPress={ __takePicture }
                                    className='bg-gray-900 w-20 h-20 rounded-full flex items-center justify-center'
                  >
                    <View className='bg-white w-16 h-16 rounded-full' />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </Camera>
        ) }
      </View>
    </View>
  )
}

const CameraPreview = ({photo, retakePicture, savePhoto, loading}: any) => {
    return (
        <View className='flex-1 w-full bg-transparent flex flex-col justify-between'>
            <ImageBackground source={{uri: photo && photo.uri}} className='flex-1'>
                <View className='flex-1 flex flex-row justify-between items-end'>
                    <View className='flex-1 flex flex-row justify-between items-end px-4 pb-4'>
                        <TouchableOpacity
                            onPress={retakePicture}
                            className='bg-gray-900 px-3 py-2 rounded-md flex items-center justify-center'
                        >
                            <Text className='text-white'>Re-take</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={savePhoto}
                            className='px-3 py-2 rounded-md flex items-center justify-center bg-blue-500'
                        >
                            {loading ? (
                                <Text className='text-white'>Saving...</Text>
                            ) : (
                                <Text className='text-white'>Save</Text>
                            )}
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}
