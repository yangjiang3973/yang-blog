# 关于Generator的介绍

0. Iterator

1. Generator Basics

```javascript
function* helloWorldGenerator() {
  yield 'hello';
  yield 'world';
  return 'ending';
}

var hw = helloWorldGenerator();
```

当你call helloWorldGenerator（），这个函数并不会立刻执行，也不会返回return的值。
而是返回一个指向内部状态的**指针对象**（Iterator Obj）。

接下来必须调用next（）方法来使指针移动到下一个状态。每次都是从上个暂停的地方开始，执行到下一个yield为止。
所以说generator函数是分段执行（分状态）。
yield是阶段暂停标志，next来继续执行。


```javascript
function* f() {
    for(var i = 0; true; i++) {
      var reset = yield i;
      if(reset) { i = -1; }
    }
}

var g = f();

g.next() // { value: 0, done: false }
g.next() // { value: 1, done: false }
g.next(true) // { value: 0, done: false }
```
yield表达式本身不会返回值给左边，只会将右边的值传出去给next。
但是next(param)可以将参数传给yield左边，在本次执行开始的时候，当作yield的返回值给左边

```javascript
// part of code in function* g() {}
a = yield 123; // stopped at this yield.
console.log(a);
b = yield 321;
console.log(b);
return 666;
```

- call g.next(888)
> next() call will resume function  
> first pass param 888 to a  
> execute console.log(a)  
> until yield 321, it will pass out 321 to this next()  
> stop here

- call g.next(999)
> next() call will resume function  
> first pass param 999 to b  
> execute console.log(b)  
> run until return, return 666 to this next()  
> done

next(param)用参数传入值很重要。因为generator函数的context，在所有状态结束前，是不会变得。
可以用param来给此轮next传入数据，给不同阶段的状态不同的信息和行为。
next方法的参数是传给上一个yield表达式返回值，所以第一个next的参数是无效的。
第一个next方法可以看作启动。

```javascript
function* foo(x) {
  var y = 2 * (yield (x + 1));
  var z = yield (y / 3);
  return (x + y + z);
}

var a = foo(5);
a.next() // Object{value:6, done:false}
a.next() // Object{value:NaN, done:false}
a.next() // Object{value:NaN, done:true}

var b = foo(5);
b.next() // { value:6, done:false }
b.next(12) // { value:8, done:false }
b.next(13) // { value:42, done:true }
```

如果想第一次next就传入值，可以再外面wrap一下
```javascript
function wrapper(generatorFunction) {
  return function (...args) {
    let generatorObject = generatorFunction(...args);
    generatorObject.next();  // start in wrapper
    return generatorObject;
  };
}

const wrapped = wrapper(function* () {
  console.log(`First input: ${yield}`);
  return 'DONE';
});

wrapped().next('hello!') // already start(call first next) in the wrapper so this next can pass value
// First input: hello!
```

可以这样理解next(param)传入值： 因为上一个阶段，到yield暂停，表示执行完了，结果也已经传出来了。下一个阶段，next()会**替换**之前的yield表达式，重新开始下一个阶段。


```javascript
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  // 手动遍历 foo()
  for (let i of foo()) {
    console.log(i);
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
```

嵌套的generator，遍历起来只能手动。比如foo在bar里，只能靠for...of...挨个遍历foo内部状态。

2. yield*
为了避免嵌套的generator手动的遍历内部状态，`yield *`表达式这个解决办法，可以在一个generator函数里执行另一个generator
```javascript
function* foo() {
  yield 'a';
  yield 'b';
}

function* bar() {
  yield 'x';
  yield* foo();
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  yield 'a';
  yield 'b';
  yield 'y';
}

// 等同于
function* bar() {
  yield 'x';
  for (let v of foo()) {
    yield v;
  }
  yield 'y';
}

for (let v of bar()){
  console.log(v);
}
// "x"
// "a"
// "b"
// "y"
```
我们可以近似的，把`yield *`表达式，看作等同于for...of...循环遍历，如果表达式右边的generator没有return语句
如果有return语句，那需要写作`let r = yield* g();`


