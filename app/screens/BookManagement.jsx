import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, Image, FlatList, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function BookManagement() {
    const [title, setTitle] = useState('');
    const [author, setAuthor] = useState('');
    const [image, setImage] = useState(null);
    const [books, setBooks] = useState([]);
    const [editingBook, setEditingBook] = useState(null);

    useEffect(() => {
        loadBooks();
    }, []);

    const pickImage = async () => {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
            alert('Permission to access media library is required!');
            return;
        }

        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.canceled) {
            setImage(result.assets[0].uri);
        }
    };

    const loadBooks = async () => {
        try {
            const storedBooks = await AsyncStorage.getItem('books');
            if (storedBooks) {
                setBooks(JSON.parse(storedBooks));
            }
        } catch (error) {
            console.error("Error loading books:", error);
        }
    };

    const saveBooks = async (updatedBooks) => {
        try {
            await AsyncStorage.setItem('books', JSON.stringify(updatedBooks));
            setBooks(updatedBooks);
        } catch (error) {
            console.error("Error saving books:", error);
        }
    };

    const addOrUpdateBook = async () => {
        if (!title || !author || !image) {
            alert('Please enter all book details!');
            return;
        }

        let updatedBooks;
        if (editingBook) {
            updatedBooks = books.map(book =>
                book.id === editingBook.id ? { ...book, title, author, image } : book
            );
        } else {
            const newBook = { id: Date.now().toString(), title, author, image, status: 'Available' };
            updatedBooks = [...books, newBook];
        }

        await saveBooks(updatedBooks);
        setTitle('');
        setAuthor('');
        setImage(null);
        setEditingBook(null);
    };

    const deleteBook = (id) => {
        const updatedBooks = books.filter((b) => b.id !== id);
        setBooks(updatedBooks);
        saveBooks(updatedBooks);
      };
    

    const editBook = (book) => {
        setTitle(book.title);
        setAuthor(book.author);
        setImage(book.image);
        setEditingBook(book);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📖 Manage Books</Text>
            <TextInput placeholder="Book Title" value={title} onChangeText={setTitle} style={styles.input} placeholderTextColor="white" />
            <TextInput placeholder="Author" value={author} onChangeText={setAuthor} style={styles.input} placeholderTextColor="white" />
            <TouchableOpacity style={styles.button} onPress={pickImage}>
                <Text style={styles.buttonText}>📷 Pick an Image</Text>
            </TouchableOpacity>
            {image && <Image source={{ uri: image }} style={styles.image} />}

            <TouchableOpacity style={styles.addButton} onPress={addOrUpdateBook}>
                <Text style={styles.addButtonText}>{editingBook ? "✏ Update Book" : "➕ Add Book"}</Text>
            </TouchableOpacity>

            <FlatList
                data={books}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <View style={styles.bookCard}>
                        <Image source={{ uri: item.image }} style={styles.bookImage} />
                        <View style={styles.bookInfo}>
                            <Text style={styles.bookTitle}>{item.title}</Text>
                            <Text style={styles.bookAuthor}>{item.author}</Text>
                        </View>
                        <View style={styles.actionButtons}>
                            <TouchableOpacity onPress={() => editBook(item)} style={styles.editButton}>
                                <Text style={styles.editText}>✏ Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => deleteBook(item.id)} style={styles.deleteButton}>
                                <Text style={styles.deleteText}>🗑 Delete</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 16, backgroundColor: 'black' },
    title: { fontSize: 22, fontWeight: 'bold', textAlign: 'center', marginBottom: 10, color: 'white' },
    input: { borderWidth: 1, borderColor: '#ccc', padding: 10, marginVertical: 5, borderRadius: 5, backgroundColor: '#333', color: 'white' },
    image: { width: 100, height: 150, alignSelf: 'center', marginVertical: 10, borderRadius: 10 },
    bookCard: { flexDirection: 'row', alignItems: 'center', padding: 10, backgroundColor: '#222', marginVertical: 5, borderRadius: 8, shadowColor: '#fff', shadowOpacity: 0.1, shadowRadius: 4, elevation: 2 },
    bookImage: { width: 50, height: 70, marginRight: 10, borderRadius: 5 },
    bookInfo: { flex: 1 },
    bookTitle: { fontSize: 16, fontWeight: 'bold', color: 'white' },
    bookAuthor: { fontSize: 14, color: '#bbb' },
    actionButtons: { flexDirection: 'row', gap: 5 },
    editButton: { backgroundColor: '#F39C12', padding: 8, borderRadius: 5 },
    editText: { color: 'white', fontWeight: 'bold' },
    deleteButton: { backgroundColor: 'red', padding: 8, borderRadius: 5 },
    deleteText: { color: 'white', fontWeight: 'bold' },
    button: { backgroundColor: '#4A90E2', padding: 10, borderRadius: 5, alignItems: 'center', marginVertical: 5 },
    buttonText: { color: 'white', fontWeight: 'bold' },
    addButton: { backgroundColor: '#27AE60', padding: 12, borderRadius: 5, alignItems: 'center', marginVertical: 10 },
    addButtonText: { color: 'white', fontWeight: 'bold', fontSize: 16 },
});

