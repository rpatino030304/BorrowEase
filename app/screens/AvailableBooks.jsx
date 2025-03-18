import React, { useState, useEffect } from 'react';
import { 
  View, Text, FlatList, TouchableOpacity, StyleSheet, 
  Image, ActivityIndicator, Modal, TextInput 
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation, useFocusEffect } from '@react-navigation/native';

export default function AvailableBooks() {
  const [availableBooks, setAvailableBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [studentName, setStudentName] = useState('');
  const [studentId, setStudentId] = useState('');
  const navigation = useNavigation();

  useEffect(() => {
    loadBooks();
  }, []);

  // Reload books when screen is focused
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
        setAvailableBooks(books.filter(book => book.status === 'Available'));
      }
    } catch (error) {
      console.error('Error loading books:', error);
    } finally {
      setLoading(false);
    }
  };

  const openBorrowModal = (book) => {
    setSelectedBook(book);
    setStudentName('');
    setStudentId('');
    setModalVisible(true);
  };

  const confirmBorrow = async () => {
    if (!studentName.trim() || !studentId.trim()) {
      alert('Please enter student name and ID.');
      return;
    }

    try {
      const storedBooks = await AsyncStorage.getItem('books');
      if (storedBooks) {
        let books = JSON.parse(storedBooks);
        books = books.map(book =>
          book.id === selectedBook.id
            ? { ...book, status: 'Borrowed', borrowedBy: studentName, studentId }
            : book
        );
        await AsyncStorage.setItem('books', JSON.stringify(books));
        loadBooks();
        setModalVisible(false);

        // Pass only primitive fields to avoid serialization issues
        navigation.navigate('Borrower Management', {
          borrowedBook: {
            id: selectedBook.id,
            title: selectedBook.title,
            author: selectedBook.author,
            image: selectedBook.image,
          },
        });
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>📚 Search for Books</Text>

      {loading ? (
        <ActivityIndicator size="large" color="#4A90E2" style={styles.loader} />
      ) : availableBooks.length === 0 ? (
        <Text style={styles.noBooks}>No books available for borrowing.</Text>
      ) : (
        <FlatList
          data={availableBooks}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.bookCard}>
              {item.image ? (
                <Image source={{ uri: item.image }} style={styles.bookImage} />
              ) : (
                <View style={styles.placeholderImage}>
                  <Text style={styles.placeholderText}>No Image</Text>
                </View>
              )}
              <View style={styles.bookInfo}>
                <Text style={styles.bookTitle}>{item.title}</Text>
                <Text style={styles.bookAuthor}>by {item.author}</Text>
                <TouchableOpacity
                  style={styles.borrowButton}
                  onPress={() => openBorrowModal(item)}
                >
                  <Text style={styles.borrowText}>📖 Borrow</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        />
      )}

      {/* Borrow Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Borrow Book</Text>
            <Text style={styles.modalBookTitle}>{selectedBook?.title}</Text>

            <TextInput
  style={styles.input}
  placeholder="Enter Student Name"
  placeholderTextColor="white"
  value={studentName}
  onChangeText={setStudentName}
/>
<TextInput
  style={styles.input}
  placeholder="Enter Student ID"
  keyboardType="numeric"
  placeholderTextColor="white"
  value={studentId}
  onChangeText={setStudentId}
/>


            <View style={styles.modalButtons}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.confirmButton} 
                onPress={confirmBorrow}
              >
                <Text style={styles.confirmText}>Confirm</Text>
              </TouchableOpacity>
            </View>
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
  noBooks: { textAlign: 'center', fontSize: 16, color: '#bbb', marginTop: 20 },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#222', // Dark background for book card
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    elevation: 3,
    alignItems: 'center',
  },
  bookImage: { width: 70, height: 100, borderRadius: 5, marginRight: 15 },
  placeholderImage: {
    width: 70,
    height: 100,
    borderRadius: 5,
    backgroundColor: '#444', // Darker gray for contrast
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  placeholderText: { color: '#bbb', fontSize: 12 },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  bookAuthor: { fontSize: 14, color: '#bbb', marginBottom: 10 },
  borrowButton: { backgroundColor: '#4A90E2', padding: 10, borderRadius: 5, alignItems: 'center' },
  borrowText: { color: 'white', fontWeight: 'bold' },

  // Modal Styles
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: '#222', // Dark modal background
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10, color: 'white' },
  modalBookTitle: { fontSize: 16, color: '#bbb', marginBottom: 20 },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#555', // Darker border
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: '#333', // Dark input field
    color: 'white', // White text inside input
  },
  modalButtons: { flexDirection: 'row', marginTop: 10 },
  cancelButton: { backgroundColor: '#555', padding: 10, borderRadius: 5, marginRight: 10 },
  cancelText: { color: 'white', fontWeight: 'bold' },
  confirmButton: { backgroundColor: '#4A90E2', padding: 10, borderRadius: 5 },
  confirmText: { color: 'white', fontWeight: 'bold' },
});

