# Audio Norm Frontend

This project is a React application that provides a user-friendly interface for audio normalization tasks. It features a complete audio processing workflow with file upload, library management, preview functionality, and user feedback system, all wrapped in a modern dark/light theme interface.

## Features

- **Audio File Management**
  - Drag-and-drop file upload interface
  - Audio library with search and filtering
  - Preview functionality with play/pause controls
  - Individual and bulk export options
  - Real-time audio level visualization

- **User Interface**
  - Light/Dark mode toggle with custom dark colors
  - User authentication (Login/Register)
  - Responsive layout with sidebar navigation
  - Fixed header with sub-header for library controls
  - Hover effects and smooth transitions

- **Technical Features**
  - Modular component structure
  - Context API for theme management
  - Custom Tailwind CSS configuration
  - TypeScript support throughout
  - Modern React patterns and hooks

## Project Structure

```
audio-norm-frontend/
├── public/
│   └── index.html
├── src/
│   ├── components/
│   │   ├── Feedback.tsx      # User feedback and rating system
│   │   ├── Header.tsx        # Top navigation with login and theme toggle
│   │   ├── Layout.tsx        # Base layout wrapper component
│   │   ├── Library.tsx       # Audio library management with preview
│   │   ├── Login.tsx         # User login form with Google auth
│   │   ├── Register.tsx      # User registration form
│   │   ├── ThemeToggle.tsx   # Dark/light mode toggle button
│   │   └── Upload.tsx        # File upload with drag-and-drop
│   ├── contexts/
│   │   └── ThemeContext.tsx  # Theme state management
│   ├── hooks/
│   │   └── useTheme.ts       # Custom hook for theme access
│   ├── App.tsx               # Main application with navigation logic
│   ├── index.css             # Global styles and Tailwind imports
│   ├── index.tsx             # React application entry point
│   └── react-app-env.d.ts    # TypeScript environment definitions
├── .gitignore
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Technology Stack

- **React 18** with TypeScript
- **Tailwind CSS** for styling with custom dark theme
- **Heroicons** for consistent iconography
- **PostCSS** for CSS processing
- **Create React App** as the build tool

## Theme Configuration

The application uses a custom dark mode theme with:
- Background: `#000000` (pure black)
- Sidebar/Header: `#1A1A1A` (dark gray)
- Primary color: `#89A4E7` (blue)
- Hover states with primary color highlights

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

### Core Components
- **App.tsx** - Main application component with navigation state management
- **Layout.tsx** - Base layout wrapper providing consistent structure
- **Header.tsx** - Top navigation with login button and theme toggle

### Feature Components
- **Upload.tsx** - Drag-and-drop file upload interface with user guide
- **Library.tsx** - Audio library management with:
  - Fixed sub-header with search, sort, and master volume controls
  - Audio file list with metadata display
  - Preview controls with play/pause and progress bars
  - Individual and bulk export functionality
  - Hover effects with primary color highlighting
- **Feedback.tsx** - User feedback system with star ratings and comments
- **Login.tsx** - User authentication with Google integration (UI ready)
- **Register.tsx** - User registration with form validation
- **ThemeToggle.tsx** - Dark/light mode toggle with smooth transitions

### Utility Components
- **ThemeContext.tsx** - Context provider for theme state management
- **useTheme.ts** - Custom hook for accessing theme context

## Features in Detail

### Audio Processing Workflow
1. **Upload**: Drag-and-drop or click to upload audio files
2. **Library**: View, search, and manage uploaded audio files
3. **Preview**: Listen to audio files before processing
4. **Export**: Download processed files individually or in bulk

### Navigation
- Sidebar with Upload file, Library, and Feedback sections
- Fixed header with AudioNorm branding
- Sub-header in Library view with search and controls
- Responsive design for different screen sizes

### Audio Library Features
- **Search**: Filter files by name, artist, or genre
- **Preview**: Built-in audio player with progress tracking
- **Volume Control**: Master volume slider for all exports
- **Visual Feedback**: Progress bars showing audio levels
- **Export Options**: Individual file export or bulk export functionality

### Authentication
- Login and registration forms with validation
- Google authentication integration (UI ready)
- Form state management with TypeScript

### Theme System
- System-wide dark/light mode toggle
- Persistent theme state using React Context
- Custom color scheme with Tailwind CSS
- Smooth transitions and hover effects

### User Experience
- Drag-and-drop file upload
- Real-time search filtering
- Hover effects with color transitions
- Responsive layout adapting to screen size
- Intuitive navigation between sections

## Future Enhancements

- Backend integration for file processing
- User authentication with real API
- Audio processing algorithms
- File format conversion
- Batch processing capabilities
- User profile management

## License

This project is licensed under the MIT License. See the LICENSE file for details.