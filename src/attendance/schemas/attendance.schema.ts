import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type AttendanceDocument = HydratedDocument<Attendance>;

export enum AttendanceStatus {
  PRESENT = 'present',
  ABSENT = 'absent',
  LATE = 'late',
  EXCUSED = 'excused',
}

@Schema({ timestamps: true })
export class Attendance {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'ClassSession',
    default: null,
    index: true,
  })
  classSessionId?: MongooseSchema.Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'Course', required: true })
  courseId: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  studentId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  classDate: Date;

  @Prop({
    required: true,
    enum: AttendanceStatus,
    default: AttendanceStatus.ABSENT,
  })
  status: AttendanceStatus;

  @Prop({ type: String, default: null })
  remarks?: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  recordedBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: Number, default: null })
  sessionNumber?: number;
}

export const AttendanceSchema = SchemaFactory.createForClass(Attendance);

AttendanceSchema.index(
  { classSessionId: 1, studentId: 1 },
  {
    unique: true,
    partialFilterExpression: { classSessionId: { $exists: true, $ne: null } },
  },
);

AttendanceSchema.index(
  { courseId: 1, studentId: 1, classDate: 1 },
  { unique: true, partialFilterExpression: { classSessionId: null } },
);