另一个例子：
```javascript
function* concat(iter1, iter2) {
  yield* iter1;
  yield* iter2;
}

// 等同于

function* concat(iter1, iter2) {
  for (var value of iter1) {
    yield value;
  }
  for (var value of iter2) {
    yield value;
  }
}
```

在延伸一下，因为`yield*`表达式，会遍历右边，所以任何带有Iterator接口的数据类型，都可以放在右边进行遍历。
```javascript
function* gen(){
  yield* ["a", "b", "c"];
}

gen().next() // { value:"a", done:false }
```


3. Generator作为Object的属性
```javascript
let obj = {
  * myGeneratorMethod() {
    ···
  }
};
// the same
let obj = {
  myGeneratorMethod: function* () {
    // ···
  }
};
```

4. Generator与状态机
```javascript
var clock = function* () {
  while (true) {
    console.log('Tick!');
    yield;
    console.log('Tock!');
    yield;
  }
};
```

5. Generator与协程
在单线程的情况下，多个函数可以协作执行。只有一个函数处于运行状态，其他函数暂停。运行的函数可以在中间暂停，把运行权交给另外的函数。
之后再恢复运行，收回运行权。这样函数之间交换执行，互相协作，就叫做协程了。
代价是什么？因为多个函数协作，即使暂停了也不能收回内存，还是要保住暂停函数的stack，这样内存占用会大。
以内存换并行

协程与多线程有很多相似的地方，不同的地方在于，多线程在并发时，可以多个线程同时执行。
但是协程中，只可以有一个函数在执行。要执行其他函数，需要暂停并且交换执行权。

Generator中的yield可以用了交换函数控制权，所以协程函数完全可以用Generator实现。

6. Generator用在异步操作的同步表达
因为generator函数遇到yield会暂停往下执行，直到call next()再次恢复执行，所以可以用来处理异步操作。
可以把后续操作放到yield下面，等异步操作执行完，再next()执行后续操作。

所以Generator可以用来改写回调函数，将回调函数的形式写成同步表达。
```javascript
function* loadUI() {
  showLoadingScreen();
  yield loadUIDataAsynchronously();
  hideLoadingScreen();
}
var loader = loadUI();
// 加载UI
loader.next() // run loadUIDataAsynchronously() and stop at this yield

// 卸载UI
loader.next() // loading finished, contine
```

把generator用在AJAX里，当AjaxCall返回，callback里call next()，而不是把main()里的处理返回结果的逻辑也写在callback里。
这样就把执行逻辑和处理逻辑分开了

```javascript
function* main() {
  var result = yield request("http://some.url");
  var resp = JSON.parse(result);
    console.log(resp.value);
}

function request(url) {
  makeAjaxCall(url, function(response){
    it.next(response);  // use param in next to pass returned result
  });
}

var it = main();
it.next();
```

Generator可以用来控制执行逻辑，让代码避免callback hell，看起来更线性更直观。
```javascript
// 1. callback
step1(function (value1) {
  step2(value1, function(value2) {
    step3(value2, function(value3) {
      step4(value3, function(value4) {
        // Do something with value4
      });
    });
  });
});

// 2. promise
Promise.resolve(step1)
  .then(step2)
  .then(step3)
  .then(step4)
  .then(function (value4) {
    // Do something with value4
  }, function (error) {
    // Handle any error from step1 through step4
  })
  .done(); 

// 3. generator
function* longRunningTask(value1) {
  try {
    var value2 = yield step1(value1);
    var value3 = yield step2(value2);
    var value4 = yield step3(value3);
    var value5 = yield step4(value4);
    // Do something with value4
  } catch (e) {
    // Handle any error from step1 through step4
  }
}
```

我们可以发现，用generator最接近原生的线性代码执行流程。如果都是同步操作，可以用下面的例子中的代码（没有判断异步操作何时结束）。
```javascript
scheduler(longRunningTask(initialValue));

function scheduler(task) {
  var taskObj = task.next(task.value);
  // 如果Generator函数未结束，就继续调用
  if (!taskObj.done) {
    task.value = taskObj.value
    scheduler(task);
  }
}
```

# Generator异步应用

