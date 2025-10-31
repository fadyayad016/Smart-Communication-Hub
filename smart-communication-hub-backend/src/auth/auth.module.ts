import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtStrategy } from './jwt.strategy';
import { config } from 'process';
@Module({
    imports:[
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            inject:[ConfigService],
            useFactory:(config: ConfigService)=>({
                secret:config.get<string>('JWT_SECRET'),
                signOptions:{expiresIn:'60m'}
            }),
        }),

    ],
    controllers:[AuthController],
    providers:[AuthService, JwtStrategy],
    exports:[AuthService],
})
export class AuthModule {}
