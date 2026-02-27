import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtStrategy } from './strategies/jwt.strategy';
import { RefreshStrategy } from './strategies/refresh.strategy';
import { MongooseModule } from '@nestjs/mongoose';
import mongoose from 'mongoose';

// สร้าง Schema แบบหลวมๆ เพื่อไปอ่าน collection classsessions_S
const ClasssessionsSSchema = new mongoose.Schema(
  {},
  { strict: false, collection: 'classsessions_S' },
);

@Module({
  imports: [
    UsersModule,
    PassportModule,
    JwtModule.register({}),
    // ลงทะเบียน Model ตารางเรียน
    MongooseModule.forFeature([
      { name: 'Classsessions_S', schema: ClasssessionsSSchema },
    ]),
  ],
  controllers: [AuthController],
  providers: [AuthService, JwtStrategy, RefreshStrategy],
})
export class AuthModule {}
