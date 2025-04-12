// Importar variables de entorno del archivo .env
import { Platform } from 'react-native';

// En una aplicación real, usarías un paquete como react-native-dotenv
// para cargar las variables de entorno
export const SUPABASE_URL = process.env.SUPABASE_URL || '';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || '';
export const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
export const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';