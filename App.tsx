import React from 'react';
import { View, Text } from 'react-native';
import TestComponent from './component/test';
import Screen1 from './component/screen1';
import Screen2 from './component/screen2';
import NavBar from './component/layouts/navBar';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Iconicons from 'react-native-vector-icons/Ionicons';


export default function App() {
    const tab = createBottomTabNavigator();
    return (
        <NavigationContainer>
        <View style={{ flex: 1 }}>
            <tab.Navigator
                screenOptions={({ route }) => ({
                    tabBarIcon: ({ focused, color, size }) => {
                        let iconName;
                        if (route.name === 'Camera') {
                            iconName = focused ? 'camera' : 'camera';
                        } else if (route.name === 'Feed') {
                            iconName = focused ? 'home' : 'home';
                        } else if (route.name === 'Screen2') {
                            iconName = focused ? 'list' : 'list';
                        }
                        return <Iconicons name={iconName} size={size} color={color} />;
                    },
                    tabBarLabel: () => null,
                    headerShown: false,
                })}
            >
                <tab.Screen name={"Camera"} component={TestComponent} />
                <tab.Screen name={"Feed"} component={Screen1} />
                <tab.Screen name={"Screen2"} component={Screen2} />
            </tab.Navigator>
        </View>
        </NavigationContainer>
    );
}
