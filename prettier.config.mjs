export default {
    singleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    semi: true,
    tabWidth: 4,
    printWidth: 120,
    endOfLine: "auto",

    plugins: ["@trivago/prettier-plugin-sort-imports"],
    importOrder: [String.raw`^\.\./`, String.raw`^\./`],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderParserPlugins: ["typescript", "decorators-legacy"],
};
