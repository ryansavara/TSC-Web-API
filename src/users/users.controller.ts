import {
  BadRequestException,
  Body,
  Controller,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiBadRequestResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserVm } from './entities/user.vm';
import { UserGuard } from './user.guard';
import { UpdateUser, User, UserDTO } from './users.model';
import { UsersService } from './users.service';

@ApiTags('Users')
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiOkResponse({ type: String })
  @ApiBadRequestResponse()
  async addUser(@Body() dto: User) {
    const userId = await this.usersService.insertUser(dto);

    if (!userId) {
      throw new BadRequestException();
    }

    return { id: userId };
  }

  @Get(':id')
  @ApiOkResponse({ type: UserVm })
  @ApiNotFoundResponse()
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async getUserById(@Param('id') userId: string) {
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new NotFoundException();
    }
    return user;
  }

  @Patch(':id')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async updateUser(@Param('id') userId: string, @Body() dto: User) {
    await this.usersService.updateUser(userId, dto);
    return null;
  }

  @Post('self')
  @UseGuards(AuthGuard('jwt'), UserGuard)
  async updateSelf(@Body() dto: UpdateUser) {
    await this.usersService.updateSelfUser(dto.id, dto);
    return null;
  }
}
