import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_GUARD } from '@nestjs/core';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { ApiKeyGuard } from './apikey.guard';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { StationModule } from './station/station.module';
import { UsersModule } from './users/users.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    AuthModule,
    StationModule,
    UsersModule,
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGO_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
      }),
      inject: [ConfigService],
    }),
    /*ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),*/
  ],
  controllers: [AppController],
  providers: [
    AppService,
    ConfigService,
    {
      provide: APP_GUARD,
      useClass: ApiKeyGuard,
    },
  ],
})
export class AppModule {}
