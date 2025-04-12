import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { List, Text, Avatar, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import UserService, { User } from '../services/UserService';
import { ProfileStackParamList } from '../navigation/ProfileNavigator';

type ProfileScreenNavigationProp = StackNavigationProp<ProfileStackParamList, 'Profile'>;

export const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = () => {
    const userData = UserService.getCurrentUser();
    setUser(userData);
  };

  const handleEditProfile = () => {
    navigation.navigate('EditProfile');
  };

  const handleQRCode = () => {
    // Implementaremos el código QR más adelante
    console.log('Show QR Code');
  };

  const handleLogout = async () => {
    Alert.alert(
      'Cerrar Sesión',
      '¿Estás seguro que deseas cerrar sesión?',
      [
        {
          text: 'Cancelar',
          style: 'cancel',
        },
        {
          text: 'Sí, cerrar sesión',
          style: 'destructive',
          onPress: async () => {
            try {
              await UserService.logout();
              // Aquí implementaremos la navegación a la pantalla de login
              console.log('Logged out successfully');
            } catch (error) {
              Alert.alert('Error', 'No se pudo cerrar sesión. Intenta nuevamente.');
            }
          },
        },
      ],
      { cancelable: true }
    );
  };

  if (!user) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <Text>Cargando...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Cabecera del perfil */}
      <TouchableOpacity style={styles.header} onPress={handleEditProfile}>
        <Avatar.Image size={80} source={{ uri: user.avatar }} />
        <View style={styles.userInfo}>
          <Text style={styles.userName}>{user.name}</Text>
          <Text style={styles.userStatus}>{user.status}</Text>
          <Text style={styles.userId}>ID: {user.id}</Text>
        </View>
        <Ionicons name="chevron-forward" size={24} color="#666" />
      </TouchableOpacity>

      {/* Código QR */}
      <TouchableOpacity style={styles.qrButton} onPress={handleQRCode}>
        <Ionicons name="qr-code" size={24} color="#25D366" />
        <Text style={styles.qrText}>Mi código QR</Text>
      </TouchableOpacity>

      <Divider />

      {/* Lista de opciones */}
      <List.Section>
        <List.Item
          title="Información Personal"
          description={user.phone}
          left={props => <List.Icon {...props} icon="account" color="#25D366" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
          onPress={handleEditProfile}
        />
        <List.Item
          title="Privacidad"
          left={props => <List.Icon {...props} icon="shield-account" color="#25D366" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Notificaciones"
          left={props => <List.Icon {...props} icon="bell" color="#25D366" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Almacenamiento y Datos"
          description={user.region}
          left={props => <List.Icon {...props} icon="folder" color="#25D366" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Ayuda"
          left={props => <List.Icon {...props} icon="help-circle" color="#25D366" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
        <List.Item
          title="Acerca de"
          left={props => <List.Icon {...props} icon="information" color="#25D366" />}
          right={props => <List.Icon {...props} icon="chevron-right" />}
        />
      </List.Section>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutText}>Cerrar Sesión</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  centerContent: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
  },
  userInfo: {
    flex: 1,
    marginLeft: 15,
  },
  userName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  userStatus: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  userId: {
    fontSize: 12,
    color: '#999',
  },
  qrButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#f8f8f8',
  },
  qrText: {
    marginLeft: 10,
    fontSize: 16,
    color: '#25D366',
  },
  footer: {
    padding: 20,
    alignItems: 'center',
  },
  logoutButton: {
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    backgroundColor: '#ff4444',
  },
  logoutText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default ProfileScreen;