用generator来执行一个一步操作
```javascript
var fetch = require('node-fetch');

function* gen(){
  var url = 'https://api.github.com/users/github';
  var result = yield fetch(url);
  console.log(result.bio);
}

// execute this gen
var g = gen();
var result = g.next();  // fetch() will return a Promise Obj

result.value.then(function(data){
  return data.json();
}).then(function(data){
  g.next(data);
});
```
需要手动控制来call next()继续执行，这样的控制执行很不方便。


## Thunk function
有更好的办法可以来控制generator的执行。先插播一点题外话，什么是thunk function.
大多数编程语言，函数的参数都是传值调用(call by value)。如果参数是个表达式，会把这个表达式计算后的结果传入函数。
但是像Haskell则是传名调用(call by name)。不会计算参数表达式，直接传进去，用到的时候再计算结果。


如果想实现call by name，可以用另外一个函数封装一下，把这个临时函数作为参数传进去，需要的时候call这个临时函数。
这个临时函数就叫做thunk function。  

```javascript
function f(m) {
  return m * 2;
}

f(x + 5);

// 等同于
// thunk function here, wrap x + 5
var thunk = function () {
  return x + 5;
};

function f(thunk) {
  return thunk() * 2;
}
```

在js中，thunk function替换的不是一个表达式，而是多参数函数。将多参数函数，变成只接受一个callback的单参数函数。
```javascript
// 正常版本的readFile（多参数版本）
fs.readFile(fileName, callback);

// Thunk版本的readFile（单参数版本）
var Thunk = function (fileName) {
  return function (callback) {
    return fs.readFile(fileName, callback);
  };
};

var readFileThunk = Thunk(fileName);
readFileThunk(callback);
// or call in this way: Thunk(fileName)(callback)

```
加一层wrapper来接收除了callback之外的参数。  

其实任何多参数函数，都可以用thunk来转换：  
```javascript
// fn is the actual function you want to call(or you want to convert)
// all params except callback are wrapped in args
// finally pass callback

const Thunk = function(fn) {
  return function (...args) {
    return function (callback) {
      return fn.call(this, ...args, callback);
    }
  };
};

// use it to convert fs.readFile
var readFileThunk = Thunk(fs.readFile);
readFileThunk(fileA)(callback);
```
也可以理解成，把多参数函数，变成分批次传入参数，最后只接受一个callback作为单参数。

npm里有个Thunkify模块，可以直接用。

```javascript
var thunkify = require('thunkify');
var fs = require('fs');

var read = thunkify(fs.readFile);
read('package.json')(callback here);
```

看完了thunk function，回到本文的主题异步编程。  
Thunk的作用就是，可以帮助实现，generator的自动流程管理。

如果想让generator自动执行下去，可以用一个loop循环：  
```javascript
function* gen() {
  // ...
}

var g = gen();
var res = g.next();

while(!res.done){
  console.log(res.value);
  res = g.next();
}
```
但是这样并不适合异步操作，因为这段代码会一直执行下去直到结束，并不会保证异步操作的切换。  
这里就需要Thunk函数：
```javascript
var fs = require('fs');
var thunkify = require('thunkify');
var readFileThunk = thunkify(fs.readFile);

var gen = function* (){
  var r1 = yield readFileThunk('/etc/fstab');
  console.log(r1.toString());
  var r2 = yield readFileThunk('/etc/shells');
  console.log(r2.toString());
};


var g = gen();

var r1 = g.next();  // what is r1? what does readFileThunk return?
// readFileThunk will return a function that has one param(callback)
// since g is a generator, so this function is in value ({value: func, done: false})

r1.value(function (err, data) {
  if (err) throw err;
  var r2 = g.next(data);
  r2.value(function (err, data) {
    if (err) throw err;
    g.next(data);
  });
});
```

因为thunkify过之后，多参数函数变成了单参数函数，最后接受callback作为单参数的函数，会放在generator返回对象的value里。  
`r1.value(callback)`就是把callback传给该函数。这样就把执行层的代码和处理层的代码（callback）给分开了。  

从上面的代码可以发现，我们是在callback里面call next()，也就是吧next方法传入value里。那是不是可以用递归来完成自动执行呢？

Thunk函数可以自动执行generator函数：

