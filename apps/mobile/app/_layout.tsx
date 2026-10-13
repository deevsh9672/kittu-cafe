import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { SafeAreaProvider } from 'react-native-safe-area-context';

const queryClient = new QueryClient();

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <QueryClientProvider client={queryClient}>
        <StatusBar style="dark" />
        <Stack
          screenOptions={{
            headerStyle: { backgroundColor: '#FFFEFA' },
            headerTintColor: '#231709',
            headerTitleStyle: { fontWeight: 'bold' },
            contentStyle: { backgroundColor: '#FAF6F0' },
          }}
        >
          <Stack.Screen name="index" options={{ headerShown: false }} />
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="order/[id]" options={{ title: 'Track Live Order' }} />
          <Stack.Screen name="book-table" options={{ title: 'Reserve a Table' }} />
        </Stack>
      </QueryClientProvider>
    </SafeAreaProvider>
  );
}
