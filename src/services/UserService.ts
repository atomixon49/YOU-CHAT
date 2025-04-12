import AsyncStorage from '@react-native-async-storage/async-storage';
import SupabaseService from './SupabaseService';
import SMSService from './SMSService';

export interface User {
  id: string;
  name: string;
  avatar: string;
  status: string;
  phone: string;
  region: string;
}

class UserService {
  private static readonly USER_STORAGE_KEY = '@user_data';
  private static readonly VERIFICATION_CODE_KEY = '@verification_code';
  private static instance: UserService;
  private currentUser: User | null = null;
  private supabase = SupabaseService.getClient();

  private constructor() {}

  static getInstance(): UserService {
    if (!UserService.instance) {
      UserService.instance = new UserService();
    }
    return UserService.instance;
  }

  async initialize(): Promise<void> {
    try {
      const session = await this.supabase.auth.getSession();
      if (session.data.session) {
        const { data: userData } = await this.supabase
          .from('users')
          .select('*')
          .eq('id', session.data.session.user.id)
          .single();
        
        if (userData) {
          this.currentUser = userData;
          await AsyncStorage.setItem(UserService.USER_STORAGE_KEY, JSON.stringify(userData));
        }
      }
    } catch (error) {
      console.error('Error initializing user service:', error);
    }
  }

  async startPhoneVerification(phone: string): Promise<void> {
    try {
      const verificationCode = await SMSService.sendVerificationCode(phone);
      await AsyncStorage.setItem(UserService.VERIFICATION_CODE_KEY, JSON.stringify({
        code: verificationCode,
        phone: phone,
        timestamp: Date.now()
      }));
    } catch (error) {
      console.error('Error starting phone verification:', error);
      throw new Error('No se pudo iniciar la verificación del teléfono');
    }
  }

  async verifyPhoneAndRegister(code: string, userData: Omit<User, 'id'>): Promise<User> {
    try {
      const storedVerification = await AsyncStorage.getItem(UserService.VERIFICATION_CODE_KEY);
      if (!storedVerification) {
        throw new Error('No hay un código de verificación pendiente');
      }

      const { code: storedCode, phone, timestamp } = JSON.parse(storedVerification);
      
      // Verificar si el código ha expirado (15 minutos)
      if (Date.now() - timestamp > 15 * 60 * 1000) {
        throw new Error('El código de verificación ha expirado');
      }

      if (code !== storedCode) {
        throw new Error('Código de verificación incorrecto');
      }

      // Registrar usuario en Supabase
      const { data: authData, error: authError } = await this.supabase.auth.signUp({
        phone,
        password: code // Usar el código como contraseña temporal
      });

      if (authError) throw authError;

      // Crear perfil de usuario
      const { data: newUser, error: profileError } = await this.supabase
        .from('users')
        .insert([{ ...userData, id: authData.user!.id }])
        .select()
        .single();

      if (profileError) throw profileError;

      this.currentUser = newUser;
      await AsyncStorage.setItem(UserService.USER_STORAGE_KEY, JSON.stringify(newUser));
      await AsyncStorage.removeItem(UserService.VERIFICATION_CODE_KEY);

      return newUser;
    } catch (error) {
      console.error('Error in verification:', error);
      throw error;
    }
  }

  async login(phone: string, password: string): Promise<User> {
    try {
      const { data: { user }, error: authError } = await this.supabase.auth.signInWithPassword({
        phone,
        password
      });

      if (authError) throw authError;

      const { data: userData, error: profileError } = await this.supabase
        .from('users')
        .select('*')
        .eq('id', user!.id)
        .single();

      if (profileError) throw profileError;

      this.currentUser = userData;
      await AsyncStorage.setItem(UserService.USER_STORAGE_KEY, JSON.stringify(userData));
      return userData;
    } catch (error) {
      console.error('Error logging in:', error);
      throw error;
    }
  }

  async logout(): Promise<void> {
    try {
      await this.supabase.auth.signOut();
      await AsyncStorage.removeItem(UserService.USER_STORAGE_KEY);
      this.currentUser = null;
    } catch (error) {
      console.error('Error logging out:', error);
      throw error;
    }
  }

  async updateProfile(userData: Partial<User>): Promise<User> {
    if (!this.currentUser) {
      throw new Error('No user is logged in');
    }

    try {
      const { data: updatedUser, error } = await this.supabase
        .from('users')
        .update(userData)
        .eq('id', this.currentUser.id)
        .select()
        .single();

      if (error) throw error;

      this.currentUser = updatedUser;
      await AsyncStorage.setItem(UserService.USER_STORAGE_KEY, JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error('Error updating profile:', error);
      throw error;
    }
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }
}

export default UserService.getInstance();