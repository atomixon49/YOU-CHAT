import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import { Chat, Message } from './ChatService';
import UserService from './UserService';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  private static instance: NotificationService;
  private notificationListener: any;
  private responseListener: any;

  private constructor() {}

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  async initialize(): Promise<void> {
    await this.requestPermissions();
    this.setupNotificationListeners();
  }

  private async requestPermissions(): Promise<boolean> {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }

    if (finalStatus !== 'granted') {
      console.log('Failed to get push token for push notification!');
      return false;
    }

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#25D366',
      });
    }

    return true;
  }

  private setupNotificationListeners(): void {
    this.notificationListener = Notifications.addNotificationReceivedListener(
      notification => {
        console.log('Notification received:', notification);
      }
    );

    this.responseListener = Notifications.addNotificationResponseReceivedListener(
      response => {
        console.log('Notification response:', response);
        // Aquí manejaremos la navegación cuando el usuario toque la notificación
      }
    );
  }

  async showNotification(chat: Chat, message: Message): Promise<void> {
    const currentUser = UserService.getCurrentUser();
    if (message.senderId === currentUser?.id) {
      return; // No mostrar notificaciones para mensajes propios
    }

    const title = chat.isGroup ? (chat.groupName || 'Grupo') : 'Nuevo mensaje';
    const body = message.text;

    await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: { chatId: chat.id },
      },
      trigger: null, // Mostrar inmediatamente
    });
  }

  removeNotificationListeners(): void {
    if (this.notificationListener) {
      this.notificationListener.remove();
    }
    if (this.responseListener) {
      this.responseListener.remove();
    }
  }

  async getBadgeCount(): Promise<number> {
    return await Notifications.getBadgeCountAsync();
  }

  async setBadgeCount(count: number): Promise<void> {
    await Notifications.setBadgeCountAsync(count);
  }
}

export default NotificationService.getInstance();