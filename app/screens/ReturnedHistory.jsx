import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

export default function ReturnedHistory() {
    const [returnedBooks, setReturnedBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        React.useCallback(() => {
            loadReturnedBooks();
        }, [])
    );

    const loadReturnedBooks = async () => {
        try {
            setLoading(true);
            const storedReturnedBooks = await AsyncStorage.getItem('returnedHistory');
            if (storedReturnedBooks) {
                const returnedBooksList = JSON.parse(storedReturnedBooks);
                setReturnedBooks(returnedBooksList);
            }
        } catch (error) {
            console.error('Error loading returned books:', error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>📚 Returned Books</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
            ) : returnedBooks.length === 0 ? (
                <Text style={styles.noBooks}>No books have been returned yet.</Text>
            ) : (
                <FlatList
                    data={returnedBooks}
                    keyExtractor={(item, index) => index.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.bookCard}>
                            <Text style={styles.bookTitle}>{item.title}</Text>
                            <Text style={styles.studentName}>Borrowed by: {item.borrowedBy}</Text>
                            <Text style={styles.studentId}>Student ID: {item.studentId}</Text>
                            <Text style={styles.returnedAt}>Returned at: {item.returnedAt}</Text>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { 
        flex: 1, 
        padding: 20, 
        backgroundColor: 'black'  // Changed background to black
    },
    header: { 
        fontSize: 24, 
        fontWeight: 'bold', 
        textAlign: 'center', 
        marginBottom: 15, 
        color: 'white'  // Changed text to white
    },
    loader: { marginTop: 20 },
    noBooks: { 
        textAlign: 'center', 
        fontSize: 16, 
        color: 'white',  // Changed text to white
        marginTop: 20 
    },
    bookCard: {
        backgroundColor: '#222',  // Dark background for contrast
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 3,
    },
    bookTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: 'white'  // Changed text to white
    },
    studentName: { 
        fontSize: 14, 
        color: 'white'  // Changed text to white
    },
    studentId: { 
        fontSize: 14, 
        color: 'white'  // Changed text to white
    },
    returnedAt: { 
        fontSize: 14, 
        color: 'white',  // Changed text to white
        marginTop: 5 
    },
});

