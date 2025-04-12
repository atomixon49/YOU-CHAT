import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { BarCodeScanner } from 'expo-barcode-scanner';
import { Button } from 'react-native-paper';

interface QRScannerProps {
  onScanned: (data: string) => void;
  onClose: () => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScanned, onClose }) => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);

  useEffect(() => {
    const getBarCodeScannerPermissions = async () => {
      const { status } = await BarCodeScanner.requestPermissionsAsync();
      setHasPermission(status === 'granted');
    };

    getBarCodeScannerPermissions();
  }, []);

  const handleBarCodeScanned = ({ data }: { data: string }) => {
    onScanned(data);
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Solicitando permiso de cámara...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>Sin acceso a la cámara</Text>
        <Button mode="contained" onPress={onClose} style={styles.button}>
          Cerrar
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <BarCodeScanner
        onBarCodeScanned={handleBarCodeScanned}
        style={StyleSheet.absoluteFillObject}
      />
      <Button 
        mode="contained" 
        onPress={onClose}
        style={styles.closeButton}
      >
        Cancelar
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    marginTop: 16,
  },
  closeButton: {
    position: 'absolute',
    bottom: 32,
    width: '80%',
    backgroundColor: '#25D366',
  },
});

export default QRScanner;