## ADDED Requirements

### Requirement: HTTP client configuration
The frontend SHALL use Axios as the HTTP client for all API communications.

#### Scenario: Axios instance created
- **WHEN** the API client module is initialized
- **THEN** an Axios instance SHALL be configured with base URL and default headers

### Requirement: JWT token injection
The API client SHALL automatically inject the JWT Bearer token into request headers.

#### Scenario: Authenticated request
- **WHEN** making an API request and user is authenticated
- **THEN** the request SHALL include an `Authorization` header with format `Bearer {token}`

#### Scenario: Token not available
- **WHEN** making a request to a protected endpoint without a token
- **THEN** the request SHALL be made without the Authorization header and the API SHALL return 401

### Requirement: Error handling
The API client SHALL handle HTTP errors and provide meaningful error messages.

#### Scenario: 401 Unauthorized
- **WHEN** the API returns 401 status
- **THEN** the user SHALL be redirected to the login page

#### Scenario: 403 Forbidden
- **WHEN** the API returns 403 status
- **THEN** an error message SHALL be displayed indicating insufficient permissions

#### Scenario: 404 Not Found
- **WHEN** the API returns 404 status
- **THEN** a "resource not found" message SHALL be displayed

#### Scenario: Network error
- **WHEN** a network error occurs
- **THEN** an appropriate error message SHALL be displayed to the user

### Requirement: API endpoint functions
The API client SHALL provide typed functions for all backend endpoints:

#### Authentication endpoints
- `POST /users/login` - User login
- `POST /users/clients/signup` - Client registration
- `POST /users/employees/signup` - Employee registration

#### Product endpoints
- `GET /stocks` - List products with pagination and search
- `GET /stocks/{code}` - Get product details
- `POST /stocks` - Create product (multipart/form-data)
- `PUT /stocks/{code}` - Update product (multipart/form-data)
- `DELETE /stocks/{code}` - Delete product
- `GET /stocks/{code}/image` - Get product image

#### Shopping cart endpoints
- `GET /carts` - Get shopping cart
- `POST /carts` - Add product to cart
- `DELETE /carts/{cartId}` - Remove product from cart
- `POST /carts/buy` - Checkout cart

#### Order endpoints
- `GET /orders` - List orders
- `GET /orders/{orderId}/details` - Get order details

#### Lookup endpoints
- `GET /lookup/categories` - List product categories

#### Scenario: API function called
- **WHEN** a component calls an API function
- **THEN** the function SHALL make the correct HTTP request and return typed response data

### Requirement: Request/Response types
All API request and response data SHALL be typed with TypeScript interfaces.

#### Scenario: Type safety
- **WHEN** using API client functions
- **THEN** TypeScript SHALL enforce correct parameter types and provide autocompletion for response data

### Requirement: Data fetching hooks
The frontend SHALL use React Query for server state management.

#### Scenario: Query caching
- **WHEN** data is fetched from the API
- **THEN** React Query SHALL cache the data and return it for subsequent requests within the stale time

#### Scenario: Query invalidation
- **WHEN** a mutation (create/update/delete) is performed
- **THEN** the relevant queries SHALL be invalidated and refetched

#### Scenario: Loading and error states
- **WHEN** using React Query hooks
- **THEN** the hook SHALL provide `isLoading`, `isError`, and `error` states

### Requirement: File upload support
The API client SHALL support multipart/form-data for image uploads.

#### Scenario: Product image upload
- **WHEN** creating or updating a product with an image
- **THEN** the image file SHALL be uploaded as part of a multipart/form-data request
