import { defineConfig } from '@hey-api/openapi-ts'

export default defineConfig({
  input: './api/openapi.yaml',
  output: {
    format: 'prettier',
    path: './src/client'
  },
  types: {
    enums: 'typescript'
  }
})
