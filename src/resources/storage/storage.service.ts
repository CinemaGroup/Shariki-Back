import { Injectable } from '@nestjs/common'
import { path } from 'app-root-path'
import {
	createWriteStream,
	ensureDir,
	readdir,
	readdirSync,
	remove,
	rename,
	statSync,
} from 'fs-extra'
import { extname, join } from 'path'
import { PrismaService } from 'src/prisma/prisma.service'
import { pipeline } from 'stream/promises'
import { FolderWithChild } from './entities/folder.entity'
import { CreateFolderInput } from './inputs/create-folder.input'
import { EditFileOrFolderNameInput } from './inputs/edit-file-or-folder-name.input'
import { UploadFilesInput } from './inputs/upload-files.input'

@Injectable()
export class StorageService {
	constructor(private readonly prisma: PrismaService) {}

	async getDirectories(directoryPath: string) {
		try {
			const folders: FolderWithChild[] = []
			const items = await readdir(directoryPath)

			for (const item of items) {
				const itemPath = join(directoryPath, item)
				const stats = statSync(itemPath)
				const isDirectory = stats.isDirectory()

				if (isDirectory) {
					const folder: FolderWithChild = {
						name: item,
						childrens: await this.getDirectories(itemPath),
						path: itemPath,
						createdAt: stats.birthtime,
					}
					folders.push(folder)
				}
			}

			return folders
		} catch (error) {
			console.error(`Error getting directories: ${error}`)
			throw error
		}
	}

	async getFolderItems(parentPath: string) {
		try {
			const items = readdirSync(parentPath, { withFileTypes: true })

			const files = []
			const folders = []

			for (const item of items) {
				const fullPath = `${parentPath}/${item.name}`
				const stats = statSync(fullPath)

				if (item.isDirectory()) {
					const folderSize = await this.getFolderSize(fullPath)
					folders.push({
						name: item.name,
						size: this.formatBytes(folderSize),
						count: this.countItemsInFolder(fullPath),
						path: fullPath,
						createdAt: stats.birthtime,
					})
				} else {
					files.push({
						name: item.name,
						size: this.formatBytes(stats.size),
						extension: extname(item.name),
						path: fullPath,
						createdAt: stats.birthtime,
					})
				}
			}

			return { folders, files }
		} catch (error) {
			console.error(`Error reading directory ${parentPath}: ${error.message}`)
			return { files: [], folders: [] }
		}
	}

	async uploadFiles({ data, folderPath }: UploadFilesInput) {
		try {
			const uploadFolder = `${path}/${folderPath}`

			for await (const file of data) {
				const { createReadStream, filename } = file
				const readStream = createReadStream()

				await pipeline(
					readStream,
					createWriteStream(`${uploadFolder}/${filename}`)
				)
			}

			return 'Files uploaded successfully'
		} catch (error) {
			console.error('Upload error:', error)
			return `Upload error: ${error}`
		}
	}

	async createFolder({ name, folderPath }: CreateFolderInput) {
		const createFolderPath = `${path}/${folderPath}/${name}`

		try {
			await ensureDir(createFolderPath)
			return 'Success'
		} catch (error) {
			console.error(`Error creating folder "${createFolderPath}": ${error}`)
			return 'Error'
		}
	}

	async editFileOrFolderName({ oldPath, newPath }: EditFileOrFolderNameInput) {
		try {
			await rename(oldPath, newPath)

			this.updatePrismaFilesAndFolders(oldPath, newPath)

			return `Success`
		} catch (error) {
			console.log(error)
			return `Error`
		}
	}

	async deleteFileOrFolder(currentPath: string) {
		try {
			await remove(currentPath)

			this.updatePrismaFilesAndFolders(currentPath)

			return `Success`
		} catch (error) {
			console.log(error)
			return `Error`
		}
	}

	private async updatePrismaFilesAndFolders(oldPath: string, newPath?: string) {
		// await Promise.all([
		// 	this.updateImagePath(this.prisma.group, 'imagePath', oldPath, newPath),
		// 	this.updateImagePath(this.prisma.category, 'imagePath', oldPath, newPath),
		// 	this.updateImagePath(
		// 		this.prisma.advantage,
		// 		'imagePath',
		// 		oldPath,
		// 		newPath
		// 	),
		// 	this.updateImagePath(this.prisma.service, 'imagePath', oldPath, newPath),
		// 	this.updateImagePath(this.prisma.offer, 'imagePath', oldPath, newPath),
		// 	this.updateImagePath(
		// 		this.prisma.review,
		// 		'authorAvatar',
		// 		oldPath,
		// 		newPath
		// 	),
		// ])
	}

	private async updateImagePath(
		model: any,
		optionName: string,
		oldPath: string,
		newPath?: string
	): Promise<void> {
		const whereOption: { [key: string]: any } = {}
		whereOption[optionName] = {
			startsWith: oldPath,
		}

		await model.updateMany({
			where: whereOption,
			data: {
				[optionName]: newPath ? `/${newPath}` : '',
			},
		})
		console.log(newPath)
	}

	private async getFolderSize(folderPath: string) {
		const items = readdirSync(folderPath, { withFileTypes: true })
		let totalSize = 0

		for (const item of items) {
			const fullPath = `${folderPath}/${item.name}`
			const stats = statSync(fullPath)

			totalSize += item.isDirectory()
				? await this.getFolderSize(fullPath)
				: stats.size
		}

		return totalSize
	}

	private formatBytes(bytes: number) {
		const sizes = ['B', 'KB', 'MB', 'GB', 'TB']

		if (bytes === 0) return '0 B'

		const i = Math.floor(Math.log(bytes) / Math.log(1024))

		return (
			(Math.round((100 * bytes) / Math.pow(1024, i)) / 100).toFixed(2) +
			' ' +
			sizes[i]
		)
	}

	private countItemsInFolder(folderPath: string) {
		const items = readdirSync(folderPath, { withFileTypes: true })
		return items.length
	}
}
