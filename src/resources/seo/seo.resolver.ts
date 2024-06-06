import { Resolver } from '@nestjs/graphql';
import { SeoService } from './seo.service';

@Resolver()
export class SeoResolver {
  constructor(private readonly seoService: SeoService) {}
}
