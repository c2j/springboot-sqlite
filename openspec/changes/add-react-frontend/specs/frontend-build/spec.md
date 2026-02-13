## ADDED Requirements

### Requirement: Package manager
The frontend SHALL use npm as the package manager.

#### Scenario: Dependencies installed
- **WHEN** running `npm install` in the frontend directory
- **THEN** all dependencies from `package.json` SHALL be installed to `node_modules/`

### Requirement: Development server
The frontend SHALL include a development server configuration.

#### Scenario: Dev server started
- **WHEN** running `npm run dev`
- **THEN** a development server SHALL start on a configurable port (default 5173)

### Requirement: Proxy configuration
The development server SHALL proxy API requests to the backend.

#### Scenario: API request proxied
- **WHEN** the frontend makes a request to `/api/*` during development
- **THEN** the request SHALL be forwarded to the Spring Boot backend (e.g., `http://localhost:8080`)

### Requirement: Production build
The frontend SHALL have a production build script that outputs optimized static files.

#### Scenario: Production build executed
- **WHEN** running `npm run build`
- **THEN** optimized static files SHALL be output to `dist/` directory

### Requirement: Type checking
The build process SHALL include TypeScript type checking.

#### Scenario: Type error during build
- **WHEN** there are TypeScript type errors in the code
- **THEN** the build SHALL fail and display error messages

### Requirement: Static file integration
The production build output SHALL be integrated with Spring Boot.

#### Scenario: Static files copied
- **WHEN** the build is complete
- **THEN** the contents of `dist/` SHALL be available at `src/main/resources/static/` (or equivalent)

#### Scenario: SPA routing support
- **WHEN** accessing a frontend route directly (e.g., `/products/123`)
- **THEN** Spring Boot SHALL serve `index.html` and the frontend router SHALL handle the route

### Requirement: Environment configuration
The frontend SHALL support environment-specific configuration.

#### Scenario: API base URL configuration
- **WHEN** building for different environments
- **THEN** the API base URL SHALL be configurable via environment variables or config files

### Requirement: Linting
The frontend SHALL have ESLint configured for code quality.

#### Scenario: Lint check
- **WHEN** running `npm run lint`
- **THEN** ESLint SHALL check all TypeScript/React files for code style violations

### Requirement: Code formatting
The frontend SHALL have Prettier configured for consistent code formatting.

#### Scenario: Format check
- **WHEN** running `npm run format`
- **THEN** Prettier SHALL format all source files according to the configuration

### Requirement: Maven integration (optional)
The frontend build MAY be integrated into the Maven build lifecycle.

#### Scenario: Maven build includes frontend
- **WHEN** running Maven build
- **THEN** the frontend SHALL be built automatically before packaging the JAR

### Requirement: Node.js version requirement
The frontend SHALL specify the required Node.js version.

#### Scenario: Version check
- **WHEN** checking `package.json` or `.nvmrc`
- **THEN** the required Node.js version SHALL be documented (minimum Node.js 18)
