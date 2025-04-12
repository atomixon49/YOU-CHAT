import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { TextInput, Text, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { AuthStackParamList } from '../../navigation/AuthNavigator';
import UserService from '../../services/UserService';

type RegisterScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Register'>;

export const RegisterScreen = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [region, setRegion] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const navigation = useNavigation<RegisterScreenNavigationProp>();

  const handleSendVerificationCode = async () => {
    if (!name.trim() || !phone.trim() || !region.trim()) {
      Alert.alert('Error', 'Por favor, completa todos los campos');
      return;
    }

    try {
      setIsLoading(true);
      await UserService.startPhoneVerification(phone);
      setStep(2);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al enviar el código de verificación');
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyAndRegister = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Por favor, ingresa el código de verificación');
      return;
    }

    try {
      setIsLoading(true);
      await UserService.verifyPhoneAndRegister(verificationCode, {
        name,
        phone,
        region,
        avatar: 'https://i.pravatar.cc/300', // Avatar por defecto
        status: '¡Hola! Estoy usando LatamChat', // Estado por defecto
      });
      // La navegación a la app principal se manejará en el RootNavigator
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al verificar el código');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Text style={styles.title}>
            {step === 1 ? 'Crear cuenta' : 'Verificar número'}
          </Text>

          {step === 1 ? (
            <>
              <TextInput
                label="Nombre completo"
                value={name}
                onChangeText={setName}
                mode="outlined"
                style={styles.input}
              />
              <TextInput
                label="Número de teléfono"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                mode="outlined"
                style={styles.input}
                placeholder="+51 987654321"
              />
              <TextInput
                label="Región"
                value={region}
                onChangeText={setRegion}
                mode="outlined"
                style={styles.input}
                placeholder="Lima, Perú"
              />
              <Button
                mode="contained"
                onPress={handleSendVerificationCode}
                loading={isLoading}
                style={styles.button}
              >
                Enviar código de verificación
              </Button>
            </>
          ) : (
            <>
              <Text style={styles.description}>
                Hemos enviado un código de verificación a tu número de teléfono.
              </Text>
              <TextInput
                label="Código de verificación"
                value={verificationCode}
                onChangeText={setVerificationCode}
                keyboardType="number-pad"
                mode="outlined"
                style={styles.input}
              />
              <Button
                mode="contained"
                onPress={handleVerifyAndRegister}
                loading={isLoading}
                style={styles.button}
              >
                Verificar y crear cuenta
              </Button>
              <Button
                mode="text"
                onPress={() => setStep(1)}
                style={styles.button}
              >
                Volver
              </Button>
            </>
          )}

          <View style={styles.footer}>
            <Text>¿Ya tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.link}>Inicia sesión</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    flexGrow: 1,
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  description: {
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    marginBottom: 12,
  },
  button: {
    marginTop: 8,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 20,
  },
  link: {
    color: '#2196F3',
  },
});

export default RegisterScreen;