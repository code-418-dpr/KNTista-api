import { includeIgnoreFile } from "@eslint/compat";
import eslint from "@eslint/js";
import path from "path";
import tseslint from "typescript-eslint";

const gitignorePath = path.resolve(import.meta.dirname, ".gitignore");

export default tseslint.config(
    includeIgnoreFile(gitignorePath),

    {
        files: ["**/*.js"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
        },
        extends: [eslint.configs.recommended],
    },

    {
        files: ["**/*.mjs"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "module",
        },
        extends: [eslint.configs.recommended],
    },

    {
        files: ["**/*.ts"],
        languageOptions: {
            ecmaVersion: "latest",
            sourceType: "commonjs",
            parserOptions: {
                project: true,
                tsconfigRootDir: import.meta.dirname,
            },
        },
        extends: [
            eslint.configs.recommended,
            tseslint.configs.strictTypeChecked,
            tseslint.configs.stylisticTypeChecked,
        ],
        rules: {
            "@typescript-eslint/restrict-template-expressions": "off",
            "@typescript-eslint/no-non-null-assertion": "off",
            "@typescript-eslint/no-extraneous-class": "off",
        },
    },
);
