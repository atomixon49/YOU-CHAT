import React, { useState, useEffect, useCallback, useRef } from 'react';
import { View, StyleSheet, FlatList, KeyboardAvoidingView, Platform, Text } from 'react-native';
import { TextInput, IconButton, Portal, Modal } from 'react-native-paper';
import { RouteProp, useRoute, useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import MessageBubble from '../components/MessageBubble';
import ChatRoomHeader from '../components/ChatRoomHeader';
import { ChatStackParamList } from '../navigation/ChatNavigator';
import ChatService, { Message, Chat } from '../services/ChatService';
import UserService from '../services/UserService';

type ChatRoomRouteProp = RouteProp<ChatStackParamList, 'ChatRoom'>;
type ChatRoomNavigationProp = StackNavigationProp<ChatStackParamList, 'ChatRoom'>;

export const ChatRoomScreen = () => {
  const route = useRoute<ChatRoomRouteProp>();
  const navigation = useNavigation<ChatRoomNavigationProp>();
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [chat, setChat] = useState<Chat | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [showAttachments, setShowAttachments] = useState(false);
  const typingTimeoutRef = useRef<NodeJS.Timeout>();
  const currentUser = UserService.getCurrentUser();

  useEffect(() => {
    loadChat();
    loadMessages();
    const handleNewMessage = (newMessage: Message) => {
      if (newMessage.chatId === route.params.chatId) {
        setMessages(prev => [newMessage, ...prev]);
      }
    };

    ChatService.onMessage(handleNewMessage);

    return () => {
      ChatService.removeMessageListener(handleNewMessage);
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, [route.params.chatId]);

  const loadChat = useCallback(() => {
    const chatData = ChatService.getChat(route.params.chatId);
    if (chatData) {
      setChat(chatData);
    }
  }, [route.params.chatId]);

  const loadMessages = useCallback(() => {
    const chatMessages = ChatService.getChatMessages(route.params.chatId);
    setMessages([...chatMessages].reverse()); // Reverse for FlatList inverted layout
  }, [route.params.chatId]);

  const simulateTypingIndicator = () => {
    setIsTyping(true);
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, 3000);
  };

  const handleSend = async () => {
    if (!message.trim() || !currentUser || !chat) return;

    try {
      await ChatService.sendMessage(chat.id, message.trim(), currentUser.id);
      setMessage('');
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleBackPress = () => {
    navigation.goBack();
  };

  const handleInfoPress = () => {
    console.log('Show chat info');
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;

    return (
      <View style={styles.typingContainer}>
        <Text style={styles.typingText}>Escribiendo...</Text>
      </View>
    );
  };

  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    if (!currentUser) return;

    viewableItems.forEach(({ item }: { item: Message }) => {
      if (item.senderId !== currentUser.id && item.status !== 'read') {
        // Mark message as read
        ChatService.updateMessageStatus(item.id, 'read');
      }
    });
  }, [currentUser]);

  const viewabilityConfig = {
    itemVisiblePercentThreshold: 50,
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <MessageBubble
      text={item.text}
      timestamp={new Date(item.timestamp).toLocaleTimeString()}
      isSent={item.senderId === currentUser?.id}
      status={item.status}
    />
  );

  const handleImagePick = async () => {
    try {
      const permissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!permissionResult.granted) {
        alert('Se necesita permiso para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.8,
        allowsEditing: true,
      });

      if (!result.canceled && result.assets[0] && currentUser) {
        const asset = result.assets[0];
        const fileInfo = await FileSystem.getInfoAsync(asset.uri);
        
        await ChatService.sendMediaMessage(
          chat.id,
          currentUser.id,
          {
            uri: asset.uri,
            type: 'image/jpeg',
            name: `image_${Date.now()}.jpg`,
            size: fileInfo.size || 0,
          },
          'image'
        );
        setShowAttachments(false);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      alert('Error al seleccionar la imagen');
    }
  };

  const handleDocumentPick = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (result.type === 'success' && currentUser) {
        await ChatService.sendMediaMessage(
          chat.id,
          currentUser.id,
          {
            uri: result.uri,
            type: result.mimeType || 'application/octet-stream',
            name: result.name,
            size: result.size,
          },
          'document'
        );
        setShowAttachments(false);
      }
    } catch (error) {
      console.error('Error picking document:', error);
      alert('Error al seleccionar el documento');
    }
  };

  const renderAttachmentsModal = () => (
    <Portal>
      <Modal
        visible={showAttachments}
        onDismiss={() => setShowAttachments(false)}
        contentContainerStyle={styles.modalContainer}
      >
        <View style={styles.attachmentOptions}>
          <IconButton
            icon="image"
            size={32}
            mode="contained"
            containerColor="#25D366"
            iconColor="#fff"
            onPress={handleImagePick}
            style={styles.attachmentButton}
          />
          <IconButton
            icon="file-document"
            size={32}
            mode="contained"
            containerColor="#25D366"
            iconColor="#fff"
            onPress={handleDocumentPick}
            style={styles.attachmentButton}
          />
        </View>
      </Modal>
    </Portal>
  );

  if (!chat) return null;

  return (
    <View style={styles.container}>
      <ChatRoomHeader
        chat={chat}
        onBackPress={handleBackPress}
        onInfoPress={handleInfoPress}
      />
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.content}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 90 : 0}
      >
        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messageList}
          inverted
          ListFooterComponent={renderTypingIndicator}
          onViewableItemsChanged={handleViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
        />
        <View style={styles.inputContainer}>
          <IconButton
            icon="attachment"
            size={24}
            iconColor="#666"
            onPress={() => setShowAttachments(true)}
            style={styles.attachButton}
          />
          <TextInput
            mode="outlined"
            value={message}
            onChangeText={(text) => {
              setMessage(text);
              simulateTypingIndicator();
            }}
            placeholder="Escribe un mensaje..."
            style={styles.input}
            outlineColor="#e0e0e0"
            activeOutlineColor="#25D366"
            multiline
          />
          <IconButton
            icon="send"
            size={24}
            iconColor="#fff"
            style={styles.sendButton}
            onPress={handleSend}
            disabled={!message.trim()}
          />
        </View>
      </KeyboardAvoidingView>
      {renderAttachmentsModal()}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  content: {
    flex: 1,
  },
  messageList: {
    flex: 1,
    padding: 16,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
  },
  input: {
    flex: 1,
    marginHorizontal: 8,
    backgroundColor: '#fff',
  },
  sendButton: {
    backgroundColor: '#25D366',
    margin: 0,
  },
  typingContainer: {
    padding: 8,
    marginBottom: 8,
  },
  typingText: {
    color: '#666',
    fontSize: 14,
    fontStyle: 'italic',
  },
  attachmentButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: 'white',
    padding: 20,
    margin: 20,
    borderRadius: 16,
  },
  attachmentOptions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  attachmentButton: {
    margin: 10,
  },
  attachButton: {
    margin: 0,
  },
});

export default ChatRoomScreen;