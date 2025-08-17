# AudioNorm Frontend

AudioNorm Frontend is a modern React application designed to provide an intuitive and efficient interface for audio normalization workflows. The platform enables users to upload, preview, and manage audio files, as well as export normalized versions, all within a responsive and visually appealing UI. The application supports both light and dark themes for optimal user experience.

## Key Features

### Audio File Management
- Drag-and-drop file upload
- Comprehensive audio library with search and filtering
- Preview functionality with play/pause controls for both original and normalized audio
- Individual and bulk export options
- Real-time audio level visualization

### User Experience
- Light/Dark mode toggle with custom color palette
- Secure user authentication (Login/Register)
- Responsive layout with sidebar navigation
- Fixed header and sub-header for streamlined navigation
- Smooth transitions and interactive hover effects

### Technical Highlights
- Modular, maintainable component structure
- Context API for global state management (theme, auth)
- Custom Tailwind CSS configuration
- Full TypeScript support
- Modern React patterns and hooks

## Audio Preview API Integration

AudioNorm Frontend integrates seamlessly with the backend API to provide secure, real-time audio preview functionality. The following endpoints are utilized:

- **Preview Normalized Audio**  
  `GET /audio/preview/{file_id}`
- **Preview Original (Non-Normalized) Audio**  
  `GET /audio/preview/original/{file_id}`

**Authentication:**  
All preview requests require a valid JWT token as a query parameter:

```
http://localhost:8000/audio/preview/{file_id}?token=YOUR_JWT_TOKEN
```

Users can preview both the original and normalized versions of their audio files directly from the Library and AudioPlayer components, ensuring confidence before export.

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

## Getting Started

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

## Component Overview

### Core Components
- **App.tsx** - Main application component with navigation state management
- **Layout.tsx** - Base layout wrapper providing consistent structure
- **Header.tsx** - Top navigation with login button and theme toggle

### Feature Components
- **Upload.tsx** - Drag-and-drop file upload interface with user guide
- **Library.tsx** - Audio library management with:
  - Fixed sub-header with search, sort, and master volume controls
  - Audio file list with metadata display
  - Preview controls with play/pause and progress bars (using the new preview endpoints)
  - Individual and bulk export functionality
  - Hover effects with primary color highlighting
- **Feedback.tsx** - User feedback system with star ratings and comments
- **Login.tsx** - User authentication with Google integration (UI ready)
- **Register.tsx** - User registration with form validation
- **ThemeToggle.tsx** - Dark/light mode toggle with smooth transitions

### Utility Components
- **ThemeContext.tsx** - Context provider for theme state management
- **useTheme.ts** - Custom hook for accessing theme context

## Feature Details

### Audio Processing Workflow
1. **Upload:** Drag-and-drop or click to upload audio files
2. **Library:** View, search, and manage uploaded audio files
3. **Preview:** Instantly listen to both original and normalized audio before export
4. **Export:** Download processed files individually or in bulk

### Navigation
- Sidebar with Upload, Library, and Feedback sections
- Fixed header with AudioNorm branding
- Sub-header in Library view with search and controls
- Fully responsive design for all screen sizes

### Audio Library Features
- **Search:** Filter files by name, artist, or genre
- **Preview:** Built-in audio player with progress tracking for both original and normalized files
- **Volume Control:** Master volume slider for all exports
- **Visual Feedback:** Progress bars showing audio levels
- **Export Options:** Export files individually or in bulk

### Authentication
- Login and registration forms with validation
- Google authentication integration (UI ready)
- Robust form state management with TypeScript

### Theme System
- System-wide dark/light mode toggle
- Persistent theme state using React Context
- Custom color scheme powered by Tailwind CSS
- Smooth transitions and interactive hover effects

### User Experience
- Drag-and-drop file upload
- Real-time search filtering
- Interactive hover effects and color transitions
- Responsive layout for all devices
- Intuitive navigation throughout the application

## Planned Enhancements

- Advanced backend integration for audio processing
- Full user authentication with production-ready API
- Enhanced audio processing algorithms
- Support for additional file formats
- Batch processing and automation features
- User profile and settings management

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.