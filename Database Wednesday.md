---
## Git changes

We're going to catch up to changes that have happened since Monday via Git.

1) Create postgres container and add it to docker-compose
2) Install dotenv and use it for configuring ports and such
3) Change our docker-compose to further integrate everything
4) Refactor our backend to use a Router supplying "/api/v1" prefix
5) added some backend packages for postgres
	1) sequelize pg pg-hstore body-parser jsonwebtoken bcryptjs
6) Now we can just docker-compose build && docker-compose up

---

To begin with, our starting point is using Docker as a dev environment wholesale.  You CAN do it this way 100% of the time, but it's generally more useful to just develop locally.  If, however, you're, say, on Windows, using this setup will allow you to "develop on Linux".

For lecture speed purposes, we're going to opt OUT of doing this, so we'll comment out our backend/frontend from docker-compose.  Then we'll build via Docker, so we have our Postgres db ready to go:

`> docker-compose up --build`

This actually builds both, but we'll only use Postgres today.  Now we can use some of our new packages to write some JS to make use of our new database.  Our goal is thus:

1. Initialize the database, create it from a schema, seed it with starter data.
	1. Connect to Postgres & doggrdb
	2. Create tables from schema
	3. Seed with starter data
2. Add a backend route for creating a new user which needs to:
	1. Check to ensure user doesn't already exist
	2. Add user to the database
	3. Return success/failure to the client
3. Add a React page for our "user" to create a new one for himself
	1. This should have a link in our ghetto nav bar
	2. It should report to user if the email already exists
	3. it should report to user upon completion

Note that nowhere in this are we authenticating or logging anyone in, we're just creating users on demand.

We're now going to work through our 3 part goal by tackling one at a time.  You can work in either direction you choose, but I prefer going in the order I just gave.

---
## 1 - Database Schema and seeding.

Postgres, instead of being a Key-Value store, as Mongo is, works more like a spreadsheet.  It is a "traditional" database, which means a database is divided into tables, and tables contain rows.  Just like Excel.

In our case, all we want to do is to create a new user.  We can, thusly, create a table in our database called "users" and put all of our users into it.  One of the packages I installed earlier, `sequelize` is an ORM, or object relational mapper.  It's a database abstraction tool used to make interacting with these databases easier on the developer.  I do not believe they do any such thing, but we're going to use one here anyway, so that everyone can see it in action.

Sequelize works by defining a "Model" for each entity type in your database.  This means a model corresponds to a database table.  We're interested in users, specifically a username and password, so we'll want a Model/table "User" that holds those 2 fields.

Lets create that model now by making new subdir in backend/src/database and creating a new `models.ts` file in it.

```ts
import { Sequelize, DataTypes } from "sequelize";


const pguser = process.env.PGUSER;
const pghost = process.env.PGHOST;
const pgpass = process.env.PGPASSWORD;
const pgdatabase = process.env.PGDATABASE;
const pgport = process.env.PGPORT;

const connstring = `postgres://${pguser}:${pgpass}@${pghost}:${pgport}/${pgdatabase}`;

export const db = new Sequelize(connstring);

export const User = db.define('users', {
  email: {
    type: DataTypes.STRING,
  },
  password: {
    type: DataTypes.STRING,
  },
});
```

This creates a Sequelize model we'll use later to interact with our database.  In the non-ORM times, this meant writing SQL, but now we have fancy methods instead.  The `User` var is now directly tied to our Users table in Postgres.

The next thing we need to do is actually create the database table.  It's also nice to pre-load some test data, so we have things to dev against.  This is commonly called `Seeding` and typically accompanies a bit more durable system than what we're building now, called `Migrations`.  For you Dev Ops people, this is where you come in. We'll switch to using migrations shortly too, but first we're building this puppy by hand, so we're going to make a `seed.ts` file. 

```ts
import "dotenv/config";
import { Sequelize, DataTypes } from "sequelize";
import { db, User } from "./models";


const userSeedData = [
  { email: "test@gmail.com", password: "123456" },
  { email: "test2@email.com", password: "password" },
];

