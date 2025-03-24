import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import { FastifyAdapter, NestFastifyApplication } from "@nestjs/platform-fastify";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

import { AppModule } from "./app.module";

async function bootstrap() {
    const app = await NestFactory.create<NestFastifyApplication>(AppModule, new FastifyAdapter());

    const config = new DocumentBuilder()
        .setTitle("KNTista-api")
        .setDescription("Backend for the KNTista project")
        .setVersion("0.0.2")
        .build();
    const documentFactory = () => SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("docs", app, documentFactory);

    const configService = app.get(ConfigService);
    const port = configService.get<number>("web.port")!;
    await app.listen(port, "0.0.0.0");
}

void bootstrap();
