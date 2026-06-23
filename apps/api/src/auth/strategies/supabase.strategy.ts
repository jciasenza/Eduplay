import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class SupabaseStrategy extends PassportStrategy(Strategy, 'supabase') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.VITE_SUPABASE_ANON_KEY || 'dummy_key_for_dev',
    });
  }

  async validate(payload: any) {
    // payload contains the JWT decoded content
    if (!payload || !payload.sub) {
      throw new UnauthorizedException();
    }
    
    // We attach the user ID (Supabase UUID) to the request
    return { userId: payload.sub, email: payload.email, role: payload.app_metadata?.role || 'user' };
  }
}
