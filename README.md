# Audio Norm Frontend

This project is a React application that implements a light/dark mode toggle feature. It provides a user-friendly interface for audio normalization tasks, with a clean and modern design.

## Features

- Light/Dark mode toggle with custom dark colors
- User authentication (Login/Register)
- Responsive layout with sidebar navigation
- Modular component structure
- Context API for theme management
- Custom Tailwind CSS configuration
- TypeScript support

## Project Structure

```
audio-norm-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Header.tsx
│   │   ├── Layout.tsx
│   │   ├── Login.tsx
│   │   ├── Register.tsx
│   │   └── ThemeToggle.tsx
│   ├── contexts/
│   │   └── ThemeContext.tsx
│   ├── hooks/
│   │   └── useTheme.ts
│   ├── App.tsx
│   ├── index.css
│   ├── index.tsx
│   └── react-app-env.d.ts
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling
- **Heroicons** for icons
- **PostCSS** for CSS processing
- **Create React App** as the build tool

## Theme Configuration

The application uses a custom dark mode theme with:
- Background: `#000000` (pure black)
- Sidebar/Header: `#1A1A1A` (dark gray)
- Primary color: `#89A4E7` (blue)

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd audio-norm-frontend
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

## Usage

To start the development server:
```bash
npm start
```

Open your browser and go to `http://localhost:3000` to view the application.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## Components Overview

- **App.tsx** - Main application component with routing logic
- **Header.tsx** - Top navigation with login button and theme toggle
- **Layout.tsx** - Base layout wrapper component
- **Login.tsx** - User login form with Google authentication option
- **Register.tsx** - User registration form
- **ThemeToggle.tsx** - Dark/light mode toggle button
- **ThemeContext.tsx** - Context provider for theme management
- **useTheme.ts** - Custom hook for accessing theme context

## Features in Detail

### Navigation
- Sidebar with Upload file, Library, and Feedback options
- Fixed header with AudioNorm branding
- Responsive design for different screen sizes

### Authentication
- Login and registration forms
- Google authentication integration (UI ready)
- Form validation and state management

### Theme System
- System-wide dark/light mode toggle
- Persistent theme state using React Context
- Custom color scheme with Tailwind CSS

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.