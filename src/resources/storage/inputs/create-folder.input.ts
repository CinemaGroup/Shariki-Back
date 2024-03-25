import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class CreateFolderInput {
	@Field(() => String)
	name: string

	@Field(() => String)
	folderPath: string
}