```javascript
function run(fn) {
  var gen = fn();

  function next(err, data) {
    var result = gen.next(data);
    if (result.done) return;
    result.value(next);
  }

  next();
}

function* g() {
  // generator here
  var f1 = yield readFileThunk('fileA');
  var f2 = yield readFileThunk('fileB');
  // ...
  var fn = yield readFileThunk('fileN');
}

run(g);
```

在generator内部，执行流程看起来会像同步函数那样同步执行，对程序员更友好。异步操作的内容，原先要放在callback里，现在单独提取出来放到run()函数里。
这样把执行层和处理层的代码分开了。

总之，generator的自动执行，需要能够接受和交换执行权，用Thunk改写的callback可以做到这一点，在callback里call next()。同样的Promise也可以做到。

## co 模块
```javascript
var co = require('co');

co(gen).then(function (){
  console.log('Generator 函数执行完成');
});
```

co模块返回一个Promise，之前需要在callback里做的事情，可以放到then()里面。  
使用co模块的前提是，yield后面的表达式必须是thunk函数或者promise对象。

```javascript
var fs = require('fs');

var readFile = function (fileName){
  return new Promise(function (resolve, reject){
    fs.readFile(fileName, function(error, data){
      if (error) return reject(error);
      resolve(data);
    });
  });
};

var gen = function* (){
  var f1 = yield readFile('/etc/fstab');
  var f2 = yield readFile('/etc/shells');
  console.log(f1.toString());
  console.log(f2.toString());
};

// read file
var g = gen();

g.next().value.then(function(data){
  g.next(data).value.then(function(data){
    g.next(data);
  });
});
```

上面的代码其实就是手动在then方法里调用next，层层调用执行generator。
因为也是then和next的互相调用，类似之前callback和next的互相调用，其实也可以写成递归变成自动运行。  
```javascript
function run(gen){
  var g = gen();

  function next(data){
    var result = g.next(data);
    if (result.done) return result.value;
    result.value.then(function(data){
      next(data);
    });
  }

  next();
}

run(gen);
```

从本质上说，不管是Thunk还是Promise都是对callback的包装。目的还是让代码看起来更友好，避免callback hell。

# async函数
前面一直在讲generator和generator在异步操作的应用，但主要想讲的是async。为了讲清楚async，不得不从来源讲起。    
简单的说，async其实就是generator的syntax sugar（但不是简单的替换）。

从语法上来说，本来定义generator需要`function* ()`，但是有了async后可以不用星号，直接写作`async function()`，并且用await替换掉yield。

从功能上来说，async自带了执行器。上文中，generator要想自动执行，需要我们手写递归函数，或者使用co模块。但是async就不需要了，不需要我们来call next()。 
其次，async函数返回Promise对象，而不是generator返回Iterator对象，所以可以用promise的then方法指定下一步动作。

所以也可以把async看做多个异步操作封装到一个Promise对象里，await就是then的语法糖。

任何一个await语句后面的 Promise 对象变为reject状态，那么整个async函数都会中断执行。  
并且内部所有await命令后面的 Promise 对象执行完，才会发生状态改变，除非遇到return语句或者抛出错误。 
也就是说，只有async函数内部的异步操作执行完，它返回的promise对象才会执行then的callback。

如果不想一个await失败就停止执行后面的await，可以放到try...catch...block里面。  
```javascript
async function f() {
  try {
    await Promise.reject('出错了');
  } catch(e) {
  }
  return await Promise.resolve('hello world');
}

f()
.then(v => console.log(v))
// hello world
```


因为在async中，多个await是顺序执行。如果没有先后关系的await这么写，会影响并发性能。可以同时触发：
```javascript
// run in order
let foo = await getFoo();
let bar = await getBar();

// change to concurrent
let [foo, bar] = await Promise.all([getFoo(), getBar()]);

// the second way to run them concurrently
let fooPromise = getFoo();  // make them to promise obj?
let barPromise = getBar();
let foo = await fooPromise;
let bar = await barPromise;
```

## async函数实现的原理
简单来说，async函数本质上就是把generator和自动执行器合并到一起。  
```javascript
async function fn(args) {
  // ...
}

// 等同于

function fn(args) {
  return spawn(function* () {
    // ...
  });
}
```
