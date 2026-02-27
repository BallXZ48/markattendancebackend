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
  BadRequestException,
} from '@nestjs/common';
import { CoursesService } from './courses.service';
import {
  CreateCourseDto,
  UpdateCourseDto,
  AddStudentsToCourseDto,
  RemoveStudentsFromCourseDto,
} from './dto/course.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../auth/decorators';

@Controller('courses')
@UseGuards(AccessTokenGuard, RolesGuard)
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Post()
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.CREATED)
  async createCourse(
    @Body() createCourseDto: CreateCourseDto,
    @CurrentUser('sub') userId: string,
  ) {
    return this.coursesService.create(createCourseDto);
  }

  @Get()
  @Roles('admin', 'teacher', 'student')
  async getAllCourses(
    @Query('academicYear') academicYear?: string,
    @Query('semester') semester?: string,
    @Query('teacherId') teacherId?: string,
  ) {
    const filters: any = {};
    if (academicYear) filters.academicYear = parseInt(academicYear, 10);
    if (semester) filters.semester = parseInt(semester, 10);
    if (teacherId) filters.teacherId = teacherId;

    return this.coursesService.findAll(filters);
  }

  @Get('teacher/:teacherId')
  @Roles('admin', 'teacher')
  async getTeacherCourses(@Param('teacherId') teacherId: string) {
    return this.coursesService.findByTeacher(teacherId);
  }

  @Get('student/:studentId')
  @Roles('admin', 'teacher', 'student')
  async getStudentCourses(@Param('studentId') studentId: string) {
    return this.coursesService.findByStudentId(studentId);
  }

  @Get(':id')
  @Roles('admin', 'teacher', 'student')
  async getCourseById(@Param('id') id: string) {
    return this.coursesService.findById(id);
  }

  @Put(':id')
  @Roles('admin', 'teacher')
  async updateCourse(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
  ) {
    return this.coursesService.update(id, updateCourseDto);
  }

  @Post(':courseId/students/add')
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.OK)
  async addStudents(
    @Param('courseId') courseId: string,
    @Body() addStudentsDto: AddStudentsToCourseDto,
  ) {
    return this.coursesService.addStudents(courseId, addStudentsDto);
  }

  @Post(':courseId/students/remove')
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.OK)
  async removeStudents(
    @Param('courseId') courseId: string,
    @Body() removeStudentsDto: RemoveStudentsFromCourseDto,
  ) {
    return this.coursesService.removeStudents(courseId, removeStudentsDto);
  }

  @Delete(':id')
  @Roles('admin')
  @HttpCode(HttpStatus.OK)
  async deleteCourse(@Param('id') id: string) {
    return this.coursesService.delete(id);
  }
}
