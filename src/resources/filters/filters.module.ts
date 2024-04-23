import { Module } from '@nestjs/common';
import { FiltersService } from './filters.service';
import { FiltersResolver } from './filters.resolver';

@Module({
  providers: [FiltersResolver, FiltersService],
})
export class FiltersModule {}
