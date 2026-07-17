import { Body, Controller, Delete, Get, Param, Patch, Post, Req, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { UpdateSelfProfileDto } from './dto/update-self-profile.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { Roles } from '../auth/roles.decorator';
import { Role } from './role.enum';

/**
 * UsersController
 * -------------------------------------------------
 * Exposes user management endpoints for the HiveEdu E-Raport platform.
 *
 * NOTE: The term "user" refers to the USER role account throughout
 * the entire codebase — keep USER role wording consistent.
 */
@Controller('users')
@UseGuards(JwtAuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles(Role.ADMIN)
  async create(
    @Body() createUserDto: CreateUserDto,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    const user = await this.usersService.create(createUserDto, {
      actorId: req.user.userId,
      actorRole: req.user.role,
    });
    return this.usersService.toSafeUserResponse(user);
  }

  @Get()
  @Roles(Role.ADMIN)
  findAll() {
    return this.usersService.findAll();
  }

  @Get('role/user')
  @Roles(Role.ADMIN, Role.TEACHER)
  findUsersByRoleUser(@Req() req: { user: { userId: string; role: string } }) {
    return this.usersService.findUsersByRoleUser({
      actorId: req.user.userId,
      actorRole: req.user.role,
    });
  }

  @Get('me')
  async getCurrentProfile(
    @Req() req: { user: { userId: string } },
  ) {
    const user = await this.usersService.getCurrentUserProfile(req.user.userId);
    return this.usersService.toSafeUserResponse(user);
  }

  @Patch('me')
  async updateCurrentProfile(
    @Body() updateSelfProfileDto: UpdateSelfProfileDto,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    const user = await this.usersService.updateSelfProfile(
      req.user.userId,
      updateSelfProfileDto,
      {
        actorId: req.user.userId,
        actorRole: req.user.role,
      },
    );
    return this.usersService.toSafeUserResponse(user);
  }

  @Get(':id/features')
  getLatestFeatures(
    @Param('id') id: string,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    return this.usersService.getLatestFeatures(id, {
      actorId: req.user.userId,
      actorRole: req.user.role,
    });
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    const user = await this.usersService.updateProfile(id, updateUserDto, {
      actorId: req.user.userId,
      actorRole: req.user.role,
    });
    return this.usersService.toSafeUserResponse(user);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  remove(
    @Param('id') id: string,
    @Req() req: { user: { userId: string; role: string } },
  ) {
    return this.usersService.remove(id, {
      actorId: req.user.userId,
      actorRole: req.user.role,
    });
  }
}
