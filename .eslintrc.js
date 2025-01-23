module.exports = {
    parser: "@typescript-eslint/parser",
    parserOptions: {
        project: "tsconfig.json",
        tsconfigRootDir: __dirname,
        sourceType: "module",
        ecmaVersion: "latest",
    },
    plugins: ["@typescript-eslint/eslint-plugin", "prettier", "import"],
    extends: ["plugin:@typescript-eslint/recommended", "plugin:prettier/recommended", "plugin:import/typescript"],
    root: true,
    env: {
        node: true,
        jest: true,
    },
    rules: {
        curly: ["error", "all"],
        eqeqeq: ["error", "always"],
        "no-unreachable": "error",
        "no-var": "error",
        "@typescript-eslint/no-unused-vars": "error",
        "@typescript-eslint/no-redeclare": "error",
        "@typescript-eslint/explicit-function-return-type": "off",
        "@typescript-eslint/no-explicit-any": "error",
        "@typescript-eslint/prefer-as-const": "error",
        "object-shorthand": ["error", "always"],
        "import/newline-after-import": "error",
        "import/order": [
            "error",
            {
                groups: ["builtin", "external", "internal", "parent", "sibling", "index"],
                "newlines-between": "always",
                alphabetize: {
                    order: "asc",
                    caseInsensitive: true,
                },
            },
        ],
        "sort-imports": [
            "error",
            {
                ignoreCase: false,
                ignoreDeclarationSort: true,
                ignoreMemberSort: false,
                memberSyntaxSortOrder: ["none", "all", "multiple", "single"],
                allowSeparatedGroups: true,
            },
        ],
    },
    overrides: [
        {
            files: ["*.js"],
            parser: "espree",
        },
    ],
};
