import { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN } from '../config/env';

class SMSService {
  private static instance: SMSService;
  private authHeader: string;

  private constructor() {
    // Crear el header de autorización en Base64 usando btoa (disponible en React Native)
    this.authHeader = btoa(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`);
  }

  static getInstance(): SMSService {
    if (!SMSService.instance) {
      SMSService.instance = new SMSService();
    }
    return SMSService.instance;
  }

  async sendVerificationCode(phoneNumber: string): Promise<string> {
    try {
      const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();
      
      const response = await fetch(
        `https://api.twilio.com/2010-04-01/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
        {
          method: 'POST',
          headers: {
            'Authorization': `Basic ${this.authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: new URLSearchParams({
            To: phoneNumber,
            Body: `Tu código de verificación para LatamChat es: ${verificationCode}`,
            From: '+15005550006' // Número de prueba de Twilio
          }).toString()
        }
      );

      const data = await response.json();

      if (!response.ok) {
        if (data.code === 21211) {
          throw new Error('Número de teléfono no verificado. En modo de prueba, debes verificar los números en la consola de Twilio.');
        }
        throw new Error(data.message || 'Error al enviar SMS');
      }

      return verificationCode;
    } catch (error) {
      console.error('Error sending SMS:', error);
      throw error instanceof Error ? error : new Error('No se pudo enviar el código de verificación');
    }
  }
}

export default SMSService.getInstance();