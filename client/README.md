# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type aware lint rules:

- Configure the top-level `parserOptions` property like this:

```js
export default tseslint.config({
  languageOptions: {
    // other options...
    parserOptions: {
      project: ['./tsconfig.node.json', './tsconfig.app.json'],
      tsconfigRootDir: import.meta.dirname,
    },
  },
})
```

- Replace `tseslint.configs.recommended` to `tseslint.configs.recommendedTypeChecked` or `tseslint.configs.strictTypeChecked`
- Optionally add `...tseslint.configs.stylisticTypeChecked`
- Install [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react) and update the config:

```js
// eslint.config.js
import react from 'eslint-plugin-react'

export default tseslint.config({
  // Set the react version
  settings: { react: { version: '18.3' } },
  plugins: {
    // Add the react plugin
    react,
  },
  rules: {
    // other rules...
    // Enable its recommended rules
    ...react.configs.recommended.rules,
    ...react.configs['jsx-runtime'].rules,
  },
})
```
## Project Structure

This project follows a layered architecture pattern:

### Components (`/components`)
- Presentational components focused on UI
- Receive data through props
- Handle styling and layout
- No business logic or data fetching

### Containers (`/containers`)
- Smart components that manage data and state
- Connect to data sources/hooks
- Pass data down to views/components
- Handle business logic

### Views (`/views`)
- Compose multiple components
- Handle loading/error states
- Manage UI-specific logic
- Bridge between containers and components

### Pages (`/pages`)
- Map to routes
- Handle URL parameters
- Implement layouts
- Orchestrate containers and views

### App (`App.tsx`)
- Root component
- Route configuration
- Global providers/context
- Application structure

## Testing

This project uses Vitest for testing. Run the tests using:

```bash
npm test               # Run tests in watch mode
npm test -- --ui       # Run tests with UI
npm test -- --run      # Run tests once
npm run coverage       # Run coverage
```

We recommend using the [Vitest](https://marketplace.visualstudio.com/items?itemName=vitest.explorer) extension for Visual Studio Code to enhance your testing experience.