const seed = async () => {
  console.log("Beginning seed");

  // force true will drop the table if it already exists
  // such that every time we run seed, we start completely fresh
  await User.sync({ force: true }); 
  console.log('Tables have synced!');

  await User.bulkCreate(userSeedData, { validate: true })
    .then(() => {
      console.log('Users created');
    }).catch((err) => {
      console.log('failed to create seed users');
      console.log(err);
    });
  await User.create({ email: "athirdemail@aol.com", password: "123456" })
    .then(() => {
      console.log("Created single user");
    })
    .catch((err) => {
      console.log('failed to create seed users');
      console.log(err);
    })
    .finally(() => {
      db.close();
    });

};

seed();
```

We'll also need to add a package.json script for running this file.  We're going to use it in JS's original sense of scripting language, and just run it via node when we'd like to seed.

```package.json
  "seed": "npx tsc && node dist/database/seed.js"
```

Now we can construct and fill our database via `npm run seed`!

---

Lets take a look at our glorious beast visually.  Jetbrains has an amazing client, DataGrip.

We can see from it that we do now, indeed, have database working!  This accomplishes step 1.

Step 2 is backend.  We now have a User table and a User model we can interact with our table through.  Reminder, this is next:
 
 Add a backend route for creating a new user which needs to:
	1. Check to ensure user doesn't already exist
	2. Add user to the database
	3. Return success/failure to the client

So lets first add a POST route to /users which our client will use to send us the email/pw data.  In `backend/src/routes.ts`

```ts
router.post("/users", (req, res) => {

  });
```

Now how do we fill it?  The first thing we need to do is check to see if the user exists, which we could technically build right here into this route.  It's likely though that this sort of check will actually need to be done from multiple routes.  Even moreso if we're doing auth vs creation, as you'll want to check auth on LOTS of routes.

Luckily our old friend Express Middlewares arrive to save the day!  We can create a middleware that checks FOR us, and just add it into our chain!

We'll start by making a new subdir, middlewares, into which we'll put `verifySignUp.ts`

```ts
import { db, User } from "../database/models";

export const checkDuplicateEmail = (req, res, next) => {
  console.log("Checking duplicate email");
  console.log(req.body);
  // Username
  User.findOne({
    where: {
      email: req.body.email,
    },
  }).then(user => {
    if (user) {
      console.log("Sending failed bc email in use");
      res.status(400).send({
        message: "Failed! Email is already in use!",
      });
      return;
    }
    console.log("Email not in use");
    next();
  });
};
```

Here, we're just using our User model to check for an existing email.  If one already exists, we can EXIT our response chain here in the middleware.  We just immediately send back the failure response.

If the email is NOT in use, we're all good, so we simply call `next()` to advance the chain.

Now we need to put this middleware into use in our route!

```ts
router.post("/users",checkDuplicateEmail, (req, res) => {

  });
```

We just throw it in there!  Now, if our email has a duplicate, this response never makes it to our real function.  It bails out early!

Now that we've validated this is a user that can be added, we add it.

---

Likewise with our middleware, we could build this user creation directly into the Route, but we could also do better.  Lets create a service that adds a user, and add IT to our response chain instead.  Create another subdir, `services` and add `user_service.ts`

```ts
import { db, User } from "../database/models";

export function createUser(req, res) {

  const email = req.body.email;
  const password = req.body.password;
  console.log(`in createuser with ${email}:${password}`);
  User.create({ email, password })
    .then(() => {
      console.log("Created single user");
      res.status(200).json({ message: "Created user successfully" });
    })
    .catch((err) => {
      console.log('failed to create users');
      console.log(err);
      res.status(500).json({ message: err });
    });

}
```

Note that our fn has the same signature as our Express route function!  This is important, because we're going to COMPLETELY replace our route function with it.

```ts
 router.post("/users", checkDuplicateEmail, createUser);
