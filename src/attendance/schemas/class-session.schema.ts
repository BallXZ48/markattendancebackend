import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type ClassSessionDocument = HydratedDocument<ClassSession>;

@Schema({ timestamps: true })
export class ClassSession {
  @Prop({
    type: MongooseSchema.Types.ObjectId,
    ref: 'Course',
    required: true,
    index: true,
  })
  courseId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  title: string;

  @Prop({ required: true, index: true })
  scheduledStart: Date;

  @Prop({ required: true })
  scheduledEnd: Date;

  @Prop({ type: Boolean, default: false, index: true })
  isAttendanceOpen: boolean;

  @Prop({ type: Date, default: null })
  attendanceOpenedAt?: Date | null;

  @Prop({ type: Date, default: null })
  attendanceClosedAt?: Date | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  createdBy: MongooseSchema.Types.ObjectId;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  openedBy?: MongooseSchema.Types.ObjectId | null;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', default: null })
  closedBy?: MongooseSchema.Types.ObjectId | null;
}

export const ClassSessionSchema = SchemaFactory.createForClass(ClassSession);
ClassSessionSchema.index({ courseId: 1, scheduledStart: 1 }, { unique: true });
