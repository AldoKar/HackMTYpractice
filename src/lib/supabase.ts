// filepath: src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://xernedqgdzpxisyzkncx.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inhlcm5lZHFnZHpweGlzeXprbmN4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjExNzI0NzQsImV4cCI6MjA3Njc0ODQ3NH0.fi6FX8K9_B0iIyEp7tVPGDBRQ--DcUk6lYTIaKtMGQo'  // Reemplaza con tu clave anónima

export const supabase = createClient(supabaseUrl, supabaseAnonKey)