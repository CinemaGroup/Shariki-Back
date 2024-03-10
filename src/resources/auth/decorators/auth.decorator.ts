import { UseGuards, applyDecorators } from '@nestjs/common'
import { UserRole } from 'src/resources/user/enums/user-role.enum'
import { OnlyAdminGuard } from '../guards/admin.guard'
import { GqlAuthGuard } from '../guards/gql-auth.guard'

export const Auth = (role: UserRole = UserRole.USER) =>
	applyDecorators(
		role === UserRole.ADMIN
			? UseGuards(GqlAuthGuard, OnlyAdminGuard)
			: UseGuards(GqlAuthGuard)
	)
