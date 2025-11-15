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
 - Types must be imported by the client code and used in API calls, components, providers, pages, utils, and all other code.
 - Types must be imported by the server code and used in controllers, services, utils, prompts, and all other code.

### Shared Utilities
 - Shared utilities must be created at `shared/util.<util-name>.ts` when they can be used by both client and server code.
 - Shared utilities must be grouped by functionality.
 - Shared utilities must be pure functions without side effects.
 - Shared utilities must be imported and used in client and server code as needed.
 - Shared utilities must not rely on Browser or Node.js specific APIs so that they can be used in both environments.

### Shared Prompts
 - Prompts must be created as a function in `src/shared/prompt.<prompt-name>.ts`.
 - Each file must export a single function that returns a `Promise<ChatCompletionMessageParam[]>`.

## Client

### Client Providers
 - Providers must be created at `src/client/provider.<provider-name>.ts`
 - Providers must handle data fetching and state management.
 - Provider must fetch data by importing services from `src/shared/service.<service-name>.ts` and calling the `fetch()` method.
 - Providers must use context to share data with components.
 - Providers must return typed data imported from `shared/type.<type-name>.ts`

### Client Pages
 - Pages must be created at `src/client/page.<page-name>.ts`
 - Pages must extend a provider located at `src/client/provider.<provider-name>.ts`
 - Pages must have extremely minimal logic, delegating UI capabilities to components.
 - Page routes must be added by following these steps:
   - If needed, create a provider at `src/client/provider.<provider-name>.ts`
   - Create the new page file at `src/client/page.<page-name>.ts`
   - Add a `RouteConfig` entry in the `routes` array in the `src/shared/service.client.ts` file.
   - Add a `case` entry in the `render` method in the `src/client/app.ts` file.

### Client Components
 - Components must be created at `src/client/component.<component-name>.ts`
 - Components must get data by consuming context provided in the provider.
 - Components that are general purpose can have attributes to customize their behavior.

## Server

### Server Controllers
 - Controllers must be created at `src/server/controller.<controller-name>.ts`
 - Controllers must extend AbstractController with proper RequestBodyType, PathParams, and ResponseContent types.
 - Controllers must implement the `handler` method which takes in the request and response objects and returns the appropriate response.
 - Controllers must validate input and response data using Zod schemas from `shared/type.<type-name>.ts`
 - Controllers must be imported by `src/server/main.router.ts` and be added to the router.

### Server Utils
 - Utils must be created at `src/server/util.<util-name>.ts`.
 - Utils must be grouped by functionality.
 - Utils should only go under `src/server` if they rely on Node.js specific APIs.
 - Wherever possible, utils should go under `src/shared` to be usable by both client and server code.

## Data Persistence

 - All data must be stored in the `data` directory.
 - All app data must be stored under `data/app/`.
 - All book data must be stored under `data/books/`.
 - Each book must have its own subdirectory named after the book id.
 - Each book directory must contain:
   - `index.json` - Contains book data and follows the `Book` type schema.
   - `audio/` - Directory containing audio files related to the book. Each file must be a uuid named `.mp3` file.
   - `references/` - Directory containing reference files related to the book. These files can be `.txt`, `.md`, or `.docx` files.
 - Book data must be stored in an `index.json` file within the book's subdirectory.
 - File operations must be handled by code under `src/server`.

## Development Practices

 - Use `npm run fix` to automatically fix linting and formatting issues.
 - Use `npm run build` to compile the TypeScript code.
 - Use `npm start` to run the development server.
 - Use the chrome-devtools extension for debugging client-side code and checking console errors, but only when absolutely necessary.
 - If the changes are large, first come up with a development plan and save it in `.github/prompts/work-plan.md` before starting.
 - When work plans are needed, first ask me to review it before starting the implementation.
