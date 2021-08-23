import { ApiProperty } from '@nestjs/swagger';

export class SpotVm {
  @ApiProperty({ minLength: 7 })
  length: string;
  @ApiProperty()
  spots: Array<string>;
}
