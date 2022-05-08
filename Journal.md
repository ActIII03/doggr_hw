# HW1 Journals

- Name: Armant Touche
- Class: CS645P

- Resources:

Steps:

1. Initialize the database, create it from a schema, seed it with starter data.
   i. Connect to Postgres & doggrdb
   ii. Create tables from schema
   iii. Seed with starter data
2. Add a backend route for creating a new user which needs to:
   i. Check to ensure user doesn't already exist
   ii. Add user to the database
   iii. Return success/failure to the client
3. Add a React page for our "user" to create a new one for himself
   i. This should have a link in our ghetto nav bar
   ii. It should report to user if the email already exists
   iii. it should report to user upon completion

## 5/5-5/6:

- Worked on Goal (1):
  - first created models.ts and seed.ts for testing postgres is exposed on 5432 and works when we seed
- Worked on Goal (2):
  - added routes and profileService for creating a new profile
