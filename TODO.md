# 2020-06-05

1. finish the basic CRUD of posts, no validation of input, no result checking, no error handling.(done)

2. finish the basic CRUD of users.(done)

3. finish the basic CRUD of comments.(done)

4. error handling in a central place, not mix up with business logic(done)

TODO: new Error(`Cannot find ${req.originalUrl}`); what is the Error class in nodejs? and what is `Error.captureStackTrace(this, this.constructor)`?

# 2020-06-06

1. throw specific error types manually for unexpected result(I can return modified result in DAO methods)

2. different error mesg for prod or dev env, and provide meaningful err message to client.

3. handle mongdb error? right now it has try catch block to console.log it... need to find a better way?

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

4. unhandled errors outside app, like no connections to DB, not able to login to DB(unhandled promise rejection).(done)

uncaughtException outside app, like programming error.(done)

```js
process.on('unhandledRejection', err=>{
    ...
})
```
