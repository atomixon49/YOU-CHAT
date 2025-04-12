import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { ChatNavigator } from './ChatNavigator';
import { ProfileNavigator } from './ProfileNavigator';
import MomentsScreen from '../Moments/MomentsScreen';
import ContactsScreen from '../Contacts/ContactsScreen';

const Tab = createBottomTabNavigator();

export const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'Chats':
              iconName = focused ? 'chatbubbles' : 'chatbubbles-outline';
              break;
            case 'Momentos':
              iconName = focused ? 'images' : 'images-outline';
              break;
            case 'Contactos':
              iconName = focused ? 'people' : 'people-outline';
              break;
            case 'Perfil':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'alert-circle';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarStyle: {
          backgroundColor: '#ffffff',
          borderTopColor: '#e0e0e0',
          height: 60,
          paddingBottom: 8,
          paddingTop: 8,
        },
        tabBarActiveTintColor: '#25D366',
        tabBarInactiveTintColor: '#666666',
        headerShown: false,
      })}
    >
      <Tab.Screen name="Chats" component={ChatNavigator} />
      <Tab.Screen name="Momentos" component={MomentsScreen} />
      <Tab.Screen name="Contactos" component={ContactsScreen} />
      <Tab.Screen name="Perfil" component={ProfileNavigator} />
    </Tab.Navigator>
  );
};