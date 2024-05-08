import { Injectable } from '@nestjs/common'
import { CharacteristicType } from '../product/characteristic/enum/characteristic.enum'
import { Product } from '../product/entities/product.entity'
import { Filters, FiltersItem, ImageFilter } from './entities/filters.entity'

@Injectable()
export class FiltersService {
	async getFilters(products: Product[]) {
		let sizes: FiltersItem[] = []
		let colors: FiltersItem[] = []
		let hues: FiltersItem[] = []
		let manufacturers: FiltersItem[] = []
		let materials: FiltersItem[] = []
		let countries: FiltersItem[] = []
		let types: ImageFilter[] = []
		let collections: FiltersItem[] = []
		let holidays: FiltersItem[] = []
		let prices: number[] = []

		const updateFilterCount = (filter: FiltersItem[], value: string) => {
			const index = filter.findIndex((item) => item.value === value)
			if (index !== -1) {
				filter[index].count++
			} else {
				filter.push({ label: value, value, count: 1 })
			}
		}

		products.forEach((product) => {
			prices.push(parseFloat(product.price))

			product.sizes.forEach((size) => {
				sizes.push({ label: size.size, value: size.size, count: 0 })
				updateFilterCount(sizes, size.size)
			})

			product.characteristics.forEach((characteristic) => {
				switch (characteristic.type) {
					case CharacteristicType.COLOR:
						colors.push({
							label: characteristic.name,
							value: characteristic.slug,
							count: 0,
						})
						updateFilterCount(colors, characteristic.slug)
						break
					case CharacteristicType.HUE:
						hues.push({
							label: characteristic.name,
							value: characteristic.slug,
							count: 0,
						})
						updateFilterCount(hues, characteristic.slug)
						break
					case CharacteristicType.MANUFACTURER:
						manufacturers.push({
							label: characteristic.name,
							value: characteristic.slug,
							count: 0,
						})
						updateFilterCount(manufacturers, characteristic.slug)
						break
					case CharacteristicType.MATERIAL:
						materials.push({
							label: characteristic.name,
							value: characteristic.slug,
							count: 0,
						})
						updateFilterCount(materials, characteristic.slug)
						break
					case CharacteristicType.COUNTRY:
						countries.push({
							label: characteristic.name,
							value: characteristic.slug,
							count: 0,
						})
						updateFilterCount(countries, characteristic.slug)
						break
					default:
						break
				}
			})

			product.types.forEach((type) => {
				types.push({ iconPath: type.iconPath, uncheckedIconPath: type.uncheckedIconPath, value: type.slug })
			})

			product.collections.forEach((collection) => {
				collections.push({
					label: collection.name,
					value: collection.slug,
					count: 0,
				})
				updateFilterCount(collections, collection.slug)
			})

			product.holidays.forEach((holiday) => {
				holidays.push({ label: holiday.name, value: holiday.slug, count: 0 })
				updateFilterCount(holidays, holiday.slug)
			})
		})

		const removeDuplicates = (array: FiltersItem[]) => {
			return array.filter(
				(item, index, self) =>
					self.findIndex(
						(i) => i.label === item.label && i.value === item.value
					) === index
			)
		}

		const removeTypesDuplicates = (array: ImageFilter[]) => {
			return array.filter(
				(item, index, self) =>
					self.findIndex(
						(i) => i.iconPath === item.iconPath && i.value === item.value
					) === index
			)
		}

		sizes = removeDuplicates(sizes)
		colors = removeDuplicates(colors)
		hues = removeDuplicates(hues)
		manufacturers = removeDuplicates(manufacturers)
		materials = removeDuplicates(materials)
		countries = removeDuplicates(countries)
		collections = removeDuplicates(collections)
		holidays = removeDuplicates(holidays)
		types = removeTypesDuplicates(types)

		const minPrice = prices.length > 0 ? Math.min(...prices) : 0
		const maxPrice = prices.length > 0 ? Math.max(...prices) : 0

		return {
			sizes,
			colors,
			hues,
			manufacturers,
			materials,
			countries,
			types,
			collections,
			holidays,
			price: {
				min: minPrice,
				max: maxPrice,
			},
		} as Filters
	}
}
