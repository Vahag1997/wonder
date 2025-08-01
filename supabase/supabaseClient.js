import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://orvklxcroobcnwzgiank.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9ydmtseGNyb29iY253emdpYW5rIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI2NjE1MjksImV4cCI6MjA2ODIzNzUyOX0.-4XnBJbZ3Djf83dI_Dpm1ogwK25gB8cBCUkF8TOAy10'
export const supabase = createClient(supabaseUrl, supabaseAnonKey);