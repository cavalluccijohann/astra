import React, {memo, useState} from 'react';
import {TouchableOpacity, StyleSheet, Text, View, KeyboardAvoidingView} from 'react-native';
import Logo from '../component/Logo';
import TextInput from '../component/TextInput';
import {theme} from '../core/theme';
import {emailValidator, passwordValidator} from '../core/utils';
import {Navigation} from '../types';
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
    navigation: Navigation;
};

const LoginScreen = ({navigation}: Props) => {
    const [email, setEmail] = useState({value: '', error: ''});
    const [password, setPassword] = useState({value: '', error: ''});

    const _onLoginPressed = async () => {
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);

        if (emailError || passwordError) {
            setEmail({...email, error: emailError});
            setPassword({...password, error: passwordError});
            return;
        }
        try {
            const response = await fetch('https://api.astra.hrcd.fr/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: email.value, password: password.value})
            });

            const data = await response.json();

            if (response.ok) {
                // Authentification réussie
                // Redirigez l'utilisateur vers l'écran suivant (par exemple, le tableau de bord)
                const authToken = data.authToken;
                await AsyncStorage.setItem('authToken', authToken);
                navigation.navigate('Main');
            } else {
                // Authentification échouée
                // Affichez un message d'erreur à l'utilisateur
                alert('Identifiants incorrects');
            }
        } catch (error) {
            // Gestion des erreurs de connexion
            console.error('Erreur lors de la connexion:', error);
            alert('Une erreur s\'est produite lors de la connexion');
        }
    };

    return (
        <KeyboardAvoidingView className="flex-1" behavior="padding">
            <View className="flex-1 justify-center items-center">
            <View className="bg-neutral-950 w-full h-screen flex justify-center items-center">
                <Logo/>
                <View className="flex items-center justify-center w-full">
                    <Text className="text-white text-2xl font-bold my-5">Welcome back.</Text>
                    <TextInput
                        label="Email"
                        returnKeyType="next"
                        value={email.value}
                        onChangeText={text => setEmail({value: text, error: ''})}
                        error={!!email.error}
                        errorText={email.error}
                        autoCapitalize="none"
                        autoCompleteType="email"
                        textContentType="emailAddress"
                        keyboardType="email-address"
                        className="mx-11 w-3/4"
                        cursorColor="white"
                        outlineColor="white"
                        activeOutlineColor="grey"
                        selectionColor="grey"
                    />
                    <TextInput
                        label="Password"
                        returnKeyType="done"
                        value={password.value}
                        onChangeText={text => setPassword({value: text, error: ''})}
                        error={!!password.error}
                        errorText={password.error}
                        secureTextEntry
                        className="mx-11 w-3/4"
                        cursorColor="white"
                        outlineColor="white"
                        activeOutlineColor="grey"
                        selectionColor="grey"
                    />
                    <TouchableOpacity onPress={_onLoginPressed} className="bg-neutral-400 w-3/4 h-12 flex items-center justify-center rounded-md my-5">
                        <Text className="text-white text-xl font-bold">Login</Text>
                    </TouchableOpacity>
                    <View className="flex flex-row mt-5">
                        <Text className="text-neutral-500">Don’t have an account? </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
                            <Text className="text-white font-bold">Sign up</Text>
                        </TouchableOpacity>
                    </View>
                </View>

            </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default memo(LoginScreen);
