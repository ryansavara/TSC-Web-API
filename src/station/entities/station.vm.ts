import { ApiProperty } from '@nestjs/swagger';
import { ContactVm } from './contact.vm';
import { SpotVm } from './spot.vm';

export class StationVm {
  @ApiProperty({ maxLength: 5, minLength: 3 })
  callLetters: string;
  @ApiProperty({ maxLength: 3, minLength: 3 })
  affiliation: string;
  @ApiProperty()
  timezone: number;
  @ApiProperty()
  location: string;
  @ApiProperty()
  contacts: Array<ContactVm>;
  @ApiProperty()
  fillList: Array<SpotVm>;
}
