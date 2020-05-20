const express = require("express");
const app = express();
const compression = require("compression");
// - socket needs a Node server instead of Express one
// - we pass it our Express server so that all
// non-socket-related requests are handled
// by our Express server, but the socket one
// is handled by the Node server:
const server = require("http").Server(app);
// origins protects against attacks
// 'localhost:8080 mysocialnetwork.herokuapp.com:*' for deployment
const io = require("socket.io")(server, { origins: "localhost:8080" });
// io is an object
const cookieSession = require("cookie-session");
const db = require("./db");
const { showTime } = require("./showtime");
const { hash, compare } = require("./bc");
const csurf = require("csurf");
const cryptoRandomString = require("crypto-random-string");
const s3 = require("./s3");
const config = require("./config");

app.use(compression());

const cookieSessionMiddleware = cookieSession({
    secret: `I'm always hungry.`,
    maxAge: 1000 * 60 * 60 * 24 * 90,
});

app.use(cookieSessionMiddleware);

// with the following code
// socket.request.session will be available
// when a user connects

io.use(function (socket, next) {
    cookieSessionMiddleware(socket.request, socket.request.res, next);
});

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
            res.json({ success: false });
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
            // console.log(rows);
            let user = {
                id: rows[0].id,
                first: rows[0].first,
                last: rows[0].last,
                bio: rows[0].bio,
            };
            return user;
        })
        .then((user) => {
            return db
                .getAvatar([req.session.userId])
                .then(({ rows }) => {
                    user.image = rows[0].image;
                    // console.log("User: ", user);
                    res.json(user);
                })
                .catch((err) => {
                    console.log("Error in db.getAvatar: ", err);
                });
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
            .addImage(awsUrl, "avatar", req.session.userId)
            .then(({ rows }) => {
                let image = {
                    image: rows[0].image,
                };
                res.json(image);
            })
            .catch((err) => {
                console.log("Error in db.addImage: ", err);
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
                    bio: rows[0].bio,
                };
                return user;
            })
            .then((user) => {
                return db
                    .getAvatar([id])
                    .then(({ rows }) => {
                        user.image = rows[0].image;
                        res.json(user);
                    })
                    .catch((err) => {
                        console.log("Error in db.getAvatar: ", err);
                    });
            })
            .catch((err) => {
                console.log("Error in OtherUserProfile db.getUser: ", err);
                res.json({ noMatch: true });
            });
    }
});

// GET /api/users/:user

app.get("/api/users/:user", async (req, res) => {
    const user = req.params.user;
    if (user == "user") {
        const { rows } = await db.getLastUsers(req.session.userId);
        for (let i = 0; i < rows.length; i++) {
            let data = await db.getAvatar([rows[i].id]);
            rows[i].image = data.rows[0].image;
        }
        // console.log(rows);
        res.json(rows);
    } else {
        try {
            const { rows } = await db.findUsers(user);
            const finalRows = rows.filter(
                (row) => row.id !== req.session.userId
            );
            for (let i = 0; i < finalRows.length; i++) {
                let data = await db.getAvatar([finalRows[i].id]);
                finalRows[i].image = data.rows[0].image;
            }
            // console.log(finalRows);
            res.json(finalRows);
        } catch (err) {
            console.log("Error in findUsersFirst: ", err);
        }
    }
});

// GET /api/friendstatus/:id

app.get("/api/friendstatus/:id", async (req, res) => {
    const { id } = req.params;
    const { rows } = await db.friendStatus(id, req.session.userId);
    if (!rows.length) {
        res.json({ text: "Send Friend Request" });
    } else if (rows[0].accepted === false && rows[0].sender_id == id) {
        res.json({
            text: "Accept Friend Request",
            declineButton: true,
        });
    } else if (rows[0].accepted === false && rows[0].receiver_id == id) {
        res.json({ text: "Cancel Friend Request" });
    } else {
        res.json({ text: "End Friendship" });
    }
});

// POST /api/friendship/:id

app.post("/api/friendship/:id", (req, res) => {
    const { id } = req.params;
    const { text } = req.body;
    if (text == "Send Friend Request") {
        return db
            .addFriendsRow(id, req.session.userId)
            .then(() => {
                res.json({ text: "Cancel Friend Request" });
            })
            .catch((err) => {
                console.log("Error in db.addFriendsRow: ", err);
            });
    } else if (
        text == "Cancel Friend Request" ||
        text == "End Friendship" ||
        text == "Decline Friend Request"
    ) {
        return db
            .cancelFriend(id, req.session.userId)
            .then(() => {
                res.json({
                    text: "Send Friend Request",
                    friendship: false,
                });
            })
            .catch((err) => {
                console.log("Error in db.cancelFriend: ", err);
            });
    } else if (text == "Accept Friend Request") {
        return db
            .acceptFriend(id, req.session.userId)
            .then(() => {
                res.json({
                    text: "End Friendship",
                    friendship: true,
                });
            })
            .catch((err) => {
                console.log("Error in db.acceptFriend: ", err);
            });
    }
});

