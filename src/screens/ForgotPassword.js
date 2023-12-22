import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ImageBackground } from 'react-native';
import auth from '@react-native-firebase/auth';

const ForgotPasswordScreen = ({ navigation }) => {
    const [email, setEmail] = useState('');

    const sendPasswordResetEmail = () => {
        if (email.trim() === '') {
            alert('Please enter a valid email address');
            return;
        }
        auth()
            .sendPasswordResetEmail(email)
            .then(() => {
                alert('Mật khẩu đã được gửi trong email của bạn... trở lại đăng nhập.');
                navigation.navigate('Login');
            })
            .catch((error) => {
                console.error(error);
                alert('An error occurred while trying to send the password reset email.');
            });
    };

    return (
        <ImageBackground
            source={require('../Image/Arcane.jpg')}
            style={styles.backgroundImage}
        >
            <View style={styles.container}>
                <Text style={styles.title}>Quên mật khẩu </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                />
                <TouchableOpacity style={styles.button} onPress={sendPasswordResetEmail}>
                    <Text style={styles.buttonText}>Gửi</Text>
                </TouchableOpacity>
                
                {/* View chứa nút quay lại */}
                <View style={styles.goBackContainer}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Text style={styles.link}>Quay lại</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        padding: 20,
    },
    backgroundImage: {
        flex: 1,
        resizeMode: 'cover',
        justifyContent: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
    },
    input: {
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.5)',
        borderRadius: 5,
        padding: 10,
        marginBottom: 20,
        width: '100%',
        color: '#fff',
    },
    button: {
        backgroundColor: '#3598db',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        marginBottom: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        textAlign: 'center',
    },
    link: {
        color: 'white',
        fontSize: 18,
        textAlign: 'center',

    },
    goBackContainer: {
        marginTop: 10,
        backgroundColor: '#3598db',
        borderRadius: 5,
        padding: 10,
        width: '100%',
        marginBottom: 20,

    },
});

export default ForgotPasswordScreen;
