import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { JournalsController } from './journals.controller';
import { JournalsService } from './journals.service';
import { Journal, JournalSchema } from './journal.schema';
import { AuditLogsModule } from '../audit-logs/audit-logs.module';

@Module({
    imports: [
        MongooseModule.forFeature([{ name: Journal.name, schema: JournalSchema }]),
        AuditLogsModule,
    ],
    controllers: [JournalsController],
    providers: [JournalsService],
    exports: [JournalsService],
})
export class JournalsModule { }
