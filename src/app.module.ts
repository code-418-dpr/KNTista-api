import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";

import { ActivityModule } from "./activity/activity.module";
import { AuthModule } from "./auth/auth.module";
import webConfig from "./config/web.config";

@Module({
    imports: [ConfigModule.forRoot({ load: [webConfig], isGlobal: true }), AuthModule, ActivityModule],
    providers: [ConfigService],
})
export class AppModule {}
