import { Controller, Post, Body, ConflictException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UsersService } from 'src/users/users.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
  ) {}

  @Post('login')
  async login(@Body() body: { email: string; password: string }) {
    const user = await this.authService.validateUser(body.email, body.password);
    if (!user) {
      throw new ConflictException('Napačen email ali geslo!');
    }
    return this.authService.login(user);
  }

  @Post('register')
  async register(
    @Body() body: { email: string; password: string; fullName: string },
  ) {
    const existing = await this.usersService.findByEmail(body.email);
    if (existing) throw new ConflictException('Email je že v uporabi!');

    const newUser = await this.usersService.create({
      email: body.email,
      passwordHash: body.password,
      fullName: body.fullName,
    });

    const { passwordHash, ...userWithoutPassword } = newUser;
    return this.authService.login(userWithoutPassword);
  }
}
