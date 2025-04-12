import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView } from 'react-native';
import { Dialog, Portal, TextInput, Button, Checkbox, List, Avatar } from 'react-native-paper';
import ContactsService, { Contact } from '../services/ContactsService';

interface CreateGroupDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onCreateGroup: (name: string, participants: string[]) => void;
}

export const CreateGroupDialog: React.FC<CreateGroupDialogProps> = ({
  visible,
  onDismiss,
  onCreateGroup,
}) => {
  const [groupName, setGroupName] = useState('');
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [selectedContacts, setSelectedContacts] = useState<Set<string>>(new Set());

  useEffect(() => {
    loadContacts();
  }, []);

  const loadContacts = async () => {
    try {
      await ContactsService.initialize();
      const contactsList = await ContactsService.getAllContacts();
      setContacts(contactsList);
    } catch (error) {
      console.error('Error loading contacts:', error);
    }
  };

  const toggleContact = (contactId: string) => {
    const newSelected = new Set(selectedContacts);
    if (newSelected.has(contactId)) {
      newSelected.delete(contactId);
    } else {
      newSelected.add(contactId);
    }
    setSelectedContacts(newSelected);
  };

  const handleCreate = () => {
    if (groupName.trim() && selectedContacts.size > 0) {
      onCreateGroup(groupName.trim(), Array.from(selectedContacts));
      setGroupName('');
      setSelectedContacts(new Set());
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss} style={styles.dialog}>
        <Dialog.Title>Crear grupo</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Nombre del grupo"
            value={groupName}
            onChangeText={setGroupName}
            mode="outlined"
            style={styles.input}
          />
          <ScrollView style={styles.contactsList}>
            {contacts.map(contact => (
              <List.Item
                key={contact.id}
                title={contact.name}
                description={contact.status}
                left={props => (
                  <View style={styles.checkboxContainer}>
                    <Checkbox
                      status={selectedContacts.has(contact.id) ? 'checked' : 'unchecked'}
                      onPress={() => toggleContact(contact.id)}
                    />
                  </View>
                )}
                right={props => (
                  <Avatar.Image
                    size={40}
                    source={{ uri: contact.avatar }}
                    style={styles.avatar}
                  />
                )}
                onPress={() => toggleContact(contact.id)}
                style={styles.contactItem}
              />
            ))}
          </ScrollView>
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button
            onPress={handleCreate}
            disabled={!groupName.trim() || selectedContacts.size === 0}
          >
            Crear
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  dialog: {
    maxHeight: '80%',
  },
  input: {
    marginBottom: 16,
  },
  contactsList: {
    maxHeight: 300,
  },
  contactItem: {
    paddingLeft: 0,
  },
  checkboxContainer: {
    justifyContent: 'center',
  },
  avatar: {
    marginRight: 8,
  },
});

export default CreateGroupDialog;