import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Image, TouchableOpacity, Alert, Text } from 'react-native';
import { TextInput, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import UserService, { User } from '../services/UserService';

export const EditProfileScreen = () => {
  const [userData, setUserData] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [status, setStatus] = useState('');
  const [region, setRegion] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const user = UserService.getCurrentUser();
    if (user) {
      setUserData(user);
      setName(user.name);
      setStatus(user.status);
      setRegion(user.region);
    }
  };

  const handleSelectImage = async () => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Se necesita permiso para acceder a la galería');
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.5,
      });

      if (!result.canceled) {
        // En una implementación real, aquí subiríamos la imagen a un servidor
        // y obtendríamos la URL. Por ahora, simularemos esto.
        const mockImageUrl = `https://i.pravatar.cc/300?img=${Math.floor(Math.random() * 70)}`;
        if (userData) {
          await UserService.updateProfile({ ...userData, avatar: mockImageUrl });
          loadUserData();
        }
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo seleccionar la imagen');
    }
  };

  const handleSave = async () => {
    if (!userData) return;

    try {
      setIsLoading(true);
      await UserService.updateProfile({
        ...userData,
        name,
        status,
        region,
      });
      Alert.alert('Éxito', 'Perfil actualizado correctamente');
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el perfil');
    } finally {
      setIsLoading(false);
    }
  };

  if (!userData) {
    return null;
  }

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.avatarContainer} onPress={handleSelectImage}>
        <Image source={{ uri: userData.avatar }} style={styles.avatar} />
        <View style={styles.editOverlay}>
          <Text style={styles.editText}>Cambiar foto</Text>
        </View>
      </TouchableOpacity>

      <View style={styles.form}>
        <TextInput
          label="Nombre"
          value={name}
          onChangeText={setName}
          mode="outlined"
          style={styles.input}
        />
        <TextInput
          label="Estado"
          value={status}
          onChangeText={setStatus}
          mode="outlined"
          style={styles.input}
          placeholder="¿Qué estás pensando?"
        />
        <TextInput
          label="Región"
          value={region}
          onChangeText={setRegion}
          mode="outlined"
          style={styles.input}
        />

        <Button
          mode="contained"
          onPress={handleSave}
          loading={isLoading}
          style={styles.saveButton}
        >
          Guardar Cambios
        </Button>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  avatarContainer: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 30,
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
  },
  editOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    alignItems: 'center',
  },
  editText: {
    color: '#fff',
    fontSize: 14,
  },
  form: {
    padding: 16,
  },
  input: {
    marginBottom: 16,
  },
  saveButton: {
    marginTop: 16,
    backgroundColor: '#25D366',
  },
});

export default EditProfileScreen;