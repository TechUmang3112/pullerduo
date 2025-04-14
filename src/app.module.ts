// Imports
import { Global, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UtilsModule } from './utils/utils.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { UserModule } from './user/user.module';
import { DriverModule } from './driver/driver.module';
import { mongoModels } from './db/models/inject.mongo.models';
import { ThirdPartyModule } from './thirdParty/third.party.module';
import { RiderModule } from './rider/rider.module';
import { AdminModule } from './admin/admin.module';

@Global()
@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // Load environment variables
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
        useNewUrlParser: true,
        useUnifiedTopology: true,
        // tls: true, // Enable TLS
        tlsAllowInvalidCertificates: false, // Do not allow invalid certificates
      }),
    }),
    ...mongoModels,
    AdminModule,
    AuthModule,
    DriverModule,
    RiderModule,
    ThirdPartyModule,
    UtilsModule,
    UserModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