// GET /friends-wannabes

app.get("/friends-wannabes", async (req, res) => {
    try {
        const { rows } = await db.getFriendsWannabes(req.session.userId);
        for (let i = 0; i < rows.length; i++) {
            rows[i].created_at = showTime(rows[i].created_at);
            let data = await db.getAvatar([rows[i].id]);
            rows[i].image = data.rows[0].image;
        }
        res.json(rows);
    } catch (err) {
        console.log("Error in db.getFriendsWannabes: ", err);
    }
});

// GET /wall-posts/:id

app.get("/api/wall-posts/:id", async (req, res) => {
    const { id } = req.params;
    let data;
    if (id == "user") {
        data = await db.getWallPosts(req.session.userId);
    } else {
        data = await db.getWallPosts(id);
    }
    let response;
    for (let i = 0; i < data.rows.length; i++) {
        data.rows[i].created_at = showTime(data.rows[i].created_at);
        response = await db.getAvatar([data.rows[i].poster_id]);
        data.rows[i].image = response.rows[0].image;
    }
    console.log("data.rows: ", data.rows);
    res.json(data.rows);
});

// POST /add-post

app.post("/add-post", async (req, res) => {
    console.log("index.js line 463 calling in!");
    const { text, id } = req.body;
    let data;
    if (id == "user") {
        data = await db.addWallPost(
            text,
            req.session.userId,
            req.session.userId
        );
    } else {
        data = await db.addWallPost(text, req.session.userId, id);
    }
    const { rows } = await db.getUser(data.rows[0].poster_id);
    let post = {
        id: data.rows[0].id,
        poster_id: rows[0].id,
        first: rows[0].first,
        last: rows[0].last,
        text: data.rows[0].text,
        created_at: showTime(data.rows[0].created_at),
    };
    const response = await db.getAvatar([post.poster_id]);
    console.log("response: ", response);
    console.log("post: ", post);
    post.image = response.rows[0].image;
    res.json(post);
});

// GET /

app.get("*", (req, res) => {
    if (!req.session.userId) {
        res.redirect("/welcome");
    } else {
        res.sendFile(__dirname + "/index.html");
    }
});
// app is switched for server so that non-socket requests
// are handled by app (Express server), and socket requests
// are handled by the Node server
server.listen(8080, function () {
    console.log("I'm listening.");
});

// socket.io code

io.on("connection", (socket) => {
    const userId = socket.request.session.userId;
    // check if the user is logged in with
    // cookie session object
    // disconnect if not
    if (!userId) {
        return socket.disconnect(true);
    }

    // let onlineUsers = [
    //     {
    //         id: userId,
    //         socketId: socket.id,
    //     },
    //     ...
    //      or
    //      {
    //         id: userId,
    //         socketId: [socketId1, socketId2, ...],
    //      }
    //  }
    // ];
    // function getUsersByIds(arrayOfIds) {
    //     const query = `
    //     SELECT id, first, last, image
    //     FROM users WHERE id = ANY($1);`;
    //     // ANY loops through the passed array
    //     // and returns an array of objects
    //     return db.query(query, [arrayOfIds]);
    // }

    // socket.on("disconnect", function () {
    // do something when user disconnects
    // from my app
    // remove the id from onlineUsers
    // });

    let getLastMessages = async () => {
        const { rows } = await db.getLastMessages();
        for (let i = 0; i < rows.length; i++) {
            rows[i].created_at = showTime(rows[i].created_at);
            let data = await db.getAvatar([rows[i].id]);
            rows[i].image = data.rows[0].image;
        }
        let lastMsgs = rows.reverse(rows);
        io.sockets.emit("chatMessages", lastMsgs);
    };

    getLastMessages();

    // let getWallPosts = async (id) => {
    //     const { rows } = await db.getWallPosts(id);
    //     for (let i = 0; i < rows.length; i++) {
    //         rows[i].created_at = showTime(rows[i].created_at);
    //     }
    //     io.sockets.emit("wallPosts", rows);
    // };

    // getWallPosts(userId);

    socket.on("newMessage", (msg) => {
        return db.addMessage(msg, userId).then(({ rows }) => {
            let newMsg = {
                chats_id: rows[0].id,
                message: rows[0].message,
                sender_id: rows[0].sender_id,
                created_at: showTime(rows[0].created_at),
            };
            return db
                .getUser(userId)
                .then(({ rows }) => {
                    let wholeInfo = {
                        ...newMsg,
                        first: rows[0].first,
                        last: rows[0].last,
                    };
                    return wholeInfo;
                })
                .then((wholeInfo) => {
                    return db
                        .getAvatar([userId])
                        .then(({ rows }) => {
                            wholeInfo.image = rows[0].image;
                            io.sockets.emit("chatMessage", wholeInfo);
                        })
                        .catch((err) => {
                            console.log("Error in db.getAvatar: ", err);
                        });
                });
        });
    });
});
