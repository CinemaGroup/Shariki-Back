import { Field, Int, ObjectType } from '@nestjs/graphql'
import { File } from './file.entity'
import { Folder } from './folder.entity'

@ObjectType()
export class StorageItem {
	@Field(() => [Folder])
	folders: Folder[]

	@Field(() => [File])
	files: File[]

	@Field(() => Int)
	count: number
}
