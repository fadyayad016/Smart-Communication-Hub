import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
  Inject,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from 'src/users/users.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async register(registerdto: RegisterDto) {
    const existingUser = await this.usersService.findByEmail(registerdto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(registerdto.password, 10);
    const user = await this.usersService.create({
      name: registerdto.name,
      email: registerdto.email,
      password: hashedPassword,
    });

    const payload = { email: user.email, sub: user.id };
    return {
      user: { id: user.id, email: user.email, name: user.name },
      access_token: this.jwtService.sign(payload),
    };
  }

  async login(logindto: LoginDto) {
    const user = await this.usersService.findByEmail(logindto.email);
    if (!user) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(logindto.password, user.password);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid email or password');
    }

    const payload = { email: user.email, sub: user.id };
    return {
      user: { id: user.id, email: user.email, name: user.name },
      access_token: this.jwtService.sign(payload),
    };
  }
}
