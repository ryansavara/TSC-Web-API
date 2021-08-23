import { ApiProperty } from '@nestjs/swagger';

export class ContactVm {
  @ApiProperty()
  name: string;
  @ApiProperty({ minLength: 10, maxLength: 14 })
  office: string;
  @ApiProperty({ minLength: 10, maxLength: 14 })
  @ApiProperty()
  cell: string;
  role: string;
}
