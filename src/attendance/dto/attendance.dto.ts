import {
  IsNotEmpty,
  IsString,
  IsMongoId,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';
import { AttendanceStatus } from '../schemas/attendance.schema'; // เช็ค Path ให้ตรงกับโปรเจกต์คุณด้วยนะครับ

export class CreateAttendanceDto {
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  studentId: string;

  @IsDateString()
  @IsNotEmpty()
  classDate: string;

  @IsEnum(AttendanceStatus)
  @IsNotEmpty()
  status: AttendanceStatus;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  sessionNumber?: number;

  @IsDateString()
  @IsOptional()
  checkInTime?: string;
}

export class UpdateAttendanceDto {
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @IsString()
  @IsOptional()
  remarks?: string;
}

export class BulkAttendanceDto {
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @IsDateString()
  @IsNotEmpty()
  classDate: string;

  @IsArray()
  @IsNotEmpty()
  attendanceRecords: Array<{
    studentId: string;
    status: AttendanceStatus;
    remarks?: string;
  }>;
}

export class GetAttendanceReportDto {
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @IsMongoId()
  @IsOptional()
  studentId?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;
}

export class CreateClassSessionDto {
  @IsMongoId()
  @IsNotEmpty()
  courseId: string;

  @IsString()
  @IsNotEmpty()
  title: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledStart: string;

  @IsDateString()
  @IsNotEmpty()
  scheduledEnd: string;
}

export class ListClassSessionsDto {
  @IsDateString()
  @IsOptional()
  from?: string;

  @IsDateString()
  @IsOptional()
  to?: string;

  @IsMongoId()
  @IsOptional()
  courseId?: string;

  @IsBoolean()
  @IsOptional()
  @Type(() => Boolean)
  isAttendanceOpen?: boolean;
}

export class MarkSessionAttendanceDto {
  @IsEnum(AttendanceStatus)
  @IsOptional()
  status?: AttendanceStatus;

  @IsString()
  @IsOptional()
  remarks?: string;

  @IsDateString()
  @IsOptional()
  checkInTime?: string;
}