import { Field, InputType } from '@nestjs/graphql'

@InputType()
export class EditFileOrFolderNameInput {
	@Field(() => String)
	oldPath: string

	@Field(() => String)
	newPath: string
}
