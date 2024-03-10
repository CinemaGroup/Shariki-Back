import {
	CanActivate,
	ExecutionContext,
	ForbiddenException,
} from '@nestjs/common'
import { GqlExecutionContext } from '@nestjs/graphql'
import { User } from 'src/resources/user/entities/user.entity'
import { UserRole } from 'src/resources/user/enums/user-role.enum'

export class OnlyAdminGuard implements CanActivate {
	canActivate(context: ExecutionContext): boolean {
		const ctx = GqlExecutionContext.create(context)
		const user = ctx.getContext().req.user as User
		if (user.role !== UserRole.ADMIN)
			throw new ForbiddenException('You have no rights')

		return true
	}
}
