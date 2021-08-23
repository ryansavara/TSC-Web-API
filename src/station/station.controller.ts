import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import {
  ApiCreatedResponse,
  ApiNotFoundResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { UserGuard } from 'src/users/user.guard';
import { StationVm } from './entities/station.vm';
import { Station } from './station.model';
import { StationService } from './station.service';

@ApiTags('Station')
@Controller('station')
@UseGuards(AuthGuard('jwt'), UserGuard)
export class StationController {
  constructor(private readonly stationsService: StationService) {}

  @Post()
  @ApiCreatedResponse({ type: StationVm })
  addStation(@Body() dto: Station) {
    return this.stationsService.insertStation(dto);
  }

  @Get()
  @ApiOkResponse({ type: StationVm, isArray: true })
  getAllStations() {
    return this.stationsService.getAllStations();
  }

  @Get(':callLetters')
  @ApiOkResponse({ type: StationVm })
  @ApiNotFoundResponse()
  getStationByCallLetters(@Param('callLetters') callLetters: string) {
    const station = this.stationsService.getStationByCallLetters(callLetters);

    if (!station) {
      throw new NotFoundException();
    }

    return station;
  }

  @Patch(':callLetters')
  updateStation(
    @Param('callLetters') callLetters: string,
    @Body() dto: Station,
  ) {
    this.stationsService.updateStation(callLetters, dto);
    return null;
  }

  @Delete(':callLetters')
  deleteStation(@Param('callLetters') callLetters: string) {
    this.stationsService.deleteStation(callLetters);
    return null;
  }
}
