import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

@Injectable()
export class UserGuard implements CanActivate {
  constructor() {}

  canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (user) {
      return true;
    }

    throw new UnauthorizedException();
  }
}
