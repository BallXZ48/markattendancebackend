import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User, UserDocument, UserRole } from './schemas/user.schema';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) { }

  findByEmail(email: string) {
    return this.userModel.findOne({ email }).exec();
  }

  findByEmailWithSecrets(email: string) {
    return this.userModel
      .findOne({ email })
      .select('+passwordHash +refreshTokenHash')
      .exec();
  }

  findByIdWithRefresh(userId: string) {
    return this.userModel.findById(userId).select('+refreshTokenHash').exec();
  }

  async findById(userId: string): Promise<User> {
    const user = await this.userModel
      .findById(userId)
      .select('-passwordHash -refreshTokenHash')
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async findAll(filters?: { role?: UserRole }): Promise<User[]> {
    const query: any = {};
    if (filters?.role) {
      query.role = filters.role;
    }
    return this.userModel
      .find(query)
      .select('-passwordHash -refreshTokenHash')
      .exec();
  }

  create(data: {
    email: string;
    passwordHash: string;
    role?: UserRole;
    fullName?: string;
    studentId?: string;
    department?: string;
    facultyName?: string;
    tableId?: number;
    teachingCourseIds?: string[];
  }) {
    return this.userModel.create({
      email: data.email,
      passwordHash: data.passwordHash,
      fullName: data.fullName || data.email,
      role: data.role ?? 'student',
      studentId: data.studentId,
      department: data.department,
      facultyName: data.facultyName,
      tableId: data.tableId,
      teachingCourseIds: data.teachingCourseIds,
    });
  }

  async update(userId: string, updateData: Partial<User>): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: updateData }, { new: true })
      .select('-passwordHash -refreshTokenHash')
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async updateRole(userId: string, role: UserRole): Promise<User> {
    const user = await this.userModel
      .findByIdAndUpdate(userId, { $set: { role } }, { new: true })
      .select('-passwordHash -refreshTokenHash')
      .exec();
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return user;
  }

  async delete(userId: string): Promise<{ success: boolean }> {
    const result = await this.userModel.findByIdAndDelete(userId).exec();
    if (!result) {
      throw new NotFoundException('User not found');
    }
    return { success: true };
  }

  setRefreshTokenHash(userId: string, refreshTokenHash: string | null) {
    return this.userModel
      .updateOne({ _id: userId }, { refreshTokenHash })
      .exec();
  }

  setRole(userId: string, role: UserRole) {
    return this.userModel.updateOne({ _id: userId }, { role }).exec();
  }
}
