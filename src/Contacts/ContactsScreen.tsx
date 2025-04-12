import React, { useState, useEffect, useMemo } from 'react';
import { View, StyleSheet, Modal, Alert } from 'react-native';
import { Searchbar, FAB, Portal, Dialog, ActivityIndicator } from 'react-native-paper';
import ContactListItem from '../components/ContactListItem';
import QRScanner from '../components/QRScanner';
import QRCodeDisplay from '../components/QRCodeDisplay';
import AddContactDialog from '../components/AddContactDialog';
import ContactsService, { Contact } from '../services/ContactsService';
import UserService from '../services/UserService';

export const ContactsScreen = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [modalVisible, setModalVisible] = useState<'qr-scanner' | 'qr-display' | null>(null);
  const [showFABGroup, setShowFABGroup] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showAddDialog, setShowAddDialog] = useState(false);

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      await ContactsService.initialize();
      const contactsList = await ContactsService.getAllContacts();
      setContacts(contactsList);
    } catch (error) {
      Alert.alert('Error', 'No se pudieron cargar los contactos');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredContacts = useMemo(() => {
    if (!searchQuery) return contacts;
    return contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [contacts, searchQuery]);

  const handleContactPress = (contactId: string) => {
    // Implementaremos la navegación al perfil del contacto más adelante
    console.log('Contact pressed:', contactId);
  };

  const handleScanComplete = async (data: string) => {
    try {
      const contactData = JSON.parse(data);
      if (contactData.type === 'contact') {
        Alert.alert(
          'Nuevo Contacto',
          `¿Deseas agregar a ${contactData.name} como contacto?`,
          [
            {
              text: 'Cancelar',
              style: 'cancel',
              onPress: () => setModalVisible(null),
            },
            {
              text: 'Agregar',
              onPress: async () => {
                try {
                  await ContactsService.addContact({
                    id: contactData.id,
                    name: contactData.name,
                    avatar: contactData.avatar || 'https://i.pravatar.cc/150',
                    status: '¡Hola! Estoy usando LatamChat',
                  });
                  loadContacts(); // Recargar la lista de contactos
                  Alert.alert('Éxito', 'Contacto agregado correctamente');
                } catch (error) {
                  if (error instanceof Error) {
                    Alert.alert('Error', error.message);
                  } else {
                    Alert.alert('Error', 'No se pudo agregar el contacto');
                  }
                }
                setModalVisible(null);
              },
            },
          ]
        );
      } else {
        Alert.alert('Error', 'Código QR inválido');
        setModalVisible(null);
      }
    } catch (error) {
      Alert.alert('Error', 'No se pudo leer el código QR');
      setModalVisible(null);
    }
  };

  const handleAddContact = async (phone: string) => {
    try {
      // Simular búsqueda de usuario por teléfono
      // En una implementación real, esto se haría a través de una API
      const mockUser = {
        id: `user_${Date.now()}`,
        name: `Usuario ${phone}`,
        avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70)}`,
        status: '¡Hola! Estoy usando LatamChat',
        phone: phone,
      };

      await ContactsService.addContact(mockUser);
      await loadContacts();
      Alert.alert('Éxito', 'Contacto agregado correctamente');
    } catch (error) {
      if (error instanceof Error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert('Error', 'No se pudo agregar el contacto');
      }
    } finally {
      setShowAddDialog(false);
    }
  };

  const renderModal = () => {
    switch (modalVisible) {
      case 'qr-scanner':
        return (
          <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            onRequestClose={() => setModalVisible(null)}
          >
            <QRScanner
              onScanned={handleScanComplete}
              onClose={() => setModalVisible(null)}
            />
          </Modal>
        );
      case 'qr-display':
        return (
          <Modal
            animationType="slide"
            transparent={false}
            visible={true}
            onRequestClose={() => setModalVisible(null)}
          >
            <QRCodeDisplay />
          </Modal>
        );
      default:
        return null;
    }
  };

  if (isLoading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#25D366" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Searchbar
        placeholder="Buscar contactos"
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />
      <View style={styles.list}>
        {filteredContacts.map((contact) => (
          <ContactListItem
            key={contact.id}
            avatar={contact.avatar}
            name={contact.name}
            status={contact.status}
            onPress={() => handleContactPress(contact.id)}
          />
        ))}
      </View>

      <Portal>
        <FAB.Group
          open={showFABGroup}
          visible={true}
          icon={showFABGroup ? 'close' : 'plus'}
          actions={[
            {
              icon: 'qrcode-scan',
              label: 'Escanear QR',
              onPress: () => setModalVisible('qr-scanner'),
            },
            {
              icon: 'qrcode',
              label: 'Mi código QR',
              onPress: () => setModalVisible('qr-display'),
            },
            {
              icon: 'account-plus',
              label: 'Agregar contacto',
              onPress: () => setShowAddDialog(true),
            },
          ]}
          onStateChange={({ open }) => setShowFABGroup(open)}
          style={styles.fab}
        />
      </Portal>

      {renderModal()}

      <AddContactDialog
        visible={showAddDialog}
        onDismiss={() => setShowAddDialog(false)}
        onAdd={handleAddContact}
      />
    </View>
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
  searchBar: {
    margin: 16,
    borderRadius: 10,
    elevation: 2,
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

export default ContactsScreen;