import { Controller, Post, Body } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Controller('auth')
export class AuthController {
    constructor(private readonly supabaseService: SupabaseService) { }

    @Post('signup')
    async signUp(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        const { error } = await this.supabaseService.getClient().auth.signUp({
            email,
            password,
        });

        if (error) {
            return { success: false, message: error.message };
        }

        return { success: true, message: 'User signed up successfully!' };
    }

    @Post('login')
    async login(@Body() body: { email: string; password: string }) {
        const { email, password } = body;
        const { data, error } = await this.supabaseService.getClient().auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            return { success: false, message: error.message };
        }

        return {
            success: true,
            accessToken: data.session?.access_token,
            refreshToken: data.session?.refresh_token,
        };
    }


    @Post('refresh-token')
    async refreshToken(@Body() body: { refreshToken: string }) {
        const { refreshToken } = body;
        const { data, error } = await this.supabaseService.getClient().auth.refreshSession({
            refresh_token: refreshToken,
        });

        if (error) {
            return { success: false, message: error.message };
        }

        return {
            success: true,
            accessToken: data.session?.access_token,
            refreshToken: data.session?.refresh_token,
        };
    }
}
