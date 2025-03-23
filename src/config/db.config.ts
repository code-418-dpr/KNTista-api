import { registerAs } from "@nestjs/config";
import Joi from "joi";

const schema = Joi.object({
    host: Joi.string().required(),
    port: Joi.number().default(5432),
    db: Joi.string().required(),
    user: Joi.string().required(),
    password: Joi.string().required(),
});

export default registerAs("db", () => {
    const values = {
        host: process.env.POSTGRES_HOST,
        port: process.env.POSTGRES_PORT,
        db: process.env.POSTGRES_DB,
        user: process.env.POSTGRES_USER,
        password: process.env.POSTGRES_PASSWORD,
    };

    const { error } = schema.validate(values, { abortEarly: false });
    if (error) {
        throw new Error(error.message);
    }

    return values;
});