```

Our backend is magically complete!  Now when a request comes in to /users via POST, the data will be checked for duplicates, and if it passes muster, will be sent onward to createUser.

---

Lets go ahead and test this puppy out via Postman.  We'll make a POST request to `localhost:9000/api/v1/users` with a json body containing an "email" field and "password" field.  We get the message back that everythins' good, we can go check in Datagrip and it's there!

What happens if we try it again?  BOOM, email already in use, too bad!  If that seemed complicated, lets look back at how little it actually took.

---

So, backend is done!  Onward to part 3, the frontend.  As a reminder, we need these:

Add a React page for our "user" to create a new one of himself
	1. This should have a link in our ghetto nav bar
	2. It should report to user if the email already exists
	3. it should report to user upon completion

For 1, let's hop into our Header component and add the next section:

```ts
export const Header = () => {
  return (<div>
    <h1>Doggr</h1>
    <h3>Where your pets finds love(tm)</h3>
    <Link to="/">Dashboard</Link>
    &nbsp; | &nbsp;
    <Link to="/match-history">Match History</Link>
    &nbsp; | &nbsp;
    <Link to="/create-user">Create User</Link>
    <br />
    <Outlet />
  </div>
  );
}
```

Now we'll have a new link added that'll take us to React Router's page "/create-user".  Lets add that route in to App

```ts
<BrowserRouter>
        <Routes>
          <Route path="/" element={<Header />}>
            <Route path="/" element={profile} />
            <Route path="match-history" element={matchHistory} />
            <Route path="create-user" element={<CreateUser />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>

      </BrowserRouter>
```

Now we'll need to add a component called CreateUser to Components

```ts
export const CreateUser = () => {
}
```

Inside of this Component, we'll want to offer 2 input text fields, one for email and one for password.  Lets go ahead and add those:

```ts
return(
<div>
	<div>
		<label htmlFor="email">Email</label>
		<input
			type="text"
			id="email"
			required
			value={user.email}
			onChange={handleInputChange}
			name="email"
		/>
	</div>

	<div>
		<label htmlFor="password">Password</label>
		<input
			type="text"
			id="password"
			required
			value={user.password}
			onChange={handleInputChange}
			name="password"
		/>
	</div>

	<button onClick={saveUser}>
		Create
  </button>
</div>
)
```

So now we've wired up our text fields input to an event `handleInputChange` and our Create button to an event `saveUser`

We're now going to need some state for dealing with these events.  We'll want to keep track of what those fields actually have in them, so we'll make a `user` state and an initial state to supply it with:

```ts
const initialUserState = {
    email: "",
    password: "",
  };

  const [user, setUser] = useState(initialUserState);
```

This is enough to go ahead and add our handle input change fn:

```ts
const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };
```

This means that depending on our `name` field in our <input> we'll change the related state field.

Now we need to deal with the submit button.  That one is fresh and new, because FINALLY we're going to need to make a request to our backend.  

We're not going to make that request from our component, though.  Remember, we want to put our logic elsewhere!  Thus, we'll make a new src/services subdir and add a `UserService.tsx` service just like the backend, except this one will be our interface between front/backend rather than backend/postgres.


> [!NOTE]
> It is not required for us, at this point, to actually make that request TO the backend!  
> In this case, we've already finished our backend, but what if both pieces are being developed together? 
> We could have this UserService start out producing mock data/responses


Inside this file, we want to export a User that exposes a `create` method that makes the request.  Then, in our Component, we can simply call it.

```ts
export const User =  {
  async create(user) {    
  }
}
```

At this point, we need to make a request.  You can do it with built-in fetch, but Axios gives you lots of nice convenience, so we're going to use it.  Lets make a second service that provides an Axios instance for making requests to our backend, `HttpService.tsx`

```ts
import axios from "axios";

export default axios.create({
  baseURL: "http://localhost:9000/api/v1",
  headers: {
    "Content-type": "application/json"
  }
});
```

Now we can import this into our UserService and make our request with it:

```ts
import http from "./HttpService";

export const User = {
  async create(user) {
    return http.post("/users", { email: user.email, password: user.password });
  }
}
```

Which only leaves calling this from our component when the user clicks the submit button:

```ts
const saveUser = () => {
    User.create(user)
      .then(res => {
        console.log(res.data);
      })
      .catch(e => {
        console.log("Error creating new user", e);
      })
  }
