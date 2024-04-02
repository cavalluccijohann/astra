import React, {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { NavigationContainer } from '@react-navigation/native';
import MainScreen from "./src/screen/MainScreen";
import { createStackNavigator } from '@react-navigation/stack';
import LoginPage from './src/screen/LoginScreen';
import Library from "./src/screen/Library";
import Account from "./src/screen/Account";
import Camera from "./src/screen/Camera";
import Feed from "./src/screen/Feed";
import './global.css';
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
                // Vérifier si les données d'authentification existent
                if (userToken) {
                    // Si les données d'authentification existent, l'utilisateur est connecté
                    setIsLoggedIn(true);
                } else {
                    // Sinon, l'utilisateur n'est pas connecté
                    setIsLoggedIn(false);
                }
            } catch (error) {
                // Gérer les erreurs de récupération des données d'authentification
                console.error('Erreur lors de la récupération des données d\'authentification:', error);
            }
        };

        // Appeler la fonction pour vérifier l'état de connexion
        checkLoginStatus();
    }, []);
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName={isLoggedIn ? 'Main' : 'Login'}>
                <Stack.Screen name="Login" component={LoginPage} options={{ headerShown: false }} />
                <Stack.Screen name="Main" component={MainScreen} options={{ headerShown: false }} />
                <Stack.Screen name="Library" component={Library} options={{ headerShown: false }} />
                <Stack.Screen name="Feed" component={Feed} options={{ headerShown: false }} />
                <Stack.Screen name="Camera" component={Camera} options={{ headerShown: false }} />
                <Stack.Screen name="Account" component={Account} options={{ headerShown: false }} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
