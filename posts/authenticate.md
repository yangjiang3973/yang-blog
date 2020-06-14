## 1. session

For GET requests, the server assumes that you're going to be sending data back, and will automatically save session data once the route is fully processed.

For POST requests (what I'm using), however, the same assumption isn't made. Session states are only saved in one of two conditions - either when data is being sent out (through res.send, res.redirect, etc.), or if you manually call req.session.save(). I was already calling /login from an AJAX request, I just wasn't returning anything if certain conditions were met. Having the server respond to the client with some data after setting the session variable fixed this.

## 2. OAuth 2.0