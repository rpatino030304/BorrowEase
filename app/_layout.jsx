import React from 'react';
import { TouchableOpacity } from 'react-native';
import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import HomeScreen from './screens/HomeScreen';
import BookManagement from './screens/BookManagement';
import AvailableBooks from './screens/AvailableBooks';
import BorrowerManagement from './screens/BorrowerManagement';
import ReturnedHistory from './screens/ReturnedHistory';
import Icon from 'react-native-vector-icons/MaterialIcons';


const Stack = createStackNavigator();
const Drawer = createDrawerNavigator();

// ✅ Fix: Properly pass `screenOptions`
function StackNavigator({ navigation }) {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Home" component={HomeScreen} />
            <Stack.Screen name="Book Management" component={BookManagement} />
            <Stack.Screen name="Available Books" component={AvailableBooks} />
            <Stack.Screen name="Borrower Management" component={BorrowerManagement} />
        </Stack.Navigator>
    );
}

// ✅ Use StackNavigator inside Drawer
export default function App() {
    return (
        <Drawer.Navigator screenOptions={{ headerShown: true }}>
           
            <Drawer.Screen name="Home" component={HomeScreen} />
            <Drawer.Screen name="Book Management" component={BookManagement} />
            <Drawer.Screen name="Available Books" component={AvailableBooks} />
            <Drawer.Screen name="Borrower Management" component={BorrowerManagement} />
            <Stack.Screen name="ReturnedHistory" component={ReturnedHistory} />
        </Drawer.Navigator>
    );
}
