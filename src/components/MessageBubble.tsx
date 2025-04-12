import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Dimensions } from 'react-native';
import { IconButton } from 'react-native-paper';
import * as Sharing from 'expo-sharing';
import { MediaContent } from '../services/ChatService';

interface MessageBubbleProps {
  text: string;
  timestamp: string;
  isSent: boolean;
  status?: 'sent' | 'delivered' | 'read';
  media?: MediaContent;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  timestamp,
  isSent,
  status = 'sent',
  media,
}) => {
  const screenWidth = Dimensions.get('window').width;
  const maxImageWidth = screenWidth * 0.6;

  const handleMediaPress = async () => {
    if (!media) return;

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      if (isAvailable) {
        await Sharing.shareAsync(media.uri);
      }
    } catch (error) {
      console.error('Error sharing media:', error);
    }
  };

  const renderMedia = () => {
    if (!media) return null;

    if (media.type.startsWith('image/')) {
      return (
        <TouchableOpacity onPress={handleMediaPress}>
          <Image
            source={{ uri: media.uri }}
            style={[styles.mediaImage, { maxWidth: maxImageWidth }]}
            resizeMode="contain"
          />
        </TouchableOpacity>
      );
    }

    return (
      <TouchableOpacity 
        style={styles.documentContainer}
        onPress={handleMediaPress}
      >
        <IconButton
          icon="file-document-outline"
          size={24}
          iconColor="#666"
        />
        <View style={styles.documentInfo}>
          <Text style={styles.documentName} numberOfLines={1}>
            {media.name}
          </Text>
          <Text style={styles.documentSize}>
            {(media.size / 1024).toFixed(1)} KB
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderStatusIcon = () => {
    if (!isSent) return null;

    let iconName: string;
    let iconColor: string;

    switch (status) {
      case 'read':
        iconName = 'check-all';
        iconColor = '#34B7F1';
        break;
      case 'delivered':
        iconName = 'check-all';
        iconColor = '#8E8E8E';
        break;
      case 'sent':
      default:
        iconName = 'check';
        iconColor = '#8E8E8E';
        break;
    }

    return (
      <IconButton
        icon={iconName}
        size={16}
        iconColor={iconColor}
        style={styles.statusIcon}
      />
    );
  };

  return (
    <View style={[styles.container, isSent ? styles.sent : styles.received]}>
      <View
        style={[
          styles.bubble,
          isSent ? styles.sentBubble : styles.receivedBubble,
          media && styles.mediaBubble,
        ]}
      >
        {renderMedia()}
        {text && <Text style={styles.text}>{text}</Text>}
        <View style={styles.metaContainer}>
          <Text style={styles.timestamp}>{timestamp}</Text>
          {renderStatusIcon()}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 4,
    maxWidth: '80%',
  },
  sent: {
    alignSelf: 'flex-end',
  },
  received: {
    alignSelf: 'flex-start',
  },
  bubble: {
    borderRadius: 16,
    padding: 12,
    minWidth: 80,
  },
  sentBubble: {
    backgroundColor: '#DCF8C6',
  },
  receivedBubble: {
    backgroundColor: '#fff',
  },
  mediaBubble: {
    padding: 8,
  },
  text: {
    fontSize: 16,
    color: '#000',
    marginTop: 8,
  },
  metaContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    marginTop: 4,
  },
  timestamp: {
    fontSize: 12,
    color: '#8E8E8E',
    marginRight: 4,
  },
  statusIcon: {
    margin: 0,
    padding: 0,
    width: 16,
    height: 16,
  },
  mediaImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  documentContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    padding: 8,
  },
  documentInfo: {
    flex: 1,
    marginLeft: 8,
  },
  documentName: {
    fontSize: 14,
    color: '#000',
    fontWeight: '500',
  },
  documentSize: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
});

export default MessageBubble;