import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // 1. ตั้งค่า CORS ก่อน
  app.enableCors({
    origin: ['http://localhost:3001', 'http://127.0.0.1:3001'],
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // 2. ตามด้วย Helmet
  app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for local dev troubleshooting
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // 3. Pipes และส่วนอื่นๆ (ห้ามลืมใส่ {} ใน ValidationPipe ตามที่คุณตั้งค่าไว้ก่อนหน้า)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(3000);
}
bootstrap();
