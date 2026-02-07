# Edugram - Social Learning Platform

A modern social learning platform for educational content, networking, and community building.

## Features

- **Feed** - Browse educational posts and stories from instructors
- **Explore** - Discover new learning topics and practice materials
- **Profile** - View and manage user profiles
- **Chat** - Direct messaging with other users
- **Stories** - Short-form educational content
- **Practice** - Interactive learning carousel

## Tech Stack

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Fast build tool
- **TailwindCSS** - Styling
- **Radix UI** - Component library
- **Node.js Express** - Backend server

## Getting Started

### Install Dependencies
```bash
npm install
```

### Development
```bash
npm run dev
```

### Build
```bash
npm run build
```

### Preview Build
```bash
npm run preview
```

## Project Structure

- `/src/components` - React components (Feed, Profile, Chat, etc.)
- `/src/components/ui` - Reusable UI components
- `/src/data` - Mock data
- `/src/services` - API/content services
- `/src/types` - TypeScript type definitions
- `/public/images` - Static assets
- `/server` - Backend Express server
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
