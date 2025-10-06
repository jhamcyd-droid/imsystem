import { createClient } from '@supabase/supabase-js'

// your real Supabase credentials here
const supabaseUrl = 'https://lchgddzyhkduutdkqlhr.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaGdkZHp5aGtkdXV0ZGtxbGhyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkyNjI1OTYsImV4cCI6MjA3NDgzODU5Nn0.gxYcQwA_qPoEY0lwxS72t4jVixv-qnEJvW_eUCelQwQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
