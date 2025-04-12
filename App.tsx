import 'react-native-gesture-handler';
import React, { useEffect } from 'react';
import { Provider as PaperProvider } from 'react-native-paper';
import { RootNavigator } from './src/navigation/RootNavigator';
import UserService from './src/services/UserService';
import ChatService from './src/services/ChatService';
import NotificationService from './src/services/NotificationService';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';

export default function App() {
  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    try {
      await UserService.initialize();
      await ChatService.initialize();
      await NotificationService.initialize();

      const currentUser = UserService.getCurrentUser();
      if (currentUser) {
        // En lugar de usar connect, suscribimos al usuario a sus chats
        const chats = await ChatService.getChats(currentUser.id);
        chats.forEach(chat => ChatService.subscribeToChat(chat.id));
      }
    } catch (error) {
      console.error('Error initializing services:', error);
    }
  };

  return (
    <GestureHandlerRootView style={styles.container}>
      <PaperProvider>
        <RootNavigator />
      </PaperProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
