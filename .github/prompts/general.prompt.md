# Torlify Project Coding Standards

## General

 - Use Zod and TypeScript for all code.
 - Follow consistent code formatting using Prettier.
 - Write clear and concise comments for complex logic.
 - Use descriptive names for variables, functions, classes, and files.
 - Ensure code is modular and reusable where possible.

## Shared

### Shared Types
 - Types must be created at `shared/type.<type-name>.ts`
 - Types must be grouped by functionality.
 - Types must use Zod schemas for validation.
 - Types must be defined even for strings or numbers that have specific meanings.
 - Types must be imported by the client code and used in API calls, components, providers, pages.
 - Types must be imported by the server code and used in controllers and services.

### Shared Utilities
 - Utilities must be created at `shared/util.<util-name>.ts`
 - Utilities must be grouped by functionality.
 - Utilities must be pure functions without side effects.
 - Utilities must be imported and used in client and server code as needed.
 - Utilities must not rely on Browser or Node.js specific APIs so that they can be used in both environments.

## Client

### Client Pages
 - Pages must be created at `src/client/page.<page-name>.ts`
 - Pages must extend a provider located at `src/client/provider.<provider-name>.ts`
 - Pages must have extremely minimal logic, delegating UI capabilities to components.
 - Page routes must be added by following these steps in the `src/client/app.ts` file:
   - Add a `RouteConfig` entry in the `routes` array.
   - Add a `case` entry in the `render` method.

### Client Components
 - Components must be created at `src/client/component.<component-name>.ts`
 - Components must get data by consuming context provided in the provider.
 - Components that are general purpose can have attributes to customize their behavior.

### Client API
 - API calls must be created in files at `src/client/api.<api-name>.ts`
 - API calls must be grouped by functionality.
 - API calls must return typed data imported from `shared/type.<type-name>.ts`

## Server

### Server Controllers
 - Controllers must be created at `src/server/controller.<controller-name>.ts`
 - Controllers must handle HTTP requests and responses.
 - Controllers must call services to perform business logic.
 - Controllers must validate input data using Zod schemas from `shared/type.<type-name>.ts`

### Server Services
 - Services must be created at `src/server/service.<service-name>.ts`
 - Services must contain business logic and interact with the files under `books` for data persistence.
 - Services must return typed data imported from `shared/type.<type-name>.ts`

### Server Routes
 - Routes are defined in the controller but are registered in `src/server/main.router.ts`

## Data Persistence

 - All data must be stored in the `books` directory.
 - Each book must have its own subdirectory named after the book ID.
 - Each book directory must contain:
   - `index.json` - Contains book data and follows the `Book` type schema.
   - `audio/` - Directory containing audio files related to the book. Each file must be a uuid named `.mp3` file.
   - `references/` - Directory containing reference files related to the book. These files can be `.txt`, `.md`, or `.docx` files.
 - Book data must be stored in JSON files within the book's subdirectory.
 - File operations must be handled by server services to ensure data integrity.

## Development Practices

 - Use `npm run fix` to automatically fix linting and formatting issues.
 - Use `npm run build` to compile the TypeScript code.
 - Use `npm start` to run the development server.
 - Use the chrome-devtools extension for debugging client-side code and checking console errors, but only when absolutely necessary.
 - If the changes are large, first come up with a development plan and save it in `.github/prompts/work-plan.md` before starting.
 - When work plans are needed, first ask me to review it before starting the implementation.
