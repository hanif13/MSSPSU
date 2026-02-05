import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ArticlesModule } from './modules/articles/articles.module';
import { VideosModule } from './modules/videos/videos.module';
import { JournalsModule } from './modules/journals/journals.module';
import { SalamArticlesModule } from './modules/salam-articles/salam-articles.module';
import { UsersModule } from './modules/users/users.module';
import { CategoriesModule } from './modules/categories/categories.module';
import { StatsModule } from './modules/stats/stats.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';

@Module({
  imports: [
    // Config
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    // MongoDB
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
      inject: [ConfigService],
    }),

    // Feature modules
    ArticlesModule,
    VideosModule,
    JournalsModule,
    SalamArticlesModule,
    UsersModule,
    CategoriesModule,
    StatsModule,
    AuditLogsModule,
  ],
})
export class AppModule { }
