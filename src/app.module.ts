import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ProfileController } from './profile/profile.controller';
import { AuthController } from './auth/auth.controller';
import { SupabaseService } from './supabase/supabase.service';

@Module({
  imports: [],
  controllers: [AppController, ProfileController, AuthController],
  providers: [AppService, SupabaseService],
})
export class AppModule { }
