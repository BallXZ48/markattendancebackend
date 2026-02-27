import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema } from 'mongoose';

export type CourseDocument = HydratedDocument<Course>;

@Schema({ timestamps: true })
export class Course {
  @Prop({ required: true, unique: true })
  courseCode: string;

  @Prop({ required: true })
  courseName: string;

  @Prop({ required: false, default: '' })
  description: string;

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: 'User', required: true })
  teacherId: MongooseSchema.Types.ObjectId;

  @Prop({ required: true })
  department: string;

  @Prop({ required: true })
  roomLocation: string;

  @Prop({ required: true })
  semester: number;

  @Prop({ required: true })
  academicYear: number;

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: 'User', default: [] })
  studentIds: MongooseSchema.Types.ObjectId[];

  @Prop({ required: true })
  totalClasses: number;

  @Prop({ required: true })
  credits: number;

  @Prop({ type: Boolean, default: true })
  isActive: boolean;
}

export const CourseSchema = SchemaFactory.createForClass(Course);
