# Product Context

This file provides a high-level overview of the project and the expected product that will be created. Initially it is based upon projectBrief.md (if provided) and all other available project-related information in the working directory. This file is intended to be updated as the project evolves, and should be used to inform all other modes of the project's goals and context.
2025-05-02 17:37:30 - Log of updates made will be appended as footnotes to the end of this file.
2025-05-03 01:45:35 - Added information about automated publishing workflow.

-

## Project Goal

- This appears to be a React application with authentication capabilities, using token-based authentication with refresh token functionality.
- The project implements a cookie-based authentication system for React applications, providing components and hooks for handling authentication workflows.

## Key Features

- Token-based authentication with refresh token functionality
- LocalStorage persistence for authentication state
- Authentication components (Auth, AuthModal, LogoutModal)
- Custom hooks for token refresh
- State management for authentication
- Automated NPM package publishing pipeline with version change detection

## Overall Architecture

- React frontend application with authentication components
- Redux toolkit for state management (authSlice)
- Custom hooks for authentication logic
- LocalStorage for token persistence
- GitHub Actions workflow for CI/CD pipeline:
  - Automated validation (linting, type-checking, testing)
  - Automated building and packaging
  - Automated version tracking via Git tags
  - Automated release creation with changelog generation
  - Automated NPM publishing
