import React from 'react';
import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { Avatar, Text } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { Chat } from '../services/ChatService';

interface ChatRoomHeaderProps {
  chat: Chat;
  onBackPress: () => void;
  onInfoPress: () => void;
}

export const ChatRoomHeader: React.FC<ChatRoomHeaderProps> = ({
  chat,
  onBackPress,
  onInfoPress,
}) => {
  const getTitle = () => {
    if (chat.isGroup) {
      return chat.groupName || 'Grupo';
    }
    // En una implementación real, obtendríamos el nombre del otro participante
    return `Chat ${chat.id}`;
  };

  const getSubtitle = () => {
    if (chat.isGroup) {
      return `${chat.participants.length} participantes`;
    }
    return 'En línea'; // En una implementación real, mostraríamos el estado real del usuario
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onBackPress} style={styles.backButton}>
        <Ionicons name="chevron-back" size={28} color="#fff" />
      </TouchableOpacity>

      <TouchableOpacity style={styles.infoContainer} onPress={onInfoPress}>
        <Avatar.Image
          size={40}
          source={{ uri: chat.isGroup ? (chat.groupAvatar || 'https://i.pravatar.cc/150') : 'https://i.pravatar.cc/150' }}
        />
        <View style={styles.textContainer}>
          <Text style={styles.title}>{getTitle()}</Text>
          <Text style={styles.subtitle}>{getSubtitle()}</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.actions}>
        {chat.isGroup && (
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="videocam" size={24} color="#fff" />
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="call" size={22} color="#fff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Ionicons name="ellipsis-vertical" size={22} color="#fff" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#25D366',
    paddingVertical: 8,
    paddingHorizontal: 8,
    height: 60,
  },
  backButton: {
    padding: 8,
  },
  infoContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 4,
  },
  textContainer: {
    marginLeft: 12,
    flex: 1,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    opacity: 0.9,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    padding: 8,
  },
});

export default ChatRoomHeader;