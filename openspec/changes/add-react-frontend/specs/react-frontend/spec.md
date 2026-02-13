## ADDED Requirements

### Requirement: Project initialization
The React frontend project SHALL be initialized with Vite, TypeScript, and React 18+.

#### Scenario: Project structure created
- **WHEN** the project is initialized
- **THEN** the project SHALL have the directory structure: `src/frontend/react/` with `src/`, `public/`, `package.json`

### Requirement: UI component library
The frontend SHALL use Ant Design 5.x as the primary UI component library.

#### Scenario: Ant Design installed
- **WHEN** dependencies are installed
- **THEN** `antd` package SHALL be available and components SHALL render correctly

### Requirement: Routing
The frontend SHALL implement client-side routing using React Router v6.

#### Scenario: Navigation between pages
- **WHEN** user clicks a navigation link
- **THEN** the URL SHALL update and the corresponding page component SHALL render without full page reload

#### Scenario: Route parameters
- **WHEN** user navigates to a route with parameters (e.g., `/products/123`)
- **THEN** the component SHALL receive and use the parameter value

### Requirement: Page components
The frontend SHALL implement the following page components:
- Login page (`/login`)
- Register page (`/register`)
- Product list page (`/products`)
- Product detail page (`/products/:id`)
- Shopping cart page (`/cart`)
- Order list page (`/orders`)
- Order detail page (`/orders/:id`)

#### Scenario: Page rendering
- **WHEN** user navigates to any defined route
- **THEN** the corresponding page component SHALL render correctly

### Requirement: Responsive design
The frontend SHALL be responsive and work on desktop and tablet devices.

#### Scenario: Viewport adaptation
- **WHEN** the browser viewport is resized
- **THEN** the layout SHALL adapt appropriately without horizontal scrolling on mobile devices

### Requirement: Authentication state
The frontend SHALL maintain user authentication state using React Context.

#### Scenario: Login state persisted
- **WHEN** user successfully logs in
- **THEN** the authentication state SHALL be stored and available across all components

#### Scenario: Logout
- **WHEN** user clicks logout
- **THEN** the authentication state SHALL be cleared and user SHALL be redirected to login page

### Requirement: Protected routes
The frontend SHALL protect routes that require authentication.

#### Scenario: Unauthenticated access attempt
- **WHEN** an unauthenticated user tries to access a protected route
- **THEN** the user SHALL be redirected to the login page

### Requirement: Image display
The frontend SHALL display product images retrieved from the backend API.

#### Scenario: Product image loaded
- **WHEN** a product with an image is displayed
- **THEN** the image SHALL be fetched from `/stocks/{code}/image` and rendered

### Requirement: Form validation
The frontend SHALL validate form inputs before submission.

#### Scenario: Invalid form submission
- **WHEN** user submits a form with invalid data
- **THEN** validation errors SHALL be displayed next to the corresponding fields

### Requirement: Loading states
The frontend SHALL display loading indicators during asynchronous operations.

#### Scenario: Data fetching
- **WHEN** the frontend is fetching data from the API
- **THEN** a loading indicator SHALL be displayed until data is loaded or error occurs
