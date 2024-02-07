import { UserType } from 'src/types/user.Type';

export interface UserResponseInterface {
  user: UserType & { token: string };
}
