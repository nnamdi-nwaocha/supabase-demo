import { Injectable } from '@nestjs/common';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Database } from './supabase.types'; // Adjust the path as necessary

@Injectable()
export class SupabaseService {
    private supabase: SupabaseClient<Database>;

    constructor() {
        const supabaseUrl = process.env.SUPABASE_URL;
        const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Supabase URL and Anon Key are required.');
        }

        this.supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);
    }

    getClient(): SupabaseClient<Database> {
        return this.supabase;
    }
}
