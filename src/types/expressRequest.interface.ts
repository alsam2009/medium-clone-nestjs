import { Request } from 'express';
import { UserEntity } from 'src/user/entities/user.entity';

export interface expressRequestInterface extends Request {
  req: Promise<UserEntity>;
  user?: UserEntity;
}
