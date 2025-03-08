import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export default function BookItem({ book }) {
    return (
        <View style={styles.bookItem}>
            <Text style={styles.bookTitle}>{book.title}</Text>
            <TouchableOpacity style={styles.deleteButton}>
                <Text style={styles.deleteButtonText}>🗑️ Delete</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    bookItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: '#fff',
        padding: 15,
        borderRadius: 8,
        marginVertical: 5,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 2,
    },
    bookTitle: { fontSize: 16, fontWeight: 'bold', color: '#333' },
    deleteButton: { backgroundColor: '#E74C3C', padding: 10, borderRadius: 5 },
    deleteButtonText: { color: '#fff', fontWeight: 'bold' },
});
