import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';
import type { Database } from '@pixio/database/types';
import { ENV } from './env';

/**
 * Supabase client for React Native. Sessions persist in AsyncStorage and
 * refresh automatically. RLS applies, so the app can read its own rows
 * (media, credits, subscriptions) directly.
 */
export const supabase = createClient<Database>(ENV.supabaseUrl, ENV.supabaseAnonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
