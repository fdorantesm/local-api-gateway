import { Module } from '@nestjs/common';
import { StartCommand } from './start.command';

@Module({
  providers: [StartCommand],
})
export class AppModule {}
