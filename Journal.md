<<<<<<< HEAD
# HW1 Journals

- Name: Armant Touche
- Class: CS645P

- Resources:

  - [How to Make Forked Private Repository](https://junyonglee.me/github/How-to-make-forked-private-repository/)

- 04/13:

  - Worked on PUT, POST, DELETE, PATCH verbs:
    - I first setup the route and router to handle PUT request before moving on to minimal() and finally app.put() in server.
    - I assumed this is the optimal workflow for adding HTTP verbs.
    - I got a successful PUT for "/" and "/about".
    - For POST, I followed the same flow, route() --> router() --> server.js
    - For DELETE, I followed the same flow, route() --> router() --> server.js
    - For PATCH, I followed the same flow, route() --> router() --> server.js

- 4/17:
  - Tried working on jest:
    - Read the docs and closet reference that fulls in the same scope as the assignment was [How to test Expressjs with Jest and Supertest](https://www.albertgao.xyz/2017/05/24/how-to-test-expressjs-with-jest-and-supertest/)
=======
// Class beginning
// if your question isn't regarding some PII or grade or whatnot, ask it publicly in zulip, not PM or email.  
// I will otherwise only respond with a copy pasted response reminding you of this.  
// 99 % of questions I've received are the same 6 problems repeatedly and answering one of you does not benefit any of the others.

// talk about how much oversharing is too much

// Similarly, if you're sending me 19 emails in an hour Sunday night at 11pm the day before the assignment is due
// you have waited far too long to start.
// Those of you asking (and moreso helping) thanks and enjoy your AP

// CLASS WALKTHRU STEPS
// Find supertest via explaining everyone probably had trouble figuring out jest
// so we google 'express jest', look for dev.to post that mentions supertest
// google supertest and show in docs You may pass an http.Server, or a Function to request()
// we probably don't have whatever function it wants, but we DO have an http server
// which means in minimal, we need to split createServer from Listen() -- this was the trick

// write basic test
// let it error because we still have const server = app.listen inside of server.js which is what we're testing
// lets move those to a routes file instead
////////////////// PROBABLY OLD
// it's still blowing up with app.address is not a function so we google
// https://stackoverflow.com/questions/33986863/mocha-api-testing-getting-typeerror-app-address-is-not-a-function
// now we need to split them apart so we do
////////////////// END PROBABLY OLD
// lets see if we can figure out how to debug these?
// https://stackoverflow.com/questions/46641872/node-jest-config-paths-must-be-specified
// add to launch.json
// now we have error with multiple tests, saying port already in use
// lets see if we use a debugger on our tests, we can figure it out (launch.json)
// hmm listen() on minimal is getting called somehow, why?
// oh well we imported addNumbersTextExample which RUNS EVERYTHING IN THE FILE
// https://stackoverflow.com/questions/54422849/jest-testing-multiple-test-file-port-3000-already-in-use
// lets wrap our server.js to avoid it during tests
// or we could just remove the export, but we want to pack it into a main function for await (server.js)
// MIGHT HAVE PATHS BLOW UP IF SO HERE IS SOLUTION
// now we get jest working fine, but running the server itself doesn't!
// we're back to the problem between /dist and non-dist
// so we make an areWeTestingWithJest() function, again found from google
// lets add some more tests for things
// move on to pormises/async/await tutorial with remaining time
// https://www.freecodecamp.org/news/learn-promise-async-await-in-20-minutes/
>>>>>>> upstream/master
