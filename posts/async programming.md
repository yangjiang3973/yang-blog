# what is async programming

The 3 functions `prinString()` will be execute in order but will not return in order.
```javascript
function printString(string){
  setTimeout(
    () => {
      console.log(string)
    }, 
    Math.floor(Math.random() * 100) + 1
  )
}

function printAll(){
  printString("A");
  printString("B");
  printString("C");
}

printAll();
```

## Callback
A basic way is to use callback to print "ABC" in order. When 'A' printed, then execute `printString(B)` and wait for 'B'. After that execute 'C'.
``` javascript
function printString(string, callback){
  setTimeout(
    () => {
      console.log(string)
      callback()
    }, 
    Math.floor(Math.random() * 100) + 1
  )
}

function printAll(){
    printString('A', ()=>{ 
        printString('B', ()=>{
            printString('C', ()=>{})
        })
    })
}

printAll();
```

Nested callbacks may result in "callback hell" if we have too many async function need to be handled in order.

So we use ```Promise``` to make our code clean and easy to read.

## Promise

```javascript
function printString(string){
  return new Promise((resolve, reject) => {
    setTimeout(
      () => {
       console.log(string)
       resolve()
      }, 
     Math.floor(Math.random() * 100) + 1
    )
  })
}
```
The logic is similar but it wraps function in the Promise object and return it. Replace `callback` with `resolve`.

```javascript
function printAll(){
  printString("A")
  .then(() => printString("B")
  )
  .then(() =>  printString("C")
  )
}
printAll()
```
`printString` returns a Promise to avoid nested structure by using `Promise Chain`

## async/await
Actually `Await` is a syntax sugar of Promise. It will make you code cleaner and similar to procedural/synchronous programming.

```javascript
async function printAll(){
  await printString("A")
  await printString("B")
  await printString("C")
}
printAll();
```

`await` cannot be used in global level, you have to wrap it within `async`. Because you need `async` to let js knows that here is an asynchronous code to execute.

# Details of Promise
From my understanding, Promise is a abstract of execution operations and handling operations. So programmers can focus more on handling, execution code is much more clear(promise chain).


`Promise` has 3 status: pending, fulfilled and rejected.
Only the result of async operation can decide the status.
Nobody can cancle or change the status once it starts. When it is in pending status, we cannot know the progress.

```javascript
const promise = new Promise((resolve, reject) => {
  // ... some code

  if (/* succeed */){
    resolve(value);
  } else {
    reject(error);
  }
});
```

Notice: the constructor accepts a function with 2 special params `resolve` and `reject`. They are provided by js engine.

`resolve`: change the `Promise` status from pending to fulfilled. The async operation result will pass as a param value to resolve function. It will call the callback function in `then` method once the status changes. In promise chain, the first `then`'s returned value will pass to the second `then` as a param. So we can decide the order of callbacks and avoid nested callback hell. 

`reject`: change the `Promise` status from pending to rejected. The returned error mesg will be param for reject function.

Use then method on promise instance to defind `resolve` and `reject`.  
 `.then` accept 2 params, the first if for resolve and the second one is for reject(optional).  
```javascript
promise.then(value => {
  // success
}, error => {
  // failure
});
```

`promise.catch()` is just another way to handle rejected status. It is equal to `.then(null/undefined, rejection)`.
Usually, do not define `reject` in the second param, instead use catch method.

This way can catch the error in `.then` method.

```javascript
promise
  .then(data => { //cb
    // success
  })
  .catch(err => {
    // error
  });
```

`finally` is a method that will execute no matter what the final status is. So the code in `finally` block should not depend on any status.  
```javascript
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```

`Promise.all()` and `Promise.race()` can wrap a couple of promise into a new promise.  
They have different way to decide the new promise's final status: all=AND, race=OR
```javascript
const p = Promise.all([p1, p2, p3]);
const p = Promise.race([p1, p2, p3]);
```



## TODO 
continue:  
http://es6.ruanyifeng.com/#docs/async

http://es6.ruanyifeng.com/#docs/promise#%E5%BA%94%E7%94%A8






