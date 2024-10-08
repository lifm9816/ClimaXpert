import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from '../screens/HomeScreen.js';
import { LogBox, Text, View } from "react-native";

const Stack = createNativeStackNavigator();

LogBox.ignoreLogs([]);

export default function AppNavigation() {
    return (
        <NavigationContainer>
            <Stack.Navigator>
                <Stack.Screen name = "Home" options = {{ headerShown: false }} component = {HomeScreen} />
            </Stack.Navigator>
        </NavigationContainer>
    )
}