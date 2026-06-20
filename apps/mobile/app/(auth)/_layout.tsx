import { Redirect, Stack } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { Loading } from '@/components/primitives';

export default function AuthLayout() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  if (user) return <Redirect href="/(tabs)" />;
  return <Stack screenOptions={{ headerShown: false }} />;
}
