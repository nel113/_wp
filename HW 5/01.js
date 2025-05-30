import { Application } from "https://deno.land/x/oak/mod.ts";

const app = new Application();

app.use((ctx) => {
  // ctx.response.status = 404
  console.log('url=', ctx.request.url)
  let pathname = ctx.request.url.pathname
  if (pathname == '/') {
    ctx.response.body = `<html>
<body>
<h1>我的自我介紹</h1>
<ol>
<li><a href="/name">姓名</a></li>
<li><a href="/age">年齡</a></li>
<li><a href="/gender">性別</a></li>
<li><a href="/university">大學</a></li>
<li><a href="/ID">學號</a></li>
</ol>
</body>
</html>
`
  } else if (pathname == '/name') {
    ctx.response.body = '盧隆勝'
  } else if (pathname == '/age'){
    ctx.response.body = '18'
  } else if (pathname == '/gender'){
    ctx.response.body = '男'
  } else if(pathname == 'university'){
    ctx.response.body = '金門大學'
  } else {
    ctx.response.body = '111310527'
  }
  // ctx.response.body = 'Not Found!'
});

console.log('start at : http://127.0.0.1:8000')
await app.listen({ port: 8000 })