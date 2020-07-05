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

2. JWT(DONE)

(1) build user schema (DONE)

(2) validate password with passwordConfirm (DONE)

(3) encrypt password (DONE)

(4) JWT for signup (DONE)

(5) JWT for signin (DONE)

(6) protect routes(DONE)

3. review schemas in natours to borrow some ideas

4. learn bcrypt..why don't need to add a salt manually?

5. learn how JWT works!

# 2020-06-08

1. Auth: forgot password!(send email with a link) (DONE)

2. Auth: reset password!(use link that includes token to update password) (DONE)

3. learn crypto package? `crypto.createHash('sha256').update(req.params.token).digest('hex');`

4. now there are `findUserByEmail` and `findUserByToken`, should I make a general query api in DAO?

5. refactor `signToken + res` into on function?(DONE)

6. mailtrap is too slow!!!!! need a better tool!

# 2020-06-09

1. if a user delete himself, will be set `active = false`. need to consider this feature in auth controller(update, recover...).

2. update password by user himself(DONE)

3. update other user info by himself(DONE)

4. mongodb difference between update and findandupdate(DONE)
   Ans: The difference is that FindAndModify() returns the document, either the pre-update or post-update version, together with the update, in one atomic operation. Update is atomic but does not return the document, so if you then query for it it's possible it will have been changed by another process in the interim.

5. follow No.4, need to change update and findAndUpdate to proper ones.(done in UserDAO)

6. delete user by himself(set active to false) (DONE)

7. rate limiting(num of req from the same ip) (DONE)

8. prevent xss attacks:(DONE)

(1) learn more about xss

(2) store jwt in httpOnly cookies(DONE)

(after use cookie, should I continue keeping token in res json???)
(cannot now, because `protect()` still cannot use cookie jwt)

(3) use `helmet` to set special headers(DONE)

9. prevent DDoS attack:(DONE)

(1) rate limiting (DONE)

(2) limit body payload(body-parser)(DONE)

(3) avoid evil regular expressions(DONE)

10. noSQL injection

(1) schema validation(DONE)

(2) sanitize input data(DONE)

(3) learn more about noSQL injection

11. prevent Cross-Site Request Forgery(`csurf` package)

12. prevent parameter pollution causing Uncaught Exception(`hpp`)(DONE)

13. learn `hpp`

14. learn from `helmet`

# 2020-06-10

1. start server side rendering

2. Q: in page a, style.css was loaded, when open page b, does style.css need to load again?

3. organize commently used syntax of emmet

4. css initialize(padding, box-sizing...) (DONE)

5. Homepage `/` (DONE)

6. after this project, write blogs for grid, flex for future use

# 2020-06-13

1. implement similar `catchAsync` in DAO functions.(return function call not function definition)

2. Overview component(DONE)
   2.1 icon import(DONE)

3. what is svg sprite?

# 2020-06-14

1. Menu component(DONE)

2. modify box-shadow and learn it syntax

# 2020-06-15

1. Content brief component(
   3.1 front-end style(DONE)
   3.2 back-end data(DONE)
   3.3 xss middleware need to set a white list for post with html code
   )

2. Footer component(DONE)

3. Admin upload page(DONE)

4. add more monitor features in admin page in the future... not just uploading posts

5. modulize the post header component.(DONE)

6. polish the post block

7. improve the code hightlight feature. maybe make a editor block?

the problem is from md->html or from the code highlight package?

8. collapse the brief in homepage(line-clamp?)

# 2020-06-16

1. Post Page(
   1.1 post body
   1.2 comments component)(DONE)

2. help for development: automatically load posts from folder when server starts. So I can dynamically see changes in .md files

# 2020-06-17

1. Comments component v1.0(DONE)

2. add a share feature for post(share on wechat and so on)

3. login/logout feature(DONE)

4. add a modal container for login/register(DONE)

5. Modal content tab for switching between login/register(DONE)

# 2020-06-18

1. forms of login and register(DONE)

2. js code to upload login/register form data to backend(call api)(DONE)

3. learn `parcel` and compare it with `webpack`

4. `addEventListener` the last argument? meaning of setting to true?

5. learn `axios`. Use it instead of native Ajax call

6. add a username input to register form(DONE)

7. make an alert component for login/register.(DONE)

# 2020-06-19

1. make icon styles into mixin

2. check if user logged in(DONE)

# 2020-06-20

1. `express.json`, `express.urlencoded`, `express.raw`. which kind of data they handle for? write a summary

2. Logout feature(DONE)

3. add a flyout to user menu(DONE)

4. make manu component float when scroll down(DONE)

# 2020-06-23

1. change the SVG in user menu(DONE)

2. need to learn `e.preventDefault` and `e.stopPropagation`. Can I remove it in `index.js`

# 2020-06-24

1. finish dropdown list(DONE)

2. config nodeman, not watching public/js(DONE)

3. comments component 2.0(
   3.1 create a comment(DONE)
   3.2 display comments(DONE)
   )(DONE)

# 2020-06-30

1. like `catchAsync`, wrap all DAO function to avoid try..catch...

2. `ejs`: can i trim new line(`-%>`) and whitespace(`<%_ _%>`) at the same time?

3. learn more about `ejs` options

4. Docs Page(DONE)

5. login by github(DONE)

# 2020-07-01

1. learn more about OAuth 2.0

2. how to manage user registered by third party? need to do some research

3. Account Page(DONE)

4. A lot of new things on github, like GitHub Packages(https://help.github.com/en/packages), Github App....need to learn them

5. design user data model and login validation for third-party login, learn from online articles and write a post()

# 2020-07-02

1. `const { result, insertedId } = await UserDao.createOneUser(newUser);`

move the returned result to DAO, should not in the controller

2. learn `CORS policy` and `'Access-Control-Allow-Origin' header`

why `CORS` can make web safer?

3. I do understand this piece of code from a blog(https://juejin.im/post/5a9a68e7f265da23994dfb1f)

```js
githubLogin: function () {
      window.location.href = 'https://github.com/login/oauth/authorize?client_id=6625cb27769b1bc52415&redirect_uri=http://localhost:3000/login&scope=user:email';
      window.localStorage.setItem('GITHUB_LOGIN_REDIRECT_URL', `${this.$route.path}?comment=new`);
}
```

first, need to learn from office docs of github to see what `redirect_uri` means

4. read github oauth doc(https://docs.github.com/en/developers/apps/authorizing-oauth-apps) to learn and implement better workflow

5. (DONE)add features on account: change username, email.

6. set permissions on different routes and inputs.

7. after finish #5 and #6, go through previous notes and review current website. Make a list of what to do next.

8. difference between `justify-items` and `justify-content` in grid

# 2020-07-03

1. Add subscribe feature in account page.

2. Tag Page(v1.0) (DONE)

3. use JSNetworkX make a differnt tags view

# 2020-07-04

1. Search Page

2. use algolia search to build my search feature

3. maybe only need to add algolia UI widgets in front end?

because data is on algolia server, only need to send search input in front-end and get returned results.
