const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const csurf = require("csurf");

app.use(compression());

app.use(
    cookieSession({
        secret: `I'm always hungry.`,
        // v cookie becomes invalid after 2 weeks
        maxAge: 1000 * 60 * 60 * 24 * 14,
    })
);

// CSRF security

app.use(csurf());

app.use(function (req, res, next) {
    res.cookie("mytoken", req.csrfToken());
    next();
});

// parses the req.body

app.use(express.json());

// Serve /public files

app.use(express.static("./public"));

if (process.env.NODE_ENV != "production") {
    app.use(
        "/bundle.js",
        require("http-proxy-middleware")({
            target: "http://localhost:8081/",
        })
    );
} else {
    app.use("/bundle.js", (req, res) => res.sendFile(`${__dirname}/bundle.js`));
}

// GET /welcome

app.get("/welcome", (req, res) => {
    if (req.session.userId) {
        res.redirect("/");
    } else {
        res.sendFile(__dirname + "/index.html");
        // ^ renders the welcome component
    }
});

// POST /register

app.post("/register", (req, res) => {
    console.log("This is the req.body: ", req.body);
    let { first, last, email, password } = req.body;
    hash(password)
        .then((hashedPw) => {
            return db.register(first, last, email, hashedPw);
        })
        .then(({ rows }) => {
            req.session.userId = rows[0].id;
            console.log("This is the session object: ", req.session);
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("Error in POST /register in index.js: ", err);
        });
});

// POST /login

app.post("/login", (req, res) => {
    let databasePw, id;
    let { email, password } = req.body;
    db.login(email)
        .then(({ rows }) => {
            databasePw = rows[0].password;
            id = rows[0].id;
            return databasePw;
        })
        .then((databasePw) => {
            return compare(password, databasePw);
        })
        .then((matchValue) => {
            if (matchValue) {
                req.session.userId = id;
                res.json({ success: true });
            } else {
                res.json({ success: false });
            }
        })
        .catch((err) => {
            console.log("Error in db.login: ", err);
            res.json({ success: false });
        });
});

// GET /

app.get("*", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});

app.listen(8080, function () {
    console.log("I'm listening.");
});
