import { Redirect } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { Loading } from '@/components/ui';

export default function Index() {
  const { user, loading } = useAuth();
  if (loading) return <Loading />;
  return <Redirect href={user ? '/(tabs)' : '/(auth)/login'} />;
}
