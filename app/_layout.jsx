import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import BookManagement from './screens/BookManagement';
import AvailableBooks from './screens/AvailableBooks';
import BorrowerManagement from './screens/BorrowerManagement';
import ReturnedHistory from './screens/ReturnedHistory';
import Icon from 'react-native-vector-icons/MaterialIcons';

const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ Custom Header with Neon Glow
function CustomHeader({ title, navigation }) {
    return (
        <View style={styles.header}>
            <TouchableOpacity onPress={() => navigation.openDrawer()} style={styles.menuButton}>
                <Icon name="menu" size={30} color="#00FFF7" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>{title}</Text>
        </View>
    );
}

// ✅ Custom Sidebar Navbar (Drawer)
function CustomDrawerContent(props) {
    return (
        <DrawerContentScrollView {...props} contentContainerStyle={styles.drawerContainer}>
            <View style={styles.drawerHeader}>
                <Text style={styles.drawerTitle}>📚 BorrowEase</Text>
            </View>
            <DrawerItem
                label="Home"
                icon={() => <Icon name="home" size={24} color="#00FFF7" />}
                onPress={() => props.navigation.navigate('Home')}
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Book Management"
                icon={() => <Icon name="library-books" size={24} color="#00FFF7" />}
                onPress={() => props.navigation.navigate('Book Management')}
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Available Books"
                icon={() => <Icon name="book" size={24} color="#00FFF7" />}
                onPress={() => props.navigation.navigate('Available Books')}
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Borrower Management"
                icon={() => <Icon name="person" size={24} color="#00FFF7" />}
                onPress={() => props.navigation.navigate('Borrower Management')}
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
            <DrawerItem
                label="Returned History"
                icon={() => <Icon name="history" size={24} color="#00FFF7" />}
                onPress={() => props.navigation.navigate('Returned History')}
                labelStyle={styles.drawerLabel}
                style={styles.drawerItem}
            />
        </DrawerContentScrollView>
    );
}

// ✅ Stack Navigator with Header
function StackNavigator({ navigation }) {
    return (
        <Stack.Navigator
            screenOptions={{
                header: ({ route }) => <CustomHeader title={route.name} navigation={navigation} />,
            }}
        >
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Book Management" component={BookManagement} />
            <Stack.Screen name="Available Books" component={AvailableBooks} />
            <Stack.Screen name="Borrower Management" component={BorrowerManagement} />
        </Stack.Navigator>
    );
}

// ✅ Drawer Navigator with Header & Custom Sidebar
export default function App() {
    return (
        <Drawer.Navigator
            screenOptions={{
                header: ({ route, navigation }) => <CustomHeader title={route.name} navigation={navigation} />,
                drawerStyle: styles.drawerStyle,
            }}
            drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Book Management" component={BookManagement} />
            <Drawer.Screen name="Available Books" component={AvailableBooks} />
            <Drawer.Screen name="Borrower Management" component={BorrowerManagement} />
            <Drawer.Screen name="Returned History" component={ReturnedHistory} />
        </Drawer.Navigator>
    );
}

// ✅ Styles for Web 3.0 Header & Navbar
const styles = StyleSheet.create({
    header: {
        backgroundColor: '#000', // Dark background
        paddingVertical: 15,
        paddingHorizontal: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-start',
        shadowColor: '#00FFF7', // Neon glow
        shadowOpacity: 1,
        shadowRadius: 20,
        borderBottomWidth: 2,
        borderBottomColor: '#00FFF7',
    },
    menuButton: {
        marginRight: 15,
    },
    headerTitle: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#00FFF7',
        textShadowColor: '#0FF',
        textShadowRadius: 15,
        textTransform: 'uppercase',
    },
    drawerContainer: {
        flex: 1,
        backgroundColor: '#000', // Dark theme
    },
    drawerHeader: {
        padding: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#00FFF7',
    },
    drawerTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#00FFF7',
        textAlign: 'center',
        textShadowColor: '#0FF',
        textShadowRadius: 10,
    },
    drawerItem: {
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: '#111',
        paddingVertical: 8,
        paddingHorizontal: 15,
    },
    drawerLabel: {
        color: '#00FFF7',
        fontSize: 16,
    },
    drawerStyle: {
        backgroundColor: '#000', // Black background for cyberpunk feel
        width: 250,
    },
});

