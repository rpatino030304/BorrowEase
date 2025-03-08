import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function BorrowerManagement() {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);

    // Reload the borrowed books when this screen is focused
    useFocusEffect(
        React.useCallback(() => {
            loadBooks();
        }, [])
    );

    const loadBooks = async () => {
        try {
            setLoading(true);
            const storedBooks = await AsyncStorage.getItem('books');
            if (storedBooks) {
                const books = JSON.parse(storedBooks);
                // Filter the books that are marked as 'Borrowed'
                setBorrowedBooks(books.filter(book => book.status === 'Borrowed'));
            }
        } catch (error) {
            console.error('Error loading books:', error);
        } finally {
            setLoading(false);
        }
    };

    const returnBook = async (bookId) => {
        try {
            const storedBooks = await AsyncStorage.getItem('books');
            if (storedBooks) {
                let books = JSON.parse(storedBooks);
                // Find the book being returned
                const returnedBook = books.find(book => book.id === bookId);
                if (returnedBook) {
                    // Update the status of the book to 'Available' and remove borrower details
                    books = books.map(book =>
                        book.id === bookId
                            ? { ...book, status: 'Available', borrowedBy: null, studentId: null }
                            : book
                    );

                    // Add the returned book to the returnedBooks list
                    let storedReturnedBooks = await AsyncStorage.getItem('returnedHistory');
                    let returnedBooksList = storedReturnedBooks ? JSON.parse(storedReturnedBooks) : [];
                    const returnTime = new Date().toLocaleString(); // Get the current time as "Returned At"
                    returnedBooksList.push({
                        title: returnedBook.title,
                        borrowedBy: returnedBook.borrowedBy,
                        studentId: returnedBook.studentId,
                        returnedAt: returnTime
                    });

                    // Save the updated books and returned books to AsyncStorage
                    await AsyncStorage.setItem('books', JSON.stringify(books));
                    await AsyncStorage.setItem('returnedHistory', JSON.stringify(returnedBooksList));

                    // Reload books after returning the book
                    loadBooks(); // This will refresh the borrowed books list
                }
            }
        } catch (error) {
            console.error('Error returning book:', error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>📚 Borrowed Books</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
            ) : borrowedBooks.length === 0 ? (
                <Text style={styles.noBooks}>No books borrowed yet.</Text>
            ) : (
                <FlatList
                    data={borrowedBooks}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={({ item }) => (
                        <View style={styles.bookCard}>
                            {/* Book Image */}
                            <Image source={{ uri: item.image }} style={styles.bookImage} />
                            <Text style={styles.bookTitle}>{item.title}</Text>
                            <Text style={styles.bookAuthor}>by {item.author}</Text>
                            <Text style={styles.studentName}>Borrowed by: {item.borrowedBy}</Text>
                            <Text style={styles.studentId}>Student ID: {item.studentId}</Text>

                            <TouchableOpacity
                                style={styles.returnButton}
                                onPress={() => returnBook(item.id)}
                            >
                                <Text style={styles.returnText}>Return Book</Text>
                            </TouchableOpacity>
                        </View>
                    )}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
    header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
    loader: { marginTop: 20 },
    noBooks: { textAlign: 'center', fontSize: 16, color: 'gray', marginTop: 20 },
    bookCard: {
        backgroundColor: '#fff',
        padding: 15,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 3,
    },
    bookImage: {
        width: 100,
        height: 150,
        borderRadius: 8,
        marginBottom: 10,
    },
    bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    bookAuthor: { fontSize: 14, color: '#555', marginBottom: 5 },
    studentName: { fontSize: 14, color: '#555' },
    studentId: { fontSize: 14, color: '#555' },
    returnButton: {
        backgroundColor: '#E74C3C',
        padding: 10,
        borderRadius: 5,
        alignItems: 'center',
        marginTop: 10,
    },
    returnText: { color: 'white', fontWeight: 'bold' },
});
