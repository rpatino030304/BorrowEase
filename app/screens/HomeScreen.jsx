import React, { useEffect, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing, ImageBackground } from 'react-native';

export default function HomeScreen({ navigation }) {
    const fadeAnim = useRef(new Animated.Value(0)).current;
    const buttonScale = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
        }).start();
    }, []);

    const handlePressIn = () => {
        Animated.timing(buttonScale, {
            toValue: 0.9,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    const handlePressOut = () => {
        Animated.timing(buttonScale, {
            toValue: 1,
            duration: 100,
            useNativeDriver: true,
        }).start();
    };

    return (
        <ImageBackground source={require('../assets/home.jpg')} style={styles.background}>

            <View style={styles.overlay} />
            
            <Animated.Text style={[styles.title, { opacity: fadeAnim }]}> BorrowEase</Animated.Text>
            <Animated.Text style={[styles.subtitle, { opacity: fadeAnim }]}>
                Effortless Book Management
            </Animated.Text>

            <Animated.View style={{ transform: [{ scale: buttonScale }] }}>
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate('Book Management')}
                    onPressIn={handlePressIn}
                    onPressOut={handlePressOut}
                >
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </Animated.View>
        </ImageBackground>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: '100%',
    },
    overlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0, 0, 0, 0.5)', // Dark overlay for contrast
    },
    title: {
        fontSize: 45,
        fontWeight: 'bold',
        color: '#00FFF7',
        textShadowColor: '#0FF',
        textShadowRadius: 15,
        textTransform: 'uppercase',
    },
    subtitle: {
        fontSize: 18,
        color: '#FFFFFF',
        textShadowColor: '#0FF',
        textShadowRadius: 10,
        marginBottom: 30,
    },
    button: {
        backgroundColor: 'rgba(0, 255, 247, 0.2)',
        paddingVertical: 15,
        paddingHorizontal: 40,
        borderRadius: 30,
        borderWidth: 2,
        borderColor: '#00FFF7',
        shadowColor: '#00FFF7',
        shadowOpacity: 0.8,
        shadowRadius: 10,
        alignItems: 'center',
    },
    buttonText: {
        fontSize: 18,
        color: '#00FFF7',
        fontWeight: 'bold',
        textTransform: 'uppercase',
        letterSpacing: 2,
    },
});
