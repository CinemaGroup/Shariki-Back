import { InputType } from '@nestjs/graphql'
import { QueryInput } from 'src/global/inputs/query.input'

@InputType()
export class QueryProductInput extends QueryInput {}
