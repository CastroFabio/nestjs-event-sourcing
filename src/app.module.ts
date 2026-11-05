import { Module } from '@nestjs/common';
import { EventStoreModule } from './event-store/event-store.module.js';

@Module({
  imports: [EventStoreModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
