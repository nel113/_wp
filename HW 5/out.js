// 01.js
import { Application } from "https://deno.land/x/oak/mod.ts";
var app = new Application();
app.use((ctx) => {
  console.log("url=", ctx.request.url);
  let pathname = ctx.request.url.pathname;
  if (pathname == "/") {
    ctx.response.body = `<html>
<body>
<h1>\u6211\u7684\u81EA\u6211\u4ECB\u7D39</h1>
<ol>
<li><a href="/Name">\u59D3\u540D</a></li>
<li><a href="/Age">\u5E74\u9F61</a></li>
<li><a href="/Gender">\u6027\u5225</a></li>
<li><a href="/School">\u5B78\u6821</a></li>
<li><a href="/ID">\u5B78\u865F</a></li>
</ol>
</body>
</html>
`;
  } else if (pathname == "/Name") {
    ctx.response.body = "\u4E01\u745E\u7965";
  } else if (pathname == "/Age") {
    ctx.response.body = "18";
  } else if (pathname == "/Gender") {
    ctx.response.body = "Man";
  } else if (pathname == "/School") {
    ctx.response.body = "Quemoy University";
  } else if (pathname == "/ID") {
    ctx.response.body = "111310520";
  }
});
console.log("start at : http://127.0.0.1:8000")(async () => {
  await app.listen({ port: 8e3 });
})();
