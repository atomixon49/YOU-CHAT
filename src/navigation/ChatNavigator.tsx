import { createStackNavigator } from '@react-navigation/stack';
import ChatsScreen from '../Chats/ChatsScreen';
import ChatRoomScreen from '../Chats/ChatRoomScreen';

export type ChatStackParamList = {
  ChatsList: undefined;
  ChatRoom: {
    chatId: string;
    title: string;
  };
};

const Stack = createStackNavigator<ChatStackParamList>();

export const ChatNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerStyle: {
          backgroundColor: '#25D366',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}
    >
      <Stack.Screen name="ChatsList" component={ChatsScreen} options={{ title: 'Chats' }} />
      <Stack.Screen
        name="ChatRoom"
        component={ChatRoomScreen}
        options={({ route }) => ({
          title: route.params.title,
        })}
      />
    </Stack.Navigator>
  );
};