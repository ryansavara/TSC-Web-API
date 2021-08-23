import { ApiProperty } from '@nestjs/swagger';

export class UserVm {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
  @ApiProperty()
  password: string;
  @ApiProperty()
  registeredAt: Date;
  @ApiProperty({ required: false })
  updatedAt: Date;
  @ApiProperty({ required: false })
  deletedAt: Date;
  @ApiProperty()
  enabled: boolean;
}
