import { Injectable , UnauthorizedException } from "@nestjs/common";    
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { ConfigService } from '@nestjs/config';
import { UsersService } from 'src/users/users.service';


@Injectable()
 
export class JwtStrategy  extends PassportStrategy(Strategy){
    constructor( private configService:ConfigService,private usersService:UsersService){
        const secret = configService.get<string>('JWT_SECRET');
        if (!secret) {
        throw new Error('JWT_SECRET is not configured in environment variables');
    }
        super({
          jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: secret,

        })

    }

    async validate (payload:{sub:number;email : string  }){
        const user = await this.usersService.findById(payload.sub);
        if (!user) {
      throw new UnauthorizedException();
    }
    return { id: user.id, email: user.email, name: user.name };
    }
}