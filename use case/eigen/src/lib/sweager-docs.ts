import { INestApplication } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

const config = new DocumentBuilder()
  .setTitle('YouApp API')
  .setDescription('YouApp API Challenge')
  .setVersion('1.0')
  .setContact(
    'Adit Dwi Ramadhan',
    'https://personal-website-bice-pi-33.vercel.app/',
    'aditdwiramadhan@students.unnes.ac.id',
  )
  .addTag('members')
  .addTag('books')
  .build();

export const document = (app: INestApplication<any>) =>
  SwaggerModule.createDocument(app, config);
