import stylistic from '@stylistic/eslint-plugin'
import perfectionist from 'eslint-plugin-perfectionist'
import { defineConfig } from 'eslint/config'
import ts from 'typescript-eslint'

export default defineConfig(
  {
    files: ['**/*.ts'],
  },
  {
    ignores: ['**/dist/**'],
  },
  stylistic.configs.recommended,
  perfectionist.configs['recommended-natural'],
  ts.configs.recommendedTypeChecked,
  ts.configs.stylisticTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
      },
    },
  },
)
