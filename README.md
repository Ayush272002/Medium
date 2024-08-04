# A simple working Medium type Blogging App

## Project Demo

Check out the live demo of the app: [Medium Blogging App](https://medium-ayush.vercel.app)

## Tech Stack

- React in the frontend
- Cloudflare workers in the backend
- zod as the validation library, type inference for the frontend types
- Typescript as the language
- Prisma as the ORM, with connection pooling
- Postgres as the database
- jwt for authentication

## Project Structure

### Backend

For the db, I've used Postgres and prisma for ORM and connection pool, and since I wanted it to deploy to cloudflare workers as it serverless, also cloudflare has its own js runtime, but it supports `Hono` and not `Nodejs` so for routing and stuff i have used `Hono` instead of `express` or other library which is dependent on `Nodejs`

### Common

It generally contains the `types` which is used by both frontend and backend since, writing it on both places would have been violation of DRY rule, so i created a commons folder and wrote the types and the zod validation schema and published it to npmjs as a public package and used it in both frontend and backend, <br>

Here is the link to that [package](https://www.npmjs.com/package/@ayush272002/medium-common-v3) <br>

To avoid all that mumbo-jumbo a better solution would have been Monorepo.

### Frontend

A simple React project

## Running Locally

### Backend

- In the `.env` file enter the url of your actual postgreSQL DB -> it the the link through where prisma picks the db link from while running locally

- In the `wrangler.toml` file enter the `JWT_SECRET` and the `DATABASE_URL` -> Connection Pool url its where the application picks the db link from while deployed

```shell
npm i
npm run dev
```

### Running the Backend

- In the `.env` enter the url of the backend the run

```shell
npm i
npm run dev
```

## Contributing

Contributions are welcome! If you have suggestions for new features, bug fixes, or improvements, please fork the repository and submit a pull request. For major changes, please open an issue first to discuss what you would like to change.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

If you have any questions or suggestions, please feel free to contact.
