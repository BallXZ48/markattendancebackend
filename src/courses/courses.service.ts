import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Course, CourseDocument } from './schemas/course.schema';
import {
  CreateCourseDto,
  UpdateCourseDto,
  AddStudentsToCourseDto,
  RemoveStudentsFromCourseDto,
} from './dto/course.dto';

@Injectable()
export class CoursesService {
  constructor(
    @InjectModel(Course.name) private courseModel: Model<CourseDocument>,
  ) {}

  async create(createCourseDto: CreateCourseDto): Promise<Course> {
    const existingCourse = await this.courseModel.findOne({
      courseCode: createCourseDto.courseCode,
    });

    if (existingCourse) {
      throw new BadRequestException('Course code already exists');
    }

    const course = new this.courseModel({
      ...createCourseDto,
      teacherId: createCourseDto.teacherId,
      studentIds: createCourseDto.studentIds || [],
    });
    return course.save();
  }

  async findAll(filters?: {
    academicYear?: number;
    semester?: number;
    teacherId?: string;
  }): Promise<Course[]> {
    const query: any = {};

    if (filters?.academicYear) query.academicYear = filters.academicYear;
    if (filters?.semester) query.semester = filters.semester;
    if (filters?.teacherId) query.teacherId = filters.teacherId as any;

    return this.courseModel
      .find(query)
      .populate('teacherId', 'fullName email')
      .populate('studentIds', 'fullName email studentId')
      .exec();
  }

  async findById(id: string): Promise<Course> {
    const course = await this.courseModel
      .findById(id)
      .populate('teacherId', 'fullName email')
      .populate('studentIds', 'fullName email studentId')
      .exec();

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async findByTeacher(teacherId: string): Promise<Course[]> {
    return this.courseModel
      .find({ teacherId: teacherId as any })
      .populate('studentIds', 'fullName email studentId')
      .exec();
  }

  async update(id: string, updateCourseDto: UpdateCourseDto): Promise<Course> {
    const course = await this.courseModel
      .findByIdAndUpdate(id, { $set: updateCourseDto }, { new: true })
      .populate('teacherId', 'fullName email');

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async findByStudentId(studentId: string): Promise<Course[]> {
    return this.courseModel
      .find({ studentIds: studentId as any })
      .populate('teacherId', 'fullName email')
      .exec();
  }

  async addStudents(
    courseId: string,
    addStudentsDto: AddStudentsToCourseDto,
  ): Promise<Course> {
    const course = await this.courseModel
      .findByIdAndUpdate(
        courseId,
        {
          $addToSet: {
            studentIds: { $each: addStudentsDto.studentIds as any },
          },
        },
        { new: true },
      )
      .populate('studentIds', 'fullName email studentId');

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async removeStudents(
    courseId: string,
    removeStudentsDto: RemoveStudentsFromCourseDto,
  ): Promise<Course> {
    const course = await this.courseModel
      .findByIdAndUpdate(
        courseId,
        { $pull: { studentIds: { $in: removeStudentsDto.studentIds as any } } },
        { new: true },
      )
      .populate('studentIds', 'fullName email studentId');

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async delete(id: string): Promise<{ success: boolean }> {
    const result = await this.courseModel.findByIdAndDelete(id);

    if (!result) {
      throw new NotFoundException('Course not found');
    }

    return { success: true };
  }

  async validateCourseExists(courseId: string): Promise<boolean> {
    const course = await this.courseModel.findById(courseId);
    return !!course;
  }
}
