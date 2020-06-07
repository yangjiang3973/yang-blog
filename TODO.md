# 2020-06-05

1. finish the basic CRUD of posts, no validation of input, no result checking, no error handling.(DONE)

2. finish the basic CRUD of users.(DONE)

3. finish the basic CRUD of comments.(DONE)

4. error handling in a central place, not mix up with business logic(DONE)

TODO: new Error(`Cannot find ${req.originalUrl}`); what is the Error class in nodejs? and what is `Error.captureStackTrace(this, this.constructor)`?

# 2020-06-06

1. different error info for prod or dev env, and provide meaningful err message to client. (DONE)

2. handle mongdb error? right now it has try catch block to console.log it... need to find a better way?(DONE)

if I remove try catch block in DAO, then the error will be catched in controller, then throw to global error handler.

Later, if data breaks validation, how to throw? like `duplicate user name`.

make a DB error handler? call in catch block?

```js
try{
    ...
} catch(err) {
    dbErrorHandler(err)
}
```

then further abstract like `catchAsync`?

But the problem is how to throw db level error to the app? without next(error)...to send throw `res`...

IDEA: still add a handler in DAO level, modify the error obj, throw it up to controller, then to the global error handler. like mongoose!!

need to learn how to pass error up in NodeJS

types of error from mongodb:

(1 query with invalid id

(2 duplicate values for field that requires unique value(validation err)

(3 values break the rule, like beyond the range(validation err)

3. unhandled errors outside app, like no connections to DB, not able to login to DB(unhandled promise rejection).(DONE)

uncaughtException outside app, like programming error.(DONE)

```js
process.on('unhandledRejection', err=>{
    ...
})
```

4. Learn **basic** MongoDB's schema validation. How to build schema and add validation. (Validation occurs during updates and inserts, for `get` query should be handled by myself )(DONE)

5. learn **Index** in MongoDB. right now just simply use unique index to avoid duplicate value.

# 2020-06-07

1. validation for DB is done, but also need to validate input(for email, trim spaces, check email, transform to lowercase)

for password, check passwordConfirm matching

2. JWT

(1) build user schema (DONE)

(2) validate password with passwordConfirm (DONE)

(3) encrypt password (DONE)

(4) JWT for signup (DONE)

(5) JWT for signin (DONE)

(6) protect routes

3. review schemas in natours to borrow some ideas

4. learn bcrypt..why don't need to add a salt manually?

5. learn how JWT works!
