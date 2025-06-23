# Audio Norm Frontend

This project is a React application that implements a light/dark mode toggle feature. It provides a user-friendly interface for audio normalization tasks, with a clean and modern design.

## Features

- Light/Dark mode toggle
- Responsive layout
- Modular component structure
- Context API for theme management

## Project Structure

```
audio-norm-frontend
├── src
│   ├── components
│   │   ├── Header
│   │   │   └── Header.tsx
│   │   ├── ThemeToggle
│   │   │   └── ThemeToggle.tsx
│   │   └── Layout
│   │       └── Layout.tsx
│   ├── contexts
│   │   └── ThemeContext.tsx
│   ├── hooks
│   │   └── useTheme.ts
│   ├── styles
│   │   ├── globals.css
│   │   └── themes.css
│   ├── App.tsx
│   ├── App.css
│   ├── index.tsx
│   └── index.css
├── public
│   └── index.html
├── package.json
├── tsconfig.json
└── README.md
```

## Installation

1. Clone the repository:
   ```
   git clone <repository-url>
   ```
2. Navigate to the project directory:
   ```
   cd audio-norm-frontend
   ```
3. Install dependencies:
   ```
   npm install
   ```

## Usage

To start the development server, run:
```
npm start
```

Open your browser and go to `http://localhost:3000` to view the application.

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the MIT License. See the LICENSE file for details.