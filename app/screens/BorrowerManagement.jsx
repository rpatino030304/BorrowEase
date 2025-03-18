import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator, Alert, TextInput, Modal } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from '@react-navigation/native';

export default function BorrowerManagement() {
    const [borrowedBooks, setBorrowedBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedBook, setSelectedBook] = useState(null);
    const [editedName, setEditedName] = useState('');
    const [editedStudentId, setEditedStudentId] = useState('');

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
                const returnedBook = books.find(book => book.id === bookId);
                if (returnedBook) {
                    books = books.map(book =>
                        book.id === bookId ? { ...book, status: 'Available', borrowedBy: null, studentId: null } : book
                    );

                    let storedReturnedBooks = await AsyncStorage.getItem('returnedHistory');
                    let returnedBooksList = storedReturnedBooks ? JSON.parse(storedReturnedBooks) : [];
                    const returnTime = new Date().toLocaleString();
                    returnedBooksList.push({
                        title: returnedBook.title,
                        borrowedBy: returnedBook.borrowedBy,
                        studentId: returnedBook.studentId,
                        returnedAt: returnTime
                    });

                    await AsyncStorage.setItem('books', JSON.stringify(books));
                    await AsyncStorage.setItem('returnedHistory', JSON.stringify(returnedBooksList));
                    loadBooks();
                }
            }
        } catch (error) {
            console.error('Error returning book:', error);
        }
    };

    const editBook = (book) => {
        setSelectedBook(book);
        setEditedName(book.borrowedBy);
        setEditedStudentId(book.studentId);
        setModalVisible(true);
    };

    const saveEditedBook = async () => {
        if (!selectedBook) return;

        try {
            const storedBooks = await AsyncStorage.getItem('books');
            if (storedBooks) {
                let books = JSON.parse(storedBooks);
                books = books.map(book =>
                    book.id === selectedBook.id ? { ...book, borrowedBy: editedName, studentId: editedStudentId } : book
                );

                await AsyncStorage.setItem('books', JSON.stringify(books));
                setModalVisible(false);
                loadBooks();
            }
        } catch (error) {
            console.error('Error updating book:', error);
        }
    };

    const deleteBook = async (bookId) => {
        Alert.alert(
            "Delete Record",
            "Are you sure you want to delete this borrowed book record?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Delete",
                    onPress: async () => {
                        try {
                            const storedBooks = await AsyncStorage.getItem('books');
                            if (storedBooks) {
                                let books = JSON.parse(storedBooks);
                                books = books.filter(book => book.id !== bookId);

                                await AsyncStorage.setItem('books', JSON.stringify(books));
                                loadBooks();
                            }
                        } catch (error) {
                            console.error('Error deleting book:', error);
                        }
                    },
                    style: "destructive"
                }
            ]
        );
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
                            <Image source={{ uri: item.image }} style={styles.bookImage} />
                            <Text style={styles.bookTitle}>{item.title}</Text>
                            <Text style={styles.bookAuthor}>by {item.author}</Text>
                            <Text style={styles.studentName}>Borrowed by: {item.borrowedBy}</Text>
                            <Text style={styles.studentId}>Student ID: {item.studentId}</Text>

                            <View style={styles.buttonContainer}>
                                <TouchableOpacity style={styles.editButton} onPress={() => editBook(item)}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
    style={styles.returnButton}
    onPress={() =>
        Alert.alert(
            "Return Book",
            `Are you sure you want to return "${item.title}"?`,
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Return",
                    onPress: () => returnBook(item.id),
                    style: "default",
                },
            ]
        )
    }
>
    <Text style={styles.buttonText}>Return</Text>
</TouchableOpacity>

                                
                            </View>
                        </View>
                    )}
                />
            )}

            <Modal visible={modalVisible} transparent={true} animationType="slide">
                <View style={styles.modalContainer}>
                    <View style={styles.modalContent}>
                        <Text style={styles.modalTitle}>Edit Borrower</Text>
                        <TextInput
                            style={styles.input}
                            value={editedName}
                            onChangeText={setEditedName}
                            placeholder="Borrower's Name"
                        />
                        <TextInput
                            style={styles.input}
                            value={editedStudentId}
                            onChangeText={setEditedStudentId}
                            placeholder="Student ID"
                            keyboardType="numeric"
                        />
                        <TouchableOpacity style={styles.saveButton} onPress={saveEditedBook}>
                            <Text style={styles.buttonText}>Save Changes</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                            <Text style={styles.buttonText}>Cancel</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: 'black' },
    header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: 'white' },
    loader: { marginTop: 20 },
    noBooks: { textAlign: 'center', fontSize: 16, color: 'white', marginTop: 20 },
    bookCard: { backgroundColor: '#222', padding: 15, marginVertical: 8, borderRadius: 8, elevation: 3 },
    bookImage: { width: 100, height: 150, borderRadius: 8, marginBottom: 10, },
    bookTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
    bookAuthor: { fontSize: 14, color: 'white', marginBottom: 5 },
    studentName: { fontSize: 14, color: 'white' },
    studentId: { fontSize: 14, color: 'white' },
    buttonContainer: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
    editButton: { backgroundColor: '#F39C12', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5 },
    returnButton: { backgroundColor: '#E74C3C', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5 },
    deleteButton: { backgroundColor: '#C0392B', padding: 10, borderRadius: 5, flex: 1, marginHorizontal: 5 },
    buttonText: { color: 'white', fontWeight: 'bold', textAlign: 'center' },
    modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
    modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 8, width: '80%', alignItems: 'center' },
    modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
    input: { width: '100%', padding: 10, borderWidth: 1, borderRadius: 5, marginBottom: 10 },
    saveButton: { backgroundColor: '#27AE60', padding: 10, borderRadius: 5, width: '100%' },
    cancelButton: { backgroundColor: '#E74C3C', padding: 10, borderRadius: 5, width: '100%', marginTop: 5 },
    bookCard: { 
        backgroundColor: '#222', 
        padding: 15, 
        marginVertical: 8, 
        borderRadius: 8, 
        elevation: 3, 
        alignItems: 'center', // Centers content horizontally
        justifyContent: 'center', // Centers content vertically
    },
    bookImage: { 
        width: 100, 
        height: 150, 
        borderRadius: 8, 
        marginBottom: 10, 
        alignSelf: 'center' // Ensures the image is centered
    },
    bookTitle: { 
        fontSize: 18, 
        fontWeight: 'bold', 
        color: 'white', 
        textAlign: 'center' // Centers text
    },
    bookAuthor: { 
        fontSize: 14, 
        color: 'white', 
        marginBottom: 5, 
        textAlign: 'center' // Centers text
    },
    studentName: { 
        fontSize: 14, 
        color: 'white', 
        textAlign: 'center' // Centers text
    },
    studentId: { 
        fontSize: 14, 
        color: 'white', 
        textAlign: 'center' // Centers text
    },
    
});
