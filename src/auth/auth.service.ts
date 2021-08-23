import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}

  async signPayload(payload: any) {
    return this.jwtService.sign(payload, { expiresIn: '12h' });
  }

  async validateUser(payload: any) {
    return await this.userService.findByPayload(payload);
  }

  async returnUser(payload: any) {
    return this.jwtService.decode(payload);
  }
}
