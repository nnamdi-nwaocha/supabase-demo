import { Body, Controller, Get, Headers, HttpException, HttpStatus, Post } from '@nestjs/common';
import { SupabaseService } from 'src/supabase/supabase.service';

@Controller('profile')
export class ProfileController {
    constructor(private readonly supabaseService: SupabaseService) { }

    private async validateToken(token: string) {
        if (!token) {
            throw new HttpException('Authorization header is missing', HttpStatus.UNAUTHORIZED);
        }

        const cleanToken = token.replace('Bearer ', '').trim();
        const { data: user, error } = await this.supabaseService.getClient().auth.getUser(cleanToken);

        if (error || !user || !user.user?.id) {
            throw new HttpException(
                error?.message || 'Invalid or expired token',
                HttpStatus.UNAUTHORIZED,
            );
        }

        return user.user.id;
    }

    @Post()
    async setFullName(
        @Headers('Authorization') token: string,
        @Body() payload: { full_name: string },
    ) {
        const userId = await this.validateToken(token);

        const { error: upsertError } = await this.supabaseService
            .getClient()
            .from('profile')
            .upsert({ user_id: userId, full_name: payload.full_name }, { onConflict: 'user_id' });

        if (upsertError) {
            throw new HttpException(upsertError.message, HttpStatus.BAD_REQUEST);
        }

        return { success: true, full_name: payload.full_name };
    }

    @Get()
    async getProfile(@Headers('Authorization') token: string) {
        const userId = await this.validateToken(token);

        const { data: profile, error: profileError } = await this.supabaseService
            .getClient()
            .from('profile')
            .select('*')
            .eq('user_id', userId)
            .single();

        if (profileError) {
            throw new HttpException(profileError.message, HttpStatus.BAD_REQUEST);
        }

        return { success: true, data: profile };
    }
}