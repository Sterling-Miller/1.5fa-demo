# Streamlining 2FA

## About
This project has implementations of two kinds of authentication methods. The first is a traditional username/password form with a email 2FA code. The second is a QR code based authentication method which relies on a secondary device (typically a users phone) to be authenticated.

## DEMO
Here is [a link to our hosted demo](https://demo-git-main-sterling-millers-projects.vercel.app/login).


## Tech Stack:
This is a [Next.js](https://nextjs.org/) project that uses [NextAuth.js](https://next-auth.js.org/) for email + password + 2FA code login and custom QR-code authentication, [Drizzle](https://orm.drizzle.team) as the ORM, and a [Neon Postgres](https://vercel.com/postgres) database to persist the data.


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
  
  NOTE: We talked to Emad about needing to provide keys on the final day of lecture and he stated that we do not need to provide keys, only a video demo or working site. See the top of this document for a link to our hosted website for testing/demo.

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

## Project Structure
This section provides a broad overview of what each of the folders and files in our project do.

### API 
Inside the API folder are our endpoints.
These are mostly funcions for the 2FA-code process and QR-token management:
- activatetoken : Activates token
- generatetoken : creates a new token and adds to DB
- login : Checks if email/password are valid for login page
- send-code : Sends a 2FA code with Resend
- verify-code : Checks that 2FA code is valid
- verifytoken : Verifies that token exists

### Pages
Each page is held within it's own folder. The main parent component for each page is called `page.tsx`.

Here the pages:
- login
  - checkActivation : listener for token activation
  - getBrowserInfo : helper function gets the browser info for fingerprinting
  - qrGenerator : takes token and creates visual QR code to display
  - serverActions: handels server actions for both forms of authentication
- protected
  - verifyToken : verifies token exists and authenticates if current session is still valid
  - qrReader : Scans QR code using browser camera. Provides menu to select front or rear camera.
  - navbar : holds signout button and displays current user
- register
  - form : holds form component for holding email + password
  - submit-button : handles form submission

### Others
- auth.ts : contains authentication configuration for both auth methods
- auth.config.ts : more authentication config that handles redirects for authenticated users
- db.ts : contains all functions that interact with Drizzle and Neon db
- layout.tsx : root of React project, also holds styling info and site metadata
- page.tsx : this is the first page that loads on init, redirects to login.
- /node_modules/ : holds all our dependencies

The rest of the files are mostly boilerplate for the next.js project, refer to their documentation for details.
- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.


