import { IsEmail, IsString, Matches, MaxLength, MinLength } from 'class-validator';
import { Match } from '../../common/validators/match.validator';

export class RegisterDto {
  @IsString()
  @MaxLength(255)
  name!: string;

  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(12)
  @Matches(/(?=.*[a-z])(?=.*[A-Z])(?=.*\d).+/, {
    message: 'password must contain uppercase, lowercase and number',
  })
  password!: string;

  @IsString()
  @Match<RegisterDto>('password', { message: 'password confirmation does not match' })
  password_confirmation!: string;
}
