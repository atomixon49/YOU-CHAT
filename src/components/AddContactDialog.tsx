import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { Dialog, Portal, TextInput, Button } from 'react-native-paper';

interface AddContactDialogProps {
  visible: boolean;
  onDismiss: () => void;
  onAdd: (phone: string) => void;
}

export const AddContactDialog: React.FC<AddContactDialogProps> = ({
  visible,
  onDismiss,
  onAdd,
}) => {
  const [phone, setPhone] = useState('');

  const handleAdd = () => {
    if (phone.trim()) {
      onAdd(phone.trim());
      setPhone('');
    }
  };

  return (
    <Portal>
      <Dialog visible={visible} onDismiss={onDismiss}>
        <Dialog.Title>Agregar Contacto</Dialog.Title>
        <Dialog.Content>
          <TextInput
            label="Número de teléfono"
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            mode="outlined"
            style={styles.input}
            placeholder="+51 987654321"
          />
        </Dialog.Content>
        <Dialog.Actions>
          <Button onPress={onDismiss}>Cancelar</Button>
          <Button onPress={handleAdd} disabled={!phone.trim()}>
            Agregar
          </Button>
        </Dialog.Actions>
      </Dialog>
    </Portal>
  );
};

const styles = StyleSheet.create({
  input: {
    marginTop: 8,
  },
});

export default AddContactDialog;