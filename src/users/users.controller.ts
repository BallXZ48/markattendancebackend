import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  UpdateUserDto,
  AssignRoleDto,
  UserRoleEnum,
} from './dto/create-user.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators';

import * as argon2 from 'argon2';

@Controller('users')
@UseGuards(AccessTokenGuard, RolesGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async createUser(@Body() createUserDto: CreateUserDto) {
    const { password, ...rest } = createUserDto;

    // Hash password before saving
    const hashedPassword = await argon2.hash(password);

    const newUser = await this.usersService.create({
      ...rest,
      passwordHash: hashedPassword,
    });

    return this.usersService.findById(String(newUser._id));
  }

  @Get()
  @Roles('admin')
  async getAllUsers(@Query('role') role?: UserRoleEnum) {
    const filters = role ? { role } : undefined;
    return this.usersService.findAll(filters);
  }

  @Get('teachers')
  @Roles('admin')
  async getAllTeachers() {
    return this.usersService.findAll({ role: 'teacher' });
  }

  @Get('students')
  @Roles('admin')
  async getAllStudents() {
    return this.usersService.findAll({ role: 'student' });
  }

  @Get(':id')
  @Roles('admin', 'teacher')
  async getUserById(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Put(':id')
  @Roles('admin')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id/role')
  @Roles('admin')
  async assignRole(
    @Param('id') id: string,
    @Body() assignRoleDto: AssignRoleDto,
  ) {
    return this.usersService.updateRole(id, assignRoleDto.role);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async deleteUser(@Param('id') id: string) {
    return this.usersService.delete(id);
  }
}
