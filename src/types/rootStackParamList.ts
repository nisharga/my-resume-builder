import { NativeStackScreenProps } from '@react-navigation/native-stack';

// 1. Define your routes and their params
export type RootStackParamList = {
  Login: undefined;
  Home: { userId: string }; // Example with params
  Register: undefined;
  Notifications: undefined;
  TrackOrder: undefined;
  Vouchers: undefined;
  LiveChat: undefined;
  WebView: { url: string; title: string };
};

// 2. Define the props type for the Login screen
export type LoginProps = NativeStackScreenProps<RootStackParamList, 'Login'>;
export type WebViewProps = NativeStackScreenProps<RootStackParamList, 'WebView'>;