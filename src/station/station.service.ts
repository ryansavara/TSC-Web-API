import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Station } from './station.model';

@Injectable()
export class StationService {
  private readonly logger = new Logger(StationService.name);

  constructor(
    @InjectModel('Station') private readonly stationModel: Model<Station>,
  ) {}

  async insertStation(dto: Station): Promise<string> {
    try {
      const phoneRegex =
        /(\()?[0-9]{3}(\))?([\s\.-])?[0-9]{3}([\s\.-])?[0-9]{4}/;
      dto.contacts.forEach((contact) => {
        if (
          !phoneRegex.test(contact.cell) ||
          !phoneRegex.test(contact.office)
        ) {
          throw new BadRequestException('Invalid phone number format.');
        }
      });

      const newStation = new this.stationModel({
        callLetters: dto.callLetters,
        affiliation: dto.affiliation,
        timezone: dto.timezone,
        location: dto.location,
        contacts: dto.contacts,
        fillList: dto.fillList,
        createdAt: new Date(),
      });

      await newStation.save();
    } catch (err) {
      this.logger.error(`Error creating new station: ${err.message}`);
      throw new InternalServerErrorException();
    }
    return dto.callLetters;
  }

  async getAllStations(): Promise<Station[]> {
    const stations = await this.stationModel.find().exec();
    return stations as Station[];
  }

  async getStationByCallLetters(callLetters: string) {
    return await this.findStation(callLetters);
  }

  async updateStation(callLetters: string, dto: Station) {
    try {
      let station = await this.findStation(callLetters);

      if (!station) {
        throw new NotFoundException();
      }

      station.affiliation = dto.affiliation;
      station.timezone = dto.timezone;
      station.location = dto.location;
      station.contacts = dto.contacts;
      station.fillList = dto.fillList;
      station.save();
      return station;
    } catch (err) {
      this.logger.error(`Error updating station: ${err.message}`);
      throw new InternalServerErrorException();
    }
  }

  async deleteStation(callLetters: string) {
    try {
      const updatedStation = await this.findStation(callLetters);

      updatedStation.delete();
    } catch (err) {
      this.logger.error(`Error deleting station: ${err.message}`);
      throw new InternalServerErrorException();
    }
  }

  private async findStation(callLetters: string): Promise<Station> {
    let station: Station;
    try {
      station = await this.stationModel.findOne({ callLetters }).exec();
    } catch (err) {
      this.logger.error(`Error finding station ${callLetters}: ${err.message}`);
      throw new NotFoundException('Station not found.');
    }
    if (!station) {
      throw new NotFoundException('Station not found.');
    }

    return station;
  }
}
