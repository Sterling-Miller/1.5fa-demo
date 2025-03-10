# QR code Authentication vs 2FA

This is a [Next.js](https://nextjs.org/) project that uses [NextAuth.js](https://next-auth.js.org/) for email + password + 2FA code login and stand-alone QR-code authentication, [Drizzle](https://orm.drizzle.team) as the ORM, and a [Neon Postgres](https://vercel.com/postgres) database to persist the data.

## Developing Locally

0. Ensure you have bun and node-js installed.
- [Node Installer](https://nodejs.org/en/download)
- [Bun Installer](https://bun.sh/docs/installation)

1. Clone this repository:
  ```bash
  git clone git@github.com:Sterling-Miller/1.5fa-demo.git
  ```

2. You can install the required dependencies with this command:
  ```bash
bun install
```
3. Set you environment varriables by creating a .env file in the main folder:
  ```Ask a team member for the keys.```

4. Then, run the development server:

  ```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Collaboration Guidelines

- To start working on the code, create and checkout a new branch for the feature that you're adding:
```bash
git branch -b new_feature
```

- Work on the branch until the feature is complete and working in full. Remember to commit and push your changes regularly.
- Before merging, ensure that the code is commented enough to be understanable.

- When the code is complete, make sure it works with the most recent version on the ```main``` branch:
```bash
git merge main
```
- You should resolve any merge conflicts.

- Now, create a Pull Request on the GitHub website.

- Ask another team memeber to review your code before merging to main.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.
 

