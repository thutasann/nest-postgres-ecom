# NESTJS POSTGRES ECOMMERCE API

This is the Ecommerce API with Postgresql Database.

## Tech stacks

- Nestjs
- Postgresql
- Typeorm

## Available Scripts

### Start the server

```
yarn start:dev
```

- Open [http://localhost:3000/api/v1](http://localhost:3000/api/v1) in **Postman** or **Insomnia**

### Creating Migration File

```bash
npm run migration:generate -- db/migrations/<migration-name>
```

### Run the Migration

```bash
npm run migration:run
```

## Highlighted Learning outcome

- middleware
- guard
- custom decorator
- reflection and metadata
- interceptor

## Postgres Comamnds

### Check available Databases

```bash
\l;
```

### Establish a Connection With the Desired Database

```bash
\c nest_ecom_db;
```

### List All Tables

```bash
\dt+;
```

### Retrive/Update

```bash
SELECT * FROM users;
```

```bash
UPDATE users
SET roles = '{admin}'
WHERE id = 1;
```
