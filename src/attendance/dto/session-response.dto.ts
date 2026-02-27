// src/attendance/dto/session-response.dto.ts
export class CourseBriefDto {
  courseCode: string;
  courseName: string;
}

export class SessionResponseDto {
  _id: string;
  title: string;
  scheduledStart: Date;
  scheduledEnd: Date;
  isAttendanceOpen: boolean;
  courseId: CourseBriefDto;
  studentCount: number;
}