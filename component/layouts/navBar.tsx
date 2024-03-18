import { TouchableOpacity, View, Text } from 'react-native';
import {useNavigation} from "@react-navigation/native";
import React from 'react';
import Screen1 from '../screen1';
import Screen2 from '../screen2';
export default function NavBar() {
    const navigation = useNavigation();

    const goToScreen1 = () => {
        navigation.navigate('Screen1');
    };

    const goToScreen2 = () => {
        navigation.navigate('Screen2');
    };
    return (
        <View style={{ flexDirection: 'row', backgroundColor: 'lightblue', justifyContent: 'space-around', paddingVertical: 10 }}>
            <TouchableOpacity onPress={goToScreen1} style={{ padding: 20 }}>
                <Text>Screen 1</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={goToScreen2} style={{ padding: 20 }}>
                <Text>Screen 2</Text>
            </TouchableOpacity>
        </View>
    );
}
