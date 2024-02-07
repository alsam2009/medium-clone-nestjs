import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { verify } from 'jsonwebtoken';
import { JWT_SECRET } from 'src/config';
import { expressRequestInterface } from 'src/types/expressRequest.interface';
import { UserService } from 'src/user/user.service';

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  constructor(private readonly userService: UserService) {}
  async use(req: expressRequestInterface, res: Response, next: NextFunction) {
    if (!req.headers.authorization) {
      req.user = null;
      next();
      return;
    }
    const token = req.headers.authorization.split(' ')[1];
    try {
      const decode = verify(token, JWT_SECRET);
      if (typeof decode === 'string') {
        throw new Error('Invalid token');
      }
      const user = await this.userService.findById(decode.id);
      req.user = user;
    } catch (error) {
      req.user = null;
    }
    next();
  }
}
