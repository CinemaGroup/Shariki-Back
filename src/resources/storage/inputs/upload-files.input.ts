import { Field, InputType } from '@nestjs/graphql'
import { FileUpload, GraphQLUpload } from 'graphql-upload-ts'

@InputType()
export class UploadFilesInput {
	@Field(() => String)
	folderPath: string

	@Field(() => [GraphQLUpload])
	data: FileUpload[]
}
