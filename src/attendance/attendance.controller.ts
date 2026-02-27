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
import { AttendanceService } from './attendance.service';
import {
  CreateAttendanceDto,
  UpdateAttendanceDto,
  BulkAttendanceDto,
  GetAttendanceReportDto,
  CreateClassSessionDto,
  ListClassSessionsDto,
  MarkSessionAttendanceDto,
} from './dto/attendance.dto';
import { AccessTokenGuard } from '../auth/guards/access-token.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles, CurrentUser } from '../auth/decorators';

@Controller('attendance')
@UseGuards(AccessTokenGuard, RolesGuard)
export class AttendanceController {
  constructor(private readonly attendanceService: AttendanceService) {}

  private getCurrentUserId(user: any): string {
    return user?.userId || user?.sub;
  }

  @Post('sessions')
  @Roles('admin')
  @HttpCode(HttpStatus.CREATED)
  async createClassSession(
    @Body() createClassSessionDto: CreateClassSessionDto,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.createClassSession(
      createClassSessionDto,
      this.getCurrentUserId(user),
    );
  }

  @Get('sessions/admin')
  @Roles('admin')
  async listClassSessionsForAdmin(@Query() query: ListClassSessionsDto) {
    return this.attendanceService.listSessionsForAdmin(query);
  }

  @Get('sessions/teacher')
  @Roles('teacher')
  async listClassSessionsForTeacher(
    @CurrentUser() user: any,
    @Query() query: ListClassSessionsDto,
  ) {
    return this.attendanceService.listSessionsForTeacher(
      this.getCurrentUserId(user),
      query,
    );
  }

  @Get('sessions/student')
  @Roles('student')
  async listClassSessionsForStudent(
    @CurrentUser() user: any,
    @Query() query: ListClassSessionsDto,
  ) {
    return this.attendanceService.listSessionsForStudent(
      this.getCurrentUserId(user),
      query,
    );
  }

  @Post('sessions/:sessionId/open')
  @Roles('teacher')
  @HttpCode(HttpStatus.OK)
  async openSession(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.openSession(
      sessionId,
      this.getCurrentUserId(user),
    );
  }

  @Post('sessions/:sessionId/close')
  @Roles('teacher')
  @HttpCode(HttpStatus.OK)
  async closeSession(
    @Param('sessionId') sessionId: string,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.closeSession(
      sessionId,
      this.getCurrentUserId(user),
    );
  }

  @Post('sessions/:sessionId/mark')
  @Roles('student')
  @HttpCode(HttpStatus.CREATED)
  async markOpenSessionAttendance(
    @Param('sessionId') sessionId: string,
    @Body() markDto: MarkSessionAttendanceDto,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.markAttendanceForOpenSession(
      sessionId,
      this.getCurrentUserId(user),
      markDto,
    );
  }

  // 👇 จุดที่ 1: เพิ่ม 'student' เข้าไปใน Roles
  @Post()
  @Roles('admin', 'teacher', 'student') 
  @HttpCode(HttpStatus.CREATED)
  async recordAttendance(
    @Body() createAttendanceDto: CreateAttendanceDto,
    @CurrentUser() user: any,
  ) {
    const currentUserId = this.getCurrentUserId(user);
    
    // 👇 จุดที่ 2: ป้องกันนักศึกษาเช็คชื่อให้เพื่อน
    // ถ้ายูสเซอร์ที่ล็อกอินเข้ามาเป็น student ให้บังคับใช้ ID ตัวเองเสมอ
    if (user?.role === 'student' || !['admin', 'teacher'].includes(user?.role)) {
      createAttendanceDto.studentId = currentUserId;
    }

    return this.attendanceService.recordAttendance(
      createAttendanceDto,
      currentUserId,
    );
  }

  @Post('bulk')
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.CREATED)
  async recordBulkAttendance(
    @Body() bulkAttendanceDto: BulkAttendanceDto,
    @CurrentUser() user: any,
  ) {
    return this.attendanceService.recordBulkAttendance(
      bulkAttendanceDto,
      this.getCurrentUserId(user),
    );
  }

  @Get('course/:courseId')
  @Roles('admin', 'teacher', 'student')
  async getAttendanceByCourse(@Param('courseId') courseId: string) {
    return this.attendanceService.findByCourse(courseId);
  }

  @Get('student/:studentId')
  @Roles('admin', 'teacher', 'student')
  async getAttendanceByStudent(@Param('studentId') studentId: string) {
    return this.attendanceService.findByStudent(studentId);
  }

  @Get('student/:studentId/course/:courseId')
  @Roles('admin', 'teacher', 'student')
  async getStudentCourseAttendance(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.attendanceService.findByStudentAndCourse(studentId, courseId);
  }

  @Get('stats/student/:studentId/course/:courseId')
  @Roles('admin', 'teacher', 'student')
  async getStudentAttendanceStats(
    @Param('studentId') studentId: string,
    @Param('courseId') courseId: string,
  ) {
    return this.attendanceService.getStudentAttendanceStats(
      studentId,
      courseId,
    );
  }

  @Get('report')
  @Roles('admin', 'teacher')
  async getAttendanceReport(@Query() reportDto: GetAttendanceReportDto) {
    return this.attendanceService.getAttendanceReport(reportDto);
  }

  @Get(':id')
  @Roles('admin', 'teacher', 'student')
  async getAttendanceById(@Param('id') id: string) {
    return this.attendanceService.findById(id);
  }

  @Put(':id')
  @Roles('admin', 'teacher')
  async updateAttendance(
    @Param('id') id: string,
    @Body() updateAttendanceDto: UpdateAttendanceDto,
  ) {
    return this.attendanceService.update(id, updateAttendanceDto);
  }

  @Delete(':id')
  @Roles('admin', 'teacher')
  @HttpCode(HttpStatus.OK)
  async deleteAttendance(@Param('id') id: string) {
    return this.attendanceService.delete(id);
  }
}