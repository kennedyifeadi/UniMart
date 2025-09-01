import { getModelForClass, prop, modelOptions, pre } from '@typegoose/typegoose';
import { Role } from '../interfaces/Role';
import * as argon2 from 'argon2';
import { TimeStamps } from '@typegoose/typegoose/lib/defaultClasses';

@modelOptions({ schemaOptions: { timestamps: true } })
@pre<User>('save', async function (next) {
  if (this.isModified('passwordHash')) {
    this.passwordHash = await argon2.hash(this.passwordHash);
  }
  if (this.isModified('securityAnswerHash')) {
    this.securityAnswerHash = await argon2.hash(this.securityAnswerHash);
  }
  next();
})
export class User extends TimeStamps {
  public _id!: string;

  @prop({ required: true, unique: true, trim: true, lowercase: true })
  public email!: string;

  @prop({ required: true })
  public passwordHash!: string;

  @prop()
  public googleId?: string;

  @prop({ required: true, enum: Role })
  public role!: Role;

  @prop({ required: true })
  public securityQuestion!: string;

  @prop({ required: true })
  public securityAnswerHash!: string;

  @prop()
  public phone?: string;

  @prop()
  public eduEmail?: string;

  @prop({ default: false })
  public eduEmailVerified?: boolean;

  public async comparePassword(password: string): Promise<boolean> {
    return argon2.verify(this.passwordHash, password);
  }

  public async compareSecurityAnswer(answer: string): Promise<boolean> {
    return argon2.verify(this.securityAnswerHash, answer);
  }
}

const UserModel = getModelForClass(User);

export default UserModel;
