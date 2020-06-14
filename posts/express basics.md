# 1. differnce between app.get() and "express.Route()"

Express 4.0 comes with the new Router. 
Router is like a mini express application
With routers you can ***modularize*** your code more easily

```javascript
/*set default root for this route*/
app.use('/api', router);

const router = express.Router();
// about page route (http://localhost:8080/api/about)
router.get('/about', function(req, res) {
    res.send('im the about page!'); 
});
```

more info in this article:
https://scotch.io/tutorials/learn-to-use-the-new-router-in-expressjs-4

# difference between req.send() req.json() and req.end()
But what if we want to send some data and end the response? The answer is simple, res.send() (and remember, res.json()) both allow us to send some data and they also end the response, so there's no need to explicitly call res.end().