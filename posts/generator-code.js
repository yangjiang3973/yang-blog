// function* helloWorldGenerator() {
//     yield 'hello';
//     yield 'world';
//     return 'ending';
//   }
  
// var hw = helloWorldGenerator();

// console.log(hw);
// console.log(hw.next());  //{ value: 'hello', done: false }
// console.log(hw.next());  //{ value: 'world', done: false }
// console.log(hw.next());  //{ value: 'ending', done: true }
// console.log(hw.next());  //{ value: undefined, done: true }

// function* f() {
//     for(var i = 0; true; i++) {
//       var reset = yield i;
//       if(reset) { i = -1; }
//     }
// }

// var g = f();

// g.next() // { value: 0, done: false }
// g.next() // { value: 1, done: false }
// g.next(true) // { value: 0, done: false }

// function* f() {
//     a = yield 123;
//     console.log(a);
//     b = yield 321;
//     console.log(b);
//     return 666;
// }

// let g = f();

// console.log(g.next(111)); // { value: 123, done: false }
// console.log(g.next(111)); // a=111  // { value: 321, done: false }
// console.log(g.next(222)); // b=222  // { value: 666, done: true }




// let fs = require('fs');
// let thunkify = require('thunkify');

// let readFileThunk = thunkify(fs.readFile);

// let gen = function* () {
//     let r1 = yield readFileThunk('./Ajax.md');
//     console.log(r1.toString());
//     let r2 = yield readFileThunk('./ladder.md');
//     console.log(r2.toString());
// }

// let g = gen();

// let r1 = g.next();  // readFileThunk('./Ajax.md') will return here

// console.log(r1);

// r1.value((err, data) => {
//     if (err) throw err;
//     let r2 = g.next(data);  // pass to r1(in gen function) and resume
//     r2.value((err, data) => {
//         if (err) throw err;
//         g.next(data);
//     });
// });

// function* stateMachine() {
//     const resumeAfterA = yield "state A";
//     console.log(resumeAfterA);
//     const resumeAfterB = yield "state B";
//     console.log(resumeAfterB);
//     return "state end";
// }

// let g = stateMachine();
// let r1 = g.next();
// console.log(r1);
// let r2 = g.next("continue after A");
// console.log(r2);
// let r3 = g.next("continue after B");
// console.log(r3);  // { value: 'state end', done: true }

// const fs = require('fs');

// function* read(path) {
//     const dirData = yield function(callback) {
//         fs.readdir(path, callback);
//     };
//     console.log(dirData);
// }

// let gen = read('[your path of dir]');

// let first = gen.next();

// first.value((err, dir) => {
//     gen.next(dir);
// });

// // do some other tasks while waiting 
// console.log('other tasks');

// /* output:
// other tasks

// [your dir info]
// */

// const fs = require('fs');

// async function read(path) {
//     const dirData = await function(callback) {
//         fs.readdir(path, callback);
//     }
//     console.log(dirData);
// }

// let gen = read('/Users/yangjiang/dev/js/nodejs/my-blog/posts');
// console.log(gen.then((data)=>{console.log(data)}));
