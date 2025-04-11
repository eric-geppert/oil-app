# Oil App Frontend

This is the frontend application for the Oil App, built with React and Bootstrap.

## Features

- Property Management
- Company Management
- Transaction Tracking
- Company Ownership Management
- Responsive Design
- Modern UI/UX

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)

## Installation

1. Navigate to the frontend directory:

```bash
cd src/frontend
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Available Scripts

- `npm start`: Runs the app in development mode
- `npm test`: Launches the test runner
- `npm run build`: Builds the app for production
- `npm run eject`: Ejects from Create React App

## Project Structure

```
src/
  ├── components/         # React components
  │   ├── Properties.js
  │   ├── Companies.js
  │   ├── Transactions.js
  │   └── CompanyOwnership.js
  ├── App.js             # Main application component
  ├── index.js           # Application entry point
  ├── index.css          # Global styles
  └── reportWebVitals.js # Performance monitoring
```

## API Integration

The frontend communicates with the backend API endpoints:

- `/api/properties`: Property management
- `/api/companies`: Company management
- `/api/transactions`: Transaction tracking
- `/api/company-ownership`: Company ownership management

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License.
