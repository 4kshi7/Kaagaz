### Application
(Kaagaz-app)[https://kaagaz-2k.vercel.app]

### App features

- User Signup (Token Auth) ✅
- User Signin (Token Auth) ✅
- BCrypt Password Encryption ✅
- See all articles ✅
- Create a new article ✅
- See a specific article ✅

### Stack

- React framework for the frontend
- Cloudflare workers in the backend
- Hono framework for writing backend
- Zod as the validation library, type inference for the frontend types
- Typescript as the language
- Prisma as the ORM, with connection pooling
- Postgres as the database (Aiven)
- JWT for authentication

### Application structure

- backend
- common
- frontend

### How to setup locally

#### Backend
- Navigate to the "backend" directory.
- Obtain a free Postgres connection string from https://aiven.io/ and add it to the ".env" file as "DATABASE_URL".
- Obtain a free Prisma connection string from https://www.prisma.io/data-platform/accelerate and add it to the "wrangler.toml" file under the Prisma connection pool as "DATABASE_URL".
- Set any value for the JWT secret and add it to the "wrangler.toml" file as "JWT_SECRET".
- Run "npm install".
- Run "npm run dev".
> Ensure that both the ".env" and "wrangler.toml" files are properly configured, as they are crucial for the environment setup of the serverless backend.

#### Frontend
- cd frontend
- npm install
- npm run dev 

### Technologies & Libraries
- Serverless Backend using [Cloudfare](https://www.cloudflare.com/)
- Postgres DB using [Aiven.io](aiven.io)
- Prisma as an ORM [Prisma](prisma.io)
- [Hono](https://hono.dev/) - Hono - [炎] means flame🔥 in Japanese - is a small, simple, and ultrafast web framework for the Edges. It works on any JavaScript runtime: Cloudflare Workers, Fastly Compute, Deno, Bun, Vercel, Netlify, AWS Lambda, Lambda@Edge, and Node.js.
- [Zod](https://zod.dev) - TypeScript-first schema validation with static type inference

