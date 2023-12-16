const express = require("express");
const app = express();
const session = require("express-session");

app.use(session({
  secret: process.env.SECRET, // key used for signing and/or encrypting cookies to protect the session ID
  resave: false, // Setting this option to true will force a session to be saved back to the session data store, even when no data was modified. Typically, this option should be false, but also depends on your session storage strategy.
  saveUninitialized: false // If it’s set to true, the server will store every new session, even if there are no changes to the session object. This might be useful if we want to keep track of recurring visits from the same browser, but overall, setting this property to false allows us to save memory space.
}));

const PORT = process.env.PORT || 4001;

app.listen(PORT, () => {
  console.log(`Server is listening on port ${PORT}`);
});