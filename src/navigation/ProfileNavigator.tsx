import { createStackNavigator } from '@react-navigation/stack';
import ProfileScreen from '../Profile/ProfileScreen';
import EditProfileScreen from '../Profile/EditProfileScreen';

export type ProfileStackParamList = {
  Profile: undefined;
  EditProfile: undefined;
};

const Stack = createStackNavigator<ProfileStackParamList>();

export const ProfileNavigator = () => {
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
      <Stack.Screen name="Profile" component={ProfileScreen} options={{ title: 'Mi Perfil' }} />
      <Stack.Screen name="EditProfile" component={EditProfileScreen} options={{ title: 'Editar Perfil' }} />
    </Stack.Navigator>
  );
};