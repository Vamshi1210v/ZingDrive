import 'react-native-url-polyfill/auto';
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Replace with your actual Supabase credentials
// Usually these would come from an .env file
const SUPABASE_URL = 'https://gyparxaoqgdyvsfuqziq.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd5cGFyeGFvcWdkeXZzZnVxemlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzA0Mzg5ODksImV4cCI6MjA4NjAxNDk4OX0.vtbRt3eRCizXq138eDhHwWnOQd02F4tRLdk-mnheXOU';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    auth: {
        storage: AsyncStorage,
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: false,
    },
});
