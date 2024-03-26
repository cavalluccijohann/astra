import Iconicons from "react-native-vector-icons/Ionicons";
import CameraComponent from "./Camera";
import Feed from "./Feed";
import Library from "./Library";
import Account from "./Account";
import {View} from "react-native";
import React from "react";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
const tab = createBottomTabNavigator();
export default function mainScreen() {
    return (
        <View style={{ flex: 1 }}>
            <tab.Navigator
                screenOptions={({route}) => ({
                    tabBarIcon: ({focused, color, size}) => {
                        let iconName;
                        if (route.name === 'Camera') {
                            iconName = focused ? 'aperture-outline' : 'aperture-outline';
                        } else if (route.name === 'Feed') {
                            iconName = focused ? 'albums-outline' : 'albums-outline';
                        } else if (route.name === 'Library') {
                            iconName = focused ? 'layers-outline' : 'layers-outline';
                        } else if (route.name === 'Account') {
                            iconName = focused ? 'person-circle-outline' : 'person-circle-outline';
                        }
                        // @ts-ignore
                        return <Iconicons name={iconName} size={size} color={color}/>;
                    },
                    tabBarLabel: () => null,
                    headerShown: false,
                })}
            >
                <tab.Screen name={"Camera"} component={CameraComponent}/>
                <tab.Screen name={"Feed"} component={Feed}/>
                <tab.Screen name={"Library"} component={Library}/>
                <tab.Screen name={"Account"} component={Account}/>
            </tab.Navigator>
        </View>
    );
}
