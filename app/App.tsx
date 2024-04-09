import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from "./src/screen/MainScreen";
import { createStackNavigator } from '@react-navigation/stack';
import Login from './src/screen/LoginScreen';
import Register from './src/screen/RegisterScreen';
import Library from "./src/screen/Library";
import Account from "./src/screen/Account";
import Camera from "./src/screen/Camera";
import Feed from "./src/screen/Feed";
import './global.css';
import { Headline } from "react-native-paper";
import Album from "./src/screen/Album";
import Photo from "./src/screen/Photo";
const Stack = createStackNavigator();

export default function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Effect hook pour vérifier l'état de connexion au chargement de l'application
    useEffect(() => {
        // Fonction asynchrone pour vérifier si l'utilisateur est connecté
        const checkLoginStatus = async () => {
            try {
                // Récupérer les données d'authentification depuis le stockage local
                const userToken = await AsyncStorage.getItem('authToken');
                console.log(userToken);
                // Vérifier si les données d'authentification existent
                if (userToken) {
                    // Si les données d'authentification existent, l'utilisateur est connecté
                    console.log("test", isLoggedIn);
                    setIsLoggedIn(true);
                } else {
                    // Sinon, l'utilisateur n'est pas connecté
                    console.log('Utilisateur non connecté');
                    setIsLoggedIn(false);
                }
            } catch (error) {
                // Gérer les erreurs de récupération des données d'authentification
                console.error('Erreur lors de la récupération des données d\'authentification:', error);
            }
        };

        // Appeler la fonction pour vérifier l'état de connexion
        console.log('Vérification de l\'état de connexion...');
        checkLoginStatus().then(r => console.log('Vérification terminée'));
    }, []);
    return (
        <NavigationContainer>
            <Stack.Navigator>
                {!isLoggedIn && (
                    <Stack.Screen name="Login" component={Login} options={{ headerShown: false }} />
                )}
                <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Register" component={Register} options={{ headerShown: false }} />
                <Stack.Screen name="Library" component={Library} options={{ headerShown: false }} />
                <Stack.Screen name="Feed" component={Feed} options={{ headerShown: false }} />
                <Stack.Screen name="Camera" component={Camera} options={{ headerShown: false }} />
                <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
                <Stack.Screen name="Album" component={Album} options={{ headerShown: false }} />
                <Stack.Screen name="Photo" component={Photo} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>

    );
}
