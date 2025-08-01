# Part School Backend

## Dependencies

- Node (Version 20 or higher)
- Postgresql & Prisma for database
- Pm2 for running project
- Ffmpeg for processing files

## Production

For production the following steps are needed:

`sudo npm install pm2 -g`

`sudo apt install ffmpeg`

`cd ..`

`mkdir logs` => To create logs directory

`touch logs/entire.log` => To create log file for all output of the project

`touch logs/error.log` => To create log file for errors of the project

`touch logs/output.log` => To create log file for output of the project

`cd -`

`git pull`

`cd server`

`npm install`

`cd prisma`

`sudo npx prisma migrate dev` => For applying migrations

`sudo npx prisma db seed` => For inserting init data

`cd ..`

`sudo pm2 start ecosystem.config.js` => To run project

# Environment variables

`HOST` => Host for running project (default 127.0.0.1)

`PORT` => Port of host that project listens on it (default 3000)

`DATABASE_HOST` => Host of database

`DATABASE_PORT` => Port of host that database listens on it (default 3000)

`DATABASE_USER` => Admin's username for working with database

`DATABASE_PASSWORD` => Admin's password for working with database

`DATABASE_NAME` => Name of database

`DATABASE_URL` => Databse url for connecting Prisma

`REDIS_URL` => Redis url to define host and port for working with it

`JWT_SECRET_KEY` => Secret key to decrypt and bcrypt jwt token

`KAVENEGAR_KEY` => Kavenegar key to send message

`KAVENEGAR_NUMBER` => Kavenegar number to send message

## Conventional Commits

**feat:** Used when adding a new feature.

**fix:** Used when fixing a bug.

**refactor:** Used when reorganizing or restructuring existing code.

**docs:** Used when making changes related to documentation or comments.

**style:** Used for changes in code formatting, whitespace, punctuation, etc.

**test:** Used when adding or updating test code or test scenarios.

**chore:** Used for changes related to auxiliary tools, configuration files, or project
organization.