```

Hooray!

---

Now we need to spruce and validate a bit.  We'd like the following:

If the user hasn't submitted, display the form.
If the user has submitted, but not successfully, display error message and form
If the user submits successfully, don't show the form, only show success message
Reset everything if the user leaves the create page and returns

This will require some new state, one for submitted and one for success-state:

```ts
const [submitted, setSubmitted] = useState(false);
const [submitFailed, setSubmitFailed] = useState(false);

```

Then we'll need to make use of them during `saveUser`:

```ts
const saveUser = () => {
    User.create(user)
      .then(res => {
        setSubmitted(true);
        setSubmitFailed(false);
        console.log(res.data);
      })
      .catch(e => {
        setSubmitFailed(true);
        console.log("Error creating new user", e);
      })
  }
```

Then we'll need to change up our jsx render a bit to also make use of them:

```ts
return (
    <div>
      {submitted ? (
        <div>
          <h4>You submitted successfully!</h4>
          <button onClick={resetUser}>
            Reset
          </button>
        </div>
      ) : (
        <div>
          <div>           
            { submitFailed && //This will only render if our prior submit failed
              <h2>Email already exists!</h2>
            }
            <label htmlFor="email">Email</label>
            <input
              type="text"
              id="email"
              required
              value={user.email}
              onChange={handleInputChange}
              name="email"
            />
          </div>

          <div>
            <label htmlFor="password">Password</label>
            <input
              type="text"
              id="password"
              required
              value={user.password}
              onChange={handleInputChange}
              name="password"
            />
          </div>

          <button onClick={saveUser}>
            Create
          </button>
        </div>
      )}
    </div>
  )
```

Don't let this scare you!  We're just selectively showing a few things based on our new state vars, submitted and submitFailed.

Last up is adding that resetUser() 

```ts
const resetUser = () => {
    setUser(initialUserState);
    setSubmitted(false);
  }
```

Huzzah!  We have a complete chain of tech!

---

Now we have one remaining problem.  We're doing an awful lot inside of this Component, which is going to be re-run every single time it re-renders.  Lets hoist some of this out.

First, we're re-creating our initialUserState every single time we render CreateUser, which is wasteful nonsense.  Lets just yank it out:

```ts

const initialUserState = {
  email: "",
  password: "",
};

export const CreateUser = () => {  

  const [user, setUser] = useState(initialUserState);
```

We can also move the form things to their own sub-component, to separate our logic and view a bit further:

```ts

export const CreateUserForm = ({ handleInputChange, saveUser, user }) => {
  return (
    <div>
      <div>
        <label htmlFor="email">Email</label>
        <input
          type="text"
          id="email"
          required
          value={user.email}
          onChange={handleInputChange}
          name="email"
        />
      </div>

      <div>
        <label htmlFor="password">Password</label>
        <input
          type="text"
          id="password"
          required
          value={user.password}
          onChange={handleInputChange}
          name="password"
        />
      </div>

      <button onClick={saveUser}>
        Create
      </button>
    </div>
  )
}
```

This will significantly shorten our CreateUser:

```ts
export const CreateUser = () => {

  const [user, setUser] = useState(initialUserState);
  const [submitted, setSubmitted] = useState(false);
  const [submitFailed, setSubmitFailed] = useState(false);


  const handleInputChange = event => {
    const { name, value } = event.target;
    setUser({ ...user, [name]: value });
  };

  const saveUser = () => {
    User.create(user)
      .then(res => {
        setSubmitted(true);
        setSubmitFailed(false);
        console.log(res.data);
      })
      .catch(e => {
        setSubmitFailed(true);
        console.log("Error creating new user", e);
      })
  }

  const resetUser = () => {
    setUser(initialUserState);
    setSubmitted(false);
  }

  return (
    <div>
      {submitted ? (
        <>     {/* If we've already submitted, show this piece*/}
          <h4>You submitted successfully!</h4>
          <button onClick={resetUser}>
            Reset
          </button>
        </>
      ) : (
          <>   {/* If we've NOT already submitted, show this piece*/}
          { submitFailed && //This will only render if our prior submit failed
              //we could add a div here and style this separately
            <h2>Email already exists!</h2>
          }
          <CreateUserForm handleInputChange={handleInputChange} saveUser={saveUser} user={user} />
        </>
      )
      }
    </div>
  )
}
```

And we're done!