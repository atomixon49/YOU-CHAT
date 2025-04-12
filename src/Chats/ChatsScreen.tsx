import React, { useState, useEffect, useCallback } from 'react';
import { View, FlatList, StyleSheet } from 'react-native';
import { FAB, Portal } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import ChatListItem from '../components/ChatListItem';
import CreateGroupDialog from '../components/CreateGroupDialog';
import AddContactDialog from '../components/AddContactDialog';
import { ChatStackParamList } from '../navigation/ChatNavigator';
import ChatService, { Chat, Message } from '../services/ChatService';
import UserService from '../services/UserService';

type ChatScreenNavigationProp = StackNavigationProp<ChatStackParamList, 'ChatsList'>;

export const ChatsScreen = () => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [showFAB, setShowFAB] = useState(false);
  const [showGroupDialog, setShowGroupDialog] = useState(false);
  const [showAddContactDialog, setShowAddContactDialog] = useState(false);
  const navigation = useNavigation<ChatScreenNavigationProp>();
  const currentUser = UserService.getCurrentUser();

  const loadChats = useCallback(() => {
    const allChats = ChatService.getAllChats();
    setChats(allChats.sort((a, b) => {
      const timeA = a.lastMessage?.timestamp || '';
      const timeB = b.lastMessage?.timestamp || '';
      return timeB.localeCompare(timeA);
    }));
  }, []);

  useEffect(() => {
    loadChats();

    const handleNewMessage = (message: Message) => {
      loadChats();
    };

    ChatService.onMessage(handleNewMessage);

    return () => {
      ChatService.removeMessageListener(handleNewMessage);
    };
  }, [loadChats]);

  const handleChatPress = (chatId: string, title: string) => {
    navigation.navigate('ChatRoom', {
      chatId,
      title,
    });
  };

  const getChatTitle = (chat: Chat): string => {
    if (chat.isGroup) {
      return chat.groupName || 'Grupo';
    }
    // En una implementación real, obtendríamos el nombre del otro participante
    return `Chat ${chat.id}`;
  };

  const handleCreateGroup = async (name: string, participants: string[]) => {
    if (!currentUser) return;

    try {
      const allParticipants = [...participants, currentUser.id];
      const newChat = await ChatService.createChat(allParticipants, true, name);
      loadChats();
      setShowGroupDialog(false);
      navigation.navigate('ChatRoom', {
        chatId: newChat.id,
        title: name,
      });
    } catch (error) {
      console.error('Error creating group:', error);
    }
  };

  const handleNewChat = async (phone: string) => {
    if (!currentUser) return;

    try {
      // En una implementación real, buscaríamos el usuario por teléfono
      const mockParticipantId = `user_${Date.now()}`;
      const newChat = await ChatService.createChat([currentUser.id, mockParticipantId]);
      loadChats();
      setShowAddContactDialog(false);
      navigation.navigate('ChatRoom', {
        chatId: newChat.id,
        title: getChatTitle(newChat),
      });
    } catch (error) {
      console.error('Error creating chat:', error);
    }
  };

  const renderItem = ({ item: chat }: { item: Chat }) => {
    const title = getChatTitle(chat);
    const avatar = chat.isGroup 
      ? (chat.groupAvatar || 'https://i.pravatar.cc/150')
      : 'https://i.pravatar.cc/150';

    return (
      <ChatListItem
        avatar={avatar}
        name={title}
        lastMessage={chat.lastMessage?.text || ''}
        timestamp={chat.lastMessage 
          ? new Date(chat.lastMessage.timestamp).toLocaleTimeString()
          : ''}
        unreadCount={0}
        onPress={() => handleChatPress(chat.id, title)}
      />
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={chats}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        style={styles.list}
      />
      
      <Portal>
        <FAB.Group
          open={showFAB}
          icon={showFAB ? 'close' : 'plus'}
          actions={[
            {
              icon: 'account-multiple-plus',
              label: 'Nuevo grupo',
              onPress: () => setShowGroupDialog(true),
            },
            {
              icon: 'message-plus',
              label: 'Nuevo chat',
              onPress: () => setShowAddContactDialog(true),
            },
          ]}
          onStateChange={({ open }) => setShowFAB(open)}
          style={styles.fab}
        />
      </Portal>

      <CreateGroupDialog
        visible={showGroupDialog}
        onDismiss={() => setShowGroupDialog(false)}
        onCreateGroup={handleCreateGroup}
      />

      <AddContactDialog
        visible={showAddContactDialog}
        onDismiss={() => setShowAddContactDialog(false)}
        onAdd={handleNewChat}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
  },
});

export default ChatsScreen;