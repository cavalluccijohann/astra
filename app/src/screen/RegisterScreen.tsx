import React, { memo, useState } from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from 'react-native';
import Background from '../component/Background';
import Logo from '../component/Logo';
import Header from '../component/Header';
import Button from '../component/Button';
import TextInput from '../component/TextInput';
import BackButton from '../component/BackButton';
import { theme } from '../core/theme';
import { emailValidator, passwordValidator } from '../core/utils';
import { Navigation } from '../types';
import AsyncStorage from "@react-native-async-storage/async-storage";

type Props = {
    navigation: Navigation;
};

const RegisterScreen = ({ navigation }: Props) => {
    const [email, setEmail] = useState({ value: '', error: '' });
    const [password, setPassword] = useState({ value: '', error: '' });
    const [userName, setUserName] = useState({ value: '', error: '' });

    const _onRegisterPressed = async () => {
        const emailError = emailValidator(email.value);
        const passwordError = passwordValidator(password.value);
        const userNameError = passwordValidator(userName.value);

        if (emailError || passwordError || userNameError) {
            setEmail({ ...email, error: emailError });
            setPassword({ ...password, error: passwordError });
            setUserName({ ...userName, error: userNameError });
            return;
        }

        console.log(email, password, userName);

        try {
            const response = await fetch('https://api.astra.hrcd.fr/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email.value, password: password.value, username: userName.value })
            });

            const data = await response.json();

            if (response.ok) {
                // Authentification réussie
                // Redirigez l'utilisateur vers l'écran suivant (par exemple, le tableau de bord)
                navigation.navigate('Login');
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
        <Background>
            <BackButton goBack={() => navigation.navigate('Login')} />
            <Logo />
            <Header>Welcome.</Header>

            <TextInput
                label="Email"
                returnKeyType="next"
                value={email.value}
                onChangeText={text => setEmail({ value: text, error: '' })}
                error={!!email.error}
                errorText={email.error}
                autoCapitalize="none"
                autoCompleteType="email"
                textContentType="emailAddress"
                keyboardType="email-address"
            />

            <TextInput
                label="Username"
                returnKeyType="next"
                value={userName.value}
                onChangeText={text => setUserName({ value: text, error: '' })}
                error={!!userName.error}
                errorText={userName.error}
                autoCapitalize="none"
            />

            <TextInput
                label="Password"
                returnKeyType="done"
                value={password.value}
                onChangeText={text => setPassword({ value: text, error: '' })}
                error={!!password.error}
                errorText={password.error}
                secureTextEntry
            />

            <Button mode="contained" onPress={_onRegisterPressed}>
                Register
            </Button>

        </Background>
    );
};


export default memo(RegisterScreen);
