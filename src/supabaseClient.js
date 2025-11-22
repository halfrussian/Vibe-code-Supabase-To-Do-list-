// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// your Supabase URL (fixed)
const SUPABASE_URL = '';

// 👉 PASTE YOUR PUBLISHABLE KEY BELOW (the one starting with sb_publishable_...)
const SUPABASE_ANON_KEY = '';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
