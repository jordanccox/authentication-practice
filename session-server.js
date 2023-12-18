const express = require("express");
const app = express();
const session = require("express-session");
const db = require("./fake-db.js");
const store = new session.MemoryStore(); // in-memory store provided by express-session. DON'T use in production as this is a security risk
const PORT = process.env.PORT || 4001;

app.use(express.json()); // parsing json bodies
app.use(express.urlencoded({ extended: false })); // parses url encoded payloads
app.set("view engine", "ejs");

app.use(session({
  secret: process.env.SECRET || "1234", // key used for signing and/or encrypting cookies to protect the session ID,
  cookie: { maxAge: 1000 * 60 * 60 * 24, secure: false}, // only set httpOnly: true, secure: true, sameSite: "none" in production environment
  resave: false, // Setting this option to true will force a session to be saved back to the session data store, even when no data was modified. Typically, this option should be false, but also depends on your session storage strategy.
  saveUninitialized: false, // If it’s set to true, the server will store every new session, even if there are no changes to the session object. This might be useful if we want to keep track of recurring visits from the same browser, but overall, setting this property to false allows us to save memory space.
  store,
}));

const authorizeUser = (req, res, next) => {
  if (req.session.authenticated) {
    return next();
  } else {
    console.log(req.session);
    res.redirect("/login");
  }
}

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = db.findByUsername(username);

  if (!user) {
    return res.status(401).send("Unauthorized");
  }

  if (user.password === password) {
    req.session.authenticated = true;
    req.session.user = user;
    res.redirect("/protected-route");
  } else {
    res.status(401).send("Password doesn't match")
  }
});

app.get("/protected-route", authorizeUser, (req, res) => {
  res.render("protected");
});

app.get("/logout", authorizeUser, (req, res) => {
  req.session.authenticated = false;
  req.session.user = {};
  res.redirect("/login");
});


app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});