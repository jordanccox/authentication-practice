const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");
const { strict } = require("assert");

app.use(cookieParser());

app.get("/new-cookie", (req, res) => {
  res.cookie("my-cookie", "12345678910");
  res.set("Content-Type", "text/html");
  res.send(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cookies -- Yummy!</title>
    </head>
    <body>
      Your new cookie: ${req.cookies["my-cookie"]}
    </body>
    </html>`
  );
});

app.get("/cookie", (req, res) => {
  res.set("Set-Cookie", "myCookie=abcdefg123456");
  res.set("Content-Type", "text/html");
  res.send(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cookies -- Yummy!</title>
    </head>
    <body>
      Your new cookie: ${req.cookies["myCookie"]}
    </body>
    </html>`
  )
});

// For added security, cookies should expire after a given time
// httpOnly makes sure that the cookie’s data is not accessible to a script running client-side
app.get("/cookie-with-exp", (req, res) => {
  res.cookie("newCookie", "thisisacookiethatexpiresin2minutes", { maxAge: 2000 * 60, httpOnly: true}); // expires in 2 minutes
  res.set("Content-Type", "text/html");
  res.send(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cookies -- Yummy!</title>
    </head>
    <body>
      Your new cookie: ${req.cookies["newCookie"]}
    </body>
    </html>`
  );
});

// sessionIds should be at least 16 bytes
// secure attribute on a cookie header ensures that cookie is only sent over a secure channel such as HTTPS
app.get("/secure-cookie", (req, res) => {
  const newCookie = crypto.randomUUID(); 
  res.cookie("session", newCookie, { maxAge: 1000 * 60 * 10, httpOnly: true, secure: true, sameSite: "strict" });
  res.set("Content-Type", "text/html");
  res.send(
    `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Cookies -- Yummy!</title>
    </head>
    <body>
      Your new cookie: ${newCookie}
    </body>
    </html>`
  )
});

app.listen(5000, () => {
  console.log("Server listening on port 5000");
});