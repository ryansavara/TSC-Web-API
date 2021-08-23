import {
  Body,
  Controller,
  Get,
  Headers,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { UsersService } from 'src/users/users.service';
import { LoginDTO } from './auth.dto';
import { AuthService } from './auth.service';

@ApiTags('Auth')
@Controller('auth')
export class AuthController {
  constructor(
    private userService: UsersService,
    private authService: AuthService,
  ) {}
  @Get()
  @UseGuards(AuthGuard('jwt'))
  getCurrentUser(@Headers() header: any) {
    const auth = header.authorization.split(' ')[1];
    if (auth) {
      const decoded = this.authService.returnUser(auth);
      return decoded;
    }
    return null;
  }

  @Post('login')
  async login(@Body() dto: LoginDTO) {
    const user = await this.userService.findByLogin(dto);

    const payload = {
      email: user.email,
      id: user._id,
      name: user.name,
    };
    const token = await this.authService.signPayload(payload);
    return { user, token };
  }
}
