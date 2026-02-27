import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;
export type UserRole = 'admin' | 'teacher' | 'student';

@Schema({ timestamps: true })
export class User {
    @Prop({
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true,
    })
    email: string;

    @Prop({ required: true })
    fullName: string;

    @Prop({ required: true, select: false })
    passwordHash: string;

    @Prop({
        required: true,
        enum: ['admin', 'teacher', 'student'],
        default: 'student',
    })
    role: UserRole;

    @Prop({ type: String, default: null })
    studentId?: string; // For students

    @Prop({ type: String, default: null })
    department?: string;

    @Prop({ type: String, default: null })
    facultyName?: string;

    @Prop({ type: Number, default: null })
    tableId?: number; // For student schedules (1-10)

    @Prop({ type: [String], default: [] })
    teachingCourseIds?: string[]; // For teachers (List of Course IDs)

    @Prop({ type: String, select: false, default: null })
    refreshTokenHash?: string | null;

    @Prop({ type: Boolean, default: true })
    isActive: boolean;
}

export const UserSchema = SchemaFactory.createForClass(User);
