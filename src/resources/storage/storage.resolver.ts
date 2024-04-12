import { Args, Mutation, Query, Resolver } from '@nestjs/graphql'
import { UserRole } from '../user/enums/user-role.enum'
import { FolderWithChild } from './entities/folder.entity'
import { StorageItem } from './entities/storage-item.entity'
import { CreateFolderInput } from './inputs/create-folder.input'
import { EditFileOrFolderNameInput } from './inputs/edit-file-or-folder-name.input'
import { UploadFilesInput } from './inputs/upload-files.input'
import { StorageService } from './storage.service'
import { Auth } from '../auth/decorators/auth.decorator'

@Resolver()
export class StorageResolver {
	constructor(private readonly storageService: StorageService) {}

	@Query(() => [FolderWithChild], { name: 'folders' })
	// @Auth(UserRole.ADMIN)
	async getDirectories() {
		return this.storageService.getDirectories('uploads')
	}

	@Query(() => StorageItem, { name: 'folderItems' })
	// @Auth(UserRole.ADMIN)
	async getFolderItems(
		@Args('folderPath', { type: () => String }) folderPath: string
	) {
		return this.storageService.getFolderItems(folderPath)
	}

	// @Auth(UserRole.ADMIN)
	@Mutation(() => String, { name: 'uploadFiles' })
	async uploadFiles(
		@Args('data', { type: () => UploadFilesInput }) input: UploadFilesInput
	) {
		try {
			return await this.storageService.uploadFiles(input)
		} catch (error) {
			console.error(error)
			return `Upload error: ${error}`
		}
	}

	// @Auth(UserRole.ADMIN)
	@Mutation(() => String, { name: 'createFolder' })
	async createFolder(
		@Args('data', { type: () => CreateFolderInput }) input: CreateFolderInput
	) {
		return this.storageService.createFolder(input)
	}

	// @Auth(UserRole.ADMIN)
	@Mutation(() => String, { name: 'deleteFileOrFolder' })
	async deleteFileOrFolder(@Args('path', { type: () => String }) path: string) {
		return this.storageService.deleteFileOrFolder(path)
	}

	// @Auth(UserRole.ADMIN)
	@Mutation(() => String, { name: 'editFileOrFolderName' })
	async editFileOrFolderName(
		@Args('data', { type: () => EditFileOrFolderNameInput })
		data: EditFileOrFolderNameInput
	) {
		return this.storageService.editFileOrFolderName(data)
	}
}
