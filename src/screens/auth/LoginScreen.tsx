import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Image,
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

type LoginScreenNavigationProp = StackNavigationProp<AuthStackParamList, 'Login'>;

export const LoginScreen = () => {
  const [phone, setPhone] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState(1);

  const navigation = useNavigation<LoginScreenNavigationProp>();

  const handleRequestCode = async () => {
    if (!phone.trim()) {
      Alert.alert('Error', 'Por favor, ingresa tu número de teléfono');
      return;
    }

    try {
      setIsLoading(true);
      await UserService.startPhoneVerification(phone);
      setStep(2);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al enviar el código');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogin = async () => {
    if (!verificationCode.trim()) {
      Alert.alert('Error', 'Por favor, ingresa el código de verificación');
      return;
    }

    try {
      setIsLoading(true);
      await UserService.login(phone, verificationCode);
      // La navegación a la app principal se manejará en el RootNavigator
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Error al iniciar sesión');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Image
            source={require('../../../assets/icon.png')}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.title}>LatamChat</Text>

          {step === 1 ? (
            <>
              <TextInput
                label="Número de teléfono"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
                mode="outlined"
                style={styles.input}
                placeholder="+51 987654321"
              />
              <Button
                mode="contained"
                onPress={handleRequestCode}
                loading={isLoading}
                style={styles.button}
              >
                Solicitar código
              </Button>
            </>
          ) : (
            <>
              <Text style={styles.description}>
                Hemos enviado un código de verificación a {phone}
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
                onPress={handleLogin}
                loading={isLoading}
                style={styles.button}
              >
                Iniciar sesión
              </Button>
              <Button
                mode="text"
                onPress={() => setStep(1)}
                style={styles.button}
              >
                Cambiar número
              </Button>
            </>
          )}

          <View style={styles.footer}>
            <Text>¿No tienes una cuenta? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Register')}>
              <Text style={styles.link}>Regístrate</Text>
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
  logo: {
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 30,
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

export default LoginScreen;