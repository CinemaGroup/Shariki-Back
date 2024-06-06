import { Module } from '@nestjs/common';
import { SeoService } from './seo.service';
import { SeoResolver } from './seo.resolver';

@Module({
  providers: [SeoResolver, SeoService],
})
export class SeoModule {}
