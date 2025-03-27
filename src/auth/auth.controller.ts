import {
  Controller,
  Post,
  Body,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';
import { UserLoginDto } from './user-login.dto';
import { UserRegisterDto } from './user-register.dto';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() userLoginDto: UserLoginDto) {
    const user = await this.authService.validateUser(
      userLoginDto.email,
      userLoginDto.password,
    );
    if (!user) {
      throw new UnauthorizedException('Wrong email or password');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(@Body() userRegisterDto: UserRegisterDto) {
    const existing = await this.usersService.findByEmail(userRegisterDto.email);
    if (existing) throw new ConflictException('Email is already in use!');

    const newUser = await this.usersService.create(userRegisterDto);

    const { passwordHash, ...userWithoutPassword } = newUser;
    return this.authService.login(userWithoutPassword);
  }
}
