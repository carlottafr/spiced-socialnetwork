const express = require("express");
const app = express();
const compression = require("compression");
const cookieSession = require("cookie-session");
const db = require("./db");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const s3 = require("./s3");
const config = require("./config");

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
// Serve /public files

app.use(express.static("./public"));

// parses the req.body

app.use(express.json());

// Image upload boilerplate start v
// will upload sent files to my
// hard drive in a folder called /uploads

const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});

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
    let { first, last, email, password } = req.body;
    hash(password)
        .then((hashedPw) => {
            return db.register(first, last, email, hashedPw);
        })
        .then(({ rows }) => {
            req.session.userId = rows[0].id;
            res.json({ success: true });
        })
        .catch((err) => {
            console.log("Error in POST /register in index.js: ", err);
        });
});

// POST /password/reset/start

app.post("/password/reset/start", (req, res) => {
    let { email } = req.body;
    db.login(email)
        .then(({ rows }) => {
            const secretCode = cryptoRandomString({
                length: 6,
            });
            db.addCode(rows[0].email, secretCode)
                .then(({ rows }) => {
                    let to = rows[0].email;
                    let subject = "Reset Password";
                    let text =
                        "This is the secret code for your password reset, use it within 10 minutes: " +
                        secretCode;
                    s3.sendEmail(to, subject, text)
                        .then(() => {
                            res.json({ success: true });
                        })
                        .catch((err) => {
                            console.log("Error in ses.sendEmail: ", err);
                            res.json({ success: false });
                        });
                })
                .catch((err) => {
                    console.log("Error in db.addCode: ", err);
                    res.json({ success: false });
                });
        })
        .catch((err) => {
            console.log("Error in db.login: ", err);
            res.json({ mailerror: true });
        });
});

// POST /password/reset/verify

app.post("/password/reset/verify", (req, res) => {
    let { email, code, password } = req.body;
    db.checkCode(email)
        .then(({ rows }) => {
            if (code === rows[0].code) {
                hash(password)
                    .then((hashedPw) => {
                        db.updatePw(email, hashedPw)
                            .then(() => {
                                res.json({ success: true });
                            })
                            .catch((err) => {
                                console.log("Error in db.updatePw: ", err);
                            });
                    })
                    .catch((err) => {
                        console.log("Error in hashPw: ", err);
                    });
            } else {
                res.json({ codeerror: true });
            }
        })
        .catch((err) => {
            console.log("Error in db.checkCode: ", err);
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

// GET /user

app.get("/user", (req, res) => {
    return db
        .getUser(req.session.userId)
        .then(({ rows }) => {
            let user = {
                id: rows[0].id,
                first: rows[0].first,
                last: rows[0].last,
                imageUrl: rows[0].image_url,
                bio: rows[0].bio,
            };
            res.json(user);
        })
        .catch((err) => {
            console.log("Error in db.getUser: ", err);
        });
});

// POST /avatar-upload

app.post("/avatar-upload", uploader.single("file"), s3.upload, (req, res) => {
    let awsUrl = config.s3Url;
    awsUrl += req.file.filename;

    if (req.file) {
        return db
            .addAvatar(req.session.userId, awsUrl)
            .then(({ rows }) => {
                let image = {
                    imageUrl: rows[0].image_url,
                };
                res.json(image);
            })
            .catch((err) => {
                console.log("Error in db.addAvatar: ", err);
                res.json({ success: false });
            });
    } else {
        res.json({ noPic: true });
    }
});

app.post("/save-bio", (req, res) => {
    let bio = req.body.draftBio;
    return db
        .updateBio(req.session.userId, bio)
        .then(({ rows }) => {
            let bio = {
                bio: rows[0].bio,
            };
            res.json(bio);
        })
        .catch((err) => {
            console.log("Error in db.updateBio: ", err);
            res.json({ success: false });
        });
});

// GET /logout

app.get("/logout", (req, res) => {
    req.session = null;
    res.redirect("/");
});

// GET /api/user/:id

app.get("/api/user/:id", (req, res) => {
    let id = req.params.id;
    if (id == req.session.userId) {
        res.json({ sameUser: true });
    } else {
        return db
            .getUser(id)
            .then(({ rows }) => {
                let user = {
                    first: rows[0].first,
                    last: rows[0].last,
                    imageUrl: rows[0].image_url,
                    bio: rows[0].bio,
                };
                res.json(user);
            })
            .catch((err) => {
                console.log("Error in OtherUserProfile db.getUser: ", err);
                res.json({ noMatch: true });
            });
    }
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
