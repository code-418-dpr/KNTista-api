import { Module } from "@nestjs/common";

import { ActivityModule } from "./activity/activity.module";
import { AuthModule } from "./auth/auth.module";

@Module({
    imports: [AuthModule, ActivityModule],
})
export class AppModule {}
