import { MiddlewareConsumer, Module, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { dataSourceOptions } from './ormconfig';
import { TagsModule } from './tags/tags.module';
import { UserModule } from './user/user.module';
import { AuthMiddleware } from './middlewares/auth.middleware';

@Module({
  imports: [TypeOrmModule.forRoot(dataSourceOptions), TagsModule, UserModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(AuthMiddleware).forRoutes({
      path: '*',
      method: RequestMethod.ALL,
    });
  }
}
