# Agent Guide: Spring Boot + SQLite Ecommerce Demo

## Build & Test Commands

```bash
# Clean and build project
mvn clean package

# Run application (default port: 8080, context path: /ecommerce/api/v1)
mvn spring-boot:run

# Run all tests
mvn test

# Run single test class
mvn test -Dtest=StockServiceTest

# Run specific test method
mvn test -Dtest=StockServiceTest#testGetAllStocksWhenNoFoundStocks

# Format code (uses Eclipse formatter config)
mvn formatter:format

# Build native image with GraalVM
mvn -Pnative native:compile
```

## Project Structure

```
src/main/java/com/demo/sqlite/
├── controller/          # REST endpoints (@RestController)
├── service/             # Service interfaces
│   └── impl/            # Service implementations
├── repository/          # JPA repositories
├── model/
│   ├── entity/          # JPA entities (@Entity)
│   └── dto/             # Request/Response DTOs
│       ├── request/
│       └── response/
├── security/            # JWT, auth filters
├── config/              # Bean configurations
├── exception/           # Custom exceptions
└── utils/               # Utility classes
```

## Code Style Guidelines

### Naming Conventions

| Type                | Pattern                          | Example                    |
|---------------------|----------------------------------|----------------------------|
| Controllers         | PascalCase + "Controller"        | StockController, OrderController |
| Services            | Interface: "Service", Impl: "ServiceImpl" | StockService, StockServiceImpl |
| Repositories        | PascalCase + "Repository"        | StockRepository, OrderRepository |
| Entities            | PascalCase                       | Stock, Category, Order     |
| DTOs                | PascalCase + "DTO"               | StockResponseDTO, LoginRequestDTO |
| DTO static factory  | `static from(Entity...)`         | StockResponseDTO.from(stock, category) |
| Constants           | UPPER_SNAKE_CASE                 | SEARCH_PHRASE, pagination  |
| Test classes        | PascalCase + "Test"              | StockServiceTest          |
| Test methods        | `test{Scenario}{Expected}`       | testGetAllStocksWhenNoFoundStocks |

### Entity & DTO Style

**Entities** (JPA):
- Use Lombok: `@Data @Builder @NoArgsConstructor @AllArgsConstructor`
- Add `@Entity(name = "table_name")` with explicit table name
- Use `@JsonInclude(JsonInclude.Include.NON_NULL)` for JSON responses
- Include `@JsonIgnore` on sensitive fields (e.g., images)
- For multi-constructor scenarios, add a custom constructor after Lombok annotations

**DTOs**:
- Include `@JsonInclude(JsonInclude.Include.NON_NULL)`
- Use Lombok `@Data` for getters/setters
- Provide static factory method `from(Entity)` for entity-to-DTO mapping

### Controller Style

```java
@RestController
@RequestMapping(value = "/stocks")
public class StockController {
   private final StockService stockService;

   public StockController(@Autowired StockService stockService) {
      this.stockService = stockService;
   }

   @GetMapping
   @Operation(summary = "List products")
   public @ResponseBody List<StockResponseDTO> getAllStocks(...) { ... }
}
```

### Service Style

- Use constructor injection with `@Autowired` on constructor params
- Mark write operations with `@Transactional`
- Return `Optional<T>` for optional results
- Throw `ValidationError` for business logic errors

### Error Handling

- Custom `ValidationError` exception (extends RuntimeException)
- `@ControllerAdvice` for global exception handling:
  - `MethodArgumentNotValidException` → 400 BAD_REQUEST
  - `ValidationError` → 422 UNPROCESSABLE_ENTITY

### Testing Style

```java
@ExtendWith(MockitoExtension.class)
class StockServiceTest {
   @Mock private StockRepository stockRepository;
   @InjectMocks private StockServiceImpl stockService;

   @BeforeEach
   public void init() { ... }

   @Test
   void testGetAllStocksWhenNoFoundStocks() {
      // Mocking data
      when(stockRepository.filterByPhraseAndPagination(...)).thenReturn(Page.empty());
      // Test
      List<StockResponseDTO> result = stockService.getAllStocks(...);
      // Assertion
      assertTrue(result.isEmpty());
      verify(stockRepository, times(1)).filterByPhraseAndPagination(...);
   }
}
```

- Use Mockito with `@Mock` and `@InjectMocks`
- Structure: Mocking → Test → Assertion
- Use AssertJ's `assertThat()` for fluent assertions
- Verify mock interactions with `verify(..., times(n))`

### Import Organization

- Standard Java/Third-party imports first
- Static imports at the end (for test assertions)
- No unused imports

### Configuration

- Spring Boot 3.2.4, Java 17
- SQLite database with Hibernate community dialect
- Lombok for boilerplate reduction
- SpringDoc OpenAPI for Swagger UI at `/swagger-ui.html`
- JWT authentication with `io.jsonwebtoken:jjwt:0.12.5`
- File upload limit: 10MB

### Code Quality

- Run formatter before committing: `mvn formatter:format`
- Line endings: LF
- Encoding: UTF-8
- Use `Optional<T>` instead of null returns
- Document API endpoints with `@Operation`, `@Parameter`
