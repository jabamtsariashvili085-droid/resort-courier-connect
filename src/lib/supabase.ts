import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://zopvvhzvlavhzhjtcxgp.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpvcHZ2aHp2bGF2aHpoanRjeGdwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEyMDY5MzIsImV4cCI6MjA4Njc4MjkzMn0.GFW7Xcc9hYmqXXXFIPFoJBHiiccU0qvDoy4Cy-oPsUw';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
