import globals from "globals";
import tseslint from "typescript-eslint";
import reactRecommended from "eslint-plugin-react/configs/recommended.js";
import eslintConfigPrettier from "eslint-config-prettier";

export default tseslint.config(
    {
        ignores: ["dist/", "docs/", ".eslintrc.old.cjs", "eslint.config.js"],
    },
    ...tseslint.configs.recommended,
    {
        ...reactRecommended,
        files: ["**/*.{js,jsx,ts,tsx}"],
        languageOptions: {
            ...reactRecommended.languageOptions,
            globals: {
                ...globals.browser,
            },
        },
        settings: {
            react: {
                version: "detect",
            },
        },
        rules: {
            ...reactRecommended.rules,
            "react/react-in-jsx-scope": "off",
        }
    },
    eslintConfigPrettier
);
