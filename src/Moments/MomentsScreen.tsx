import React from 'react';
import { View, FlatList, StyleSheet, Image, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { FAB } from 'react-native-paper';

const { width } = Dimensions.get('window');
const STORY_SIZE = 70;

// Datos de ejemplo para las historias
const mockStories = [
  { id: '1', avatar: 'https://i.pravatar.cc/150?img=4', name: 'Tu historia', isYours: true },
  { id: '2', avatar: 'https://i.pravatar.cc/150?img=5', name: 'Ana', hasNewStory: true },
  { id: '3', avatar: 'https://i.pravatar.cc/150?img=6', name: 'Pedro', hasNewStory: true },
  { id: '4', avatar: 'https://i.pravatar.cc/150?img=7', name: 'Laura' },
];

// Datos de ejemplo para los momentos
const mockMoments = [
  { 
    id: '1', 
    user: 'María López',
    avatar: 'https://i.pravatar.cc/150?img=8',
    image: 'https://picsum.photos/500/700',
    description: '¡Disfrutando de un hermoso día! ☀️',
    likes: 24,
    comments: 5,
  },
  {
    id: '2',
    user: 'Juan Carlos',
    avatar: 'https://i.pravatar.cc/150?img=9',
    image: 'https://picsum.photos/500/701',
    description: 'Nueva aventura 🌎✈️',
    likes: 45,
    comments: 12,
  },
];

const StoryItem = ({ avatar, name, hasNewStory, isYours }) => (
  <TouchableOpacity style={styles.storyContainer}>
    <View style={[styles.storyRing, hasNewStory && styles.activeStoryRing]}>
      <Image source={{ uri: avatar }} style={styles.storyAvatar} />
    </View>
    <Text style={styles.storyName} numberOfLines={1}>{name}</Text>
  </TouchableOpacity>
);

const MomentCard = ({ moment }) => (
  <View style={styles.momentCard}>
    <View style={styles.momentHeader}>
      <Image source={{ uri: moment.avatar }} style={styles.momentAvatar} />
      <Text style={styles.momentUser}>{moment.user}</Text>
    </View>
    <Image 
      source={{ uri: moment.image }} 
      style={styles.momentImage}
      resizeMode="cover"
    />
    <View style={styles.momentFooter}>
      <Text style={styles.momentDescription}>{moment.description}</Text>
      <View style={styles.momentStats}>
        <Text style={styles.momentStat}>{moment.likes} Me gusta</Text>
        <Text style={styles.momentStat}>{moment.comments} Comentarios</Text>
      </View>
    </View>
  </View>
);

export const MomentsScreen = () => {
  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.storiesSection}>
          <FlatList
            data={mockStories}
            renderItem={({ item }) => (
              <StoryItem
                avatar={item.avatar}
                name={item.name}
                hasNewStory={item.hasNewStory}
                isYours={item.isYours}
              />
            )}
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.storiesList}
            keyExtractor={(item) => item.id}
          />
        </View>
        <View style={styles.momentsSection}>
          {mockMoments.map((moment) => (
            <MomentCard key={moment.id} moment={moment} />
          ))}
        </View>
      </ScrollView>
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => console.log('Nuevo momento')}
        color="#fff"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  storiesSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingVertical: 10,
  },
  storiesList: {
    paddingHorizontal: 10,
  },
  storyContainer: {
    alignItems: 'center',
    marginHorizontal: 8,
    width: STORY_SIZE,
  },
  storyRing: {
    width: STORY_SIZE,
    height: STORY_SIZE,
    borderRadius: STORY_SIZE / 2,
    borderWidth: 2,
    borderColor: '#e0e0e0',
    padding: 2,
  },
  activeStoryRing: {
    borderColor: '#25D366',
  },
  storyAvatar: {
    width: '100%',
    height: '100%',
    borderRadius: STORY_SIZE / 2,
  },
  storyName: {
    fontSize: 12,
    marginTop: 4,
    textAlign: 'center',
    color: '#666',
  },
  momentsSection: {
    paddingTop: 10,
  },
  momentCard: {
    marginBottom: 15,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  momentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  momentAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  momentUser: {
    fontSize: 16,
    fontWeight: '500',
  },
  momentImage: {
    width: width,
    height: width * 1.2,
  },
  momentFooter: {
    padding: 15,
  },
  momentDescription: {
    fontSize: 14,
    marginBottom: 10,
  },
  momentStats: {
    flexDirection: 'row',
  },
  momentStat: {
    marginRight: 15,
    color: '#666',
    fontSize: 12,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 16,
    backgroundColor: '#25D366',
  },
});

export default MomentsScreen;