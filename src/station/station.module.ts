import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { StationController } from './station.controller';
import { StationSchema } from './station.model';
import { StationService } from './station.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'Station', schema: StationSchema }]),
  ],
  controllers: [StationController],
  providers: [StationService],
  exports: [StationService],
})
export class StationModule {}
