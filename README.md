# Slack Clone

## Description
Code-along project; [of this video](https://www.youtube.com/watch?v=lXITA5MZIiI) by [Code with Antonio](https://github.com/antonioerdeljac).
Antonio used Convex for Database and handling Auth, but I'm using Prisma and Next-Auth.

## .env
```bash
    DATABASE_URL="DATABASE_URL="postgresql://johndoe:randompassword@localhost:5432/mydb?schema=public""
    AUTH_SECRET="xxxyyyzzz" # for hashing JWT
    SECRET="aaabbbccc" # for hashing the password and saving it
```