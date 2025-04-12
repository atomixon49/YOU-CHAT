import React from 'react';
import { View, StyleSheet, Text, Image } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import UserService from '../services/UserService';

export const QRCodeDisplay = () => {
  const user = UserService.getCurrentUser();
  
  if (!user) {
    return (
      <View style={styles.container}>
        <Text>No hay información de usuario disponible</Text>
      </View>
    );
  }

  const qrData = JSON.stringify({
    id: user.id,
    name: user.name,
    type: 'contact'
  });

  return (
    <View style={styles.container}>
      <View style={styles.profileSection}>
        <Image source={{ uri: user.avatar }} style={styles.avatar} />
        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.region}>{user.region}</Text>
      </View>
      
      <View style={styles.qrContainer}>
        <QRCode
          value={qrData}
          size={200}
          color="#000"
          backgroundColor="#fff"
        />
      </View>
      
      <Text style={styles.instruction}>
        Escanea este código QR para agregarme como contacto
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 20,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  region: {
    fontSize: 14,
    color: '#666',
  },
  qrContainer: {
    padding: 20,
    backgroundColor: '#fff',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    marginBottom: 20,
  },
  instruction: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});

export default QRCodeDisplay;