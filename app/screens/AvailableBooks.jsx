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
      <Text style={styles.header}>📚 Available Books</Text>

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
              value={studentName}
              onChangeText={setStudentName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter Student ID"
              keyboardType="numeric"
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
  container: { flex: 1, padding: 20, backgroundColor: '#f8f8f8' },
  header: { fontSize: 24, fontWeight: 'bold', textAlign: 'center', marginBottom: 15, color: '#333' },
  loader: { marginTop: 20 },
  noBooks: { textAlign: 'center', fontSize: 16, color: 'gray', marginTop: 20 },
  bookCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
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
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  placeholderText: { color: '#888', fontSize: 12 },
  bookInfo: { flex: 1 },
  bookTitle: { fontSize: 18, fontWeight: 'bold', color: '#333' },
  bookAuthor: { fontSize: 14, color: '#555', marginBottom: 10 },
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
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  modalBookTitle: { fontSize: 16, color: '#555', marginBottom: 20 },
  input: {
    width: '100%',
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  modalButtons: { flexDirection: 'row', marginTop: 10 },
  cancelButton: { backgroundColor: '#ccc', padding: 10, borderRadius: 5, marginRight: 10 },
  cancelText: { color: '#333', fontWeight: 'bold' },
  confirmButton: { backgroundColor: '#4A90E2', padding: 10, borderRadius: 5 },
  confirmText: { color: 'white', fontWeight: 'bold' },
});
