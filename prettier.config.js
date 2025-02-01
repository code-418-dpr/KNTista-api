import sortImportsPlugin from "@trivago/prettier-plugin-sort-imports";

export default {
    singleQuote: false,
    trailingComma: "all",
    bracketSpacing: true,
    semi: true,
    tabWidth: 4,
    printWidth: 120,
    endOfLine: "auto",

    plugins: [sortImportsPlugin],
    importOrder: [String.raw`^\.\./`, String.raw`^\./`],
    importOrderSeparation: true,
    importOrderSortSpecifiers: true,
    importOrderParserPlugins: ["typescript", "decorators-legacy"],
};
