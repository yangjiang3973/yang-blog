# <center>take notes while reading</center>

1. basic example  

传统的web，对于每个请求，服务器都是返回一个全新的页面（整个页面的刷新）。

有时候即使只改变了一个数字，一行文字，都要刷新整个页面。

即使浏览器很聪明，缓存了大部分的图片和css，但是仍然存在大量浪费的通信。

所以需要Ajax来向服务器请求，真正需要的数据。通信量变少，等待时间变短。

Ajax不是全新的技术，而是用现有已知的技术，用全新的方式来实现。

```html
<html>
    <head>
        <script src="scripts/thumbnails.js"></script>
    </head>

    <body>
        <div id="thumbnailPane">
            <!-- some <img> here -->
        </div>

        <div id="detailsPane">
            <div id="description">
            <!-- some detailed info of each product -->
            </div>
        </div>
    </body>
</html>
```

```javascript
function createRequest() {
    try {
        request = new XMLHttpRequest();
    } catch(tryMS) {
        try {
            request = new ActiveXObject("Msxml2.XMLHTTP"); // for ms
        }
    }

    return request;
}

function getDetails() {
    const request = createRequest();
    const url = 'some url string';
    request.open("GET", url, true);  // true means async
    request.onreadystatechange = displayDetails;  //callback
    request.send(null);
}

function displayDetails() {
    if （request.readyState === 4）{    // init with 0, shows server side progress, 4 means done
        if (request.status === 200) {   // HTTP status code 200=success
            // use request.responseText，change innerHTML here
        }
    }
}
```

2. think in AJAX

用户案例：注册的时候，用户输入了N个条目，结果因为用户名被占用，服务器返回错误，结果全部已经输入的其他信息都不见了，又要重新输入一遍。

方案：在用户输入用户名时就查重，并且不会重新加载整个页面，其他信息不会丢失。

PS：其实你的代码，是在和浏览器通信，然后浏览器再去和服务器通信。但是我们习惯性的会说成和服务器通信。

关于readyState:
最初的时候readyState是0，请求准备好可以发送变成1，服务器正在处理是2，数据开始返回但是还没全接收到是3，最后数据可以用了是4。
在这个过程中，服务器会发送多个readyState来告知状态。

`onreadystatechange`会在每次改变的时候，调用callback

要在这个callback里检查readyState来处理响应。

3. response your client

可以通过Ajax请求，返回一个html片段。
`request.responseText`

4. handle multiple events
为同一个事件指定多个事件处理函数(event handler)，只会运行最后一个。
```javascript
button.onmouseover = buttonOver;
button.onmouseover = showhint;
```

多个事件处理函数，可以用`addEventListener()`添加。
`addEventListener`适用于所有支持DOM Level 2的浏览器（IE 8及以前的不支持）。  

```javascript
currentBtn.addEventListener("mouseover", showHint, false);
currentBtn.addEventListener("mouseover", buttonOver, false);
```

最后一个参数指示`事件浮升event bubbling`（false）还是`事件捕获event capturing`(true)

5. Async application
建立多个对象，使用多个不同的请求。
如果使用了一个对象，来建立多个异步请求，最后一个请求返回的数据，会覆盖之前请求的数据。

```javascript
t = setInterval("scrollImg()", 50);
```

6. DOM tree

对于浏览器来说，DOM就是浏览器把html文档看做document对象。

Ajax动态的响应客户，DOM允许动态的修改页面。二者结合可以构建动态响应的应用。

7. Manage DOM

少用innerHTML，这样会把js和html代码混淆在一起，而且容易出错。

8. Packages

如果你已经了解了异步请求Ajax的用法，学习一种新的Ajax框架会很快。

一定要了解你的代码。

9. XML request and response

如何从服务器端获得多值数据，而不是简单的一个ok或者deny。

方法有很多，xml，csv（逗号分割），或者数据用html组织好，JSON。

最好还是用JSON。

10. JSON

可以表示为文本方便网络传输，在需要处理数据的时候表示为一个对象。  
`let jsonDara = request.responseText;`

可以用eval()来将文本转换成对象。但是比较危险，容易运行恶意或者错误的代码，需要在计算前进行解析。  

js没有内置的方法判断是否是数组类型，即使是typeof也是返回object类型。  

11. Form and check

先用控件限制，比如生日用生日的专有input，不行再求助js在客户端检查数据格式，最后数据一致性等需要访问数据库的在访问服务器，检查数据内容。分层检查。

尽量不要向服务器发送格式不正确的数据，服务端不应该把精力花在格式化问题上。

而且在客户端验证数据格式，反馈更快，不用等网络返回。

约束->合法->一致性

12. POST request
POST不发送明文，GET可以url中发送请求数据。  
一个POST请求中，数据和url是分开的， 数据已经经过了编码。
Ajax中发送POST请求，把数据放到send()中而不是url参数，并且需要告诉服务器端数据类型(content-type)，才能解码。  
```javascript
request.setRequestHeader("Content-Type", "one type here");
request.send(data);
```


