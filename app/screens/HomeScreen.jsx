import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Easing } from 'react-native';

export default function HomeScreen({ navigation }) {
    const fadeAnim = new Animated.Value(0);

    // Animation to fade in the content when the page loads
    React.useEffect(() => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1000,
            easing: Easing.ease,
            useNativeDriver: true,
        }).start();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.contentContainer, { opacity: fadeAnim }]}>
                <Text style={styles.title}>📚 BorrowEase</Text>
                <Text style={styles.subtitle}>Book Borrowing Management</Text>

                <View style={styles.descriptionContainer}>
                    <Text style={styles.description}>
                        Organize your library effortlessly! BorrowEase helps you manage and track books, borrowers, and transactions seamlessly.
                        Start your hassle-free book borrowing experience now!
                    </Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Book Management')}>
                    <Text style={styles.buttonText}>Get Started</Text>
                </TouchableOpacity>
            </Animated.View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5F7FA',
        paddingTop: 30,  // Slightly reduced paddingTop to move content higher
    },
    contentContainer: {
        alignItems: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 10,
        paddingVertical: 30,
        width: '85%',
        marginBottom: 50,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#4A90E2',
        marginBottom: 15,
        textAlign: 'center',
    },
    subtitle: {
        fontSize: 18,
        color: '#7B8D9E',
        marginBottom: 25,
        textAlign: 'center',
    },
    button: {
        width: '80%',
        padding: 15,
        backgroundColor: '#4A90E2',
        borderRadius: 12,
        marginVertical: 10,
        alignItems: 'center',
        elevation: 5,  // Added shadow to the button
    },
    buttonText: {
        fontSize: 18,
        color: '#fff',
        fontWeight: 'bold',
    },
    descriptionContainer: {
        marginTop: 20,
    },
    description: {
        fontSize: 16,
        color: '#7B8D9E',
        textAlign: 'center',
        lineHeight: 22,
    },
});
