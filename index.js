const express = require('express');
const app = express();
const db = require('./models');
const { Users } = require('./models');
const router = require("./router/user");
const { Booksdata } = require('./models');
const routernew = require("./router/bookDetails");
const bcrypt = require('bcrypt');
const cors = require("cors");
const cookieParser = require("cookie-parser");
const { createTokens, validateToken } = require("./JWT");
const bodyParser = require("body-parser");
const session = require("express-session");
const jwt = require("jsonwebtoken");


app.use(express.json());
app.use(router);
app.use(routernew);
app.use(express.urlencoded({ extended: false }));
app.use(cors({
    origin: ["http://localhost:300"],
    methods: ["GET", "POST", "PUT"],
    credentials: true
}));
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    key: "userId",
    secret: "subscribe",
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 60 * 60 * 24,
    }
}));
app.set('view engine', 'ejs')

//for posting data into databas through register API
app.get("/register", (req, res) => {
    res.render("register");
})

app.post("/register", (req, res) => {
    const { username, password } = req.body;
    bcrypt.hash(password, 10).then((hash) => {
        Users.create({
            username: username,
            password: hash
        }).then(() => {
            res.json("User Register")
        }).catch((err) => {
            if (err) {
                res.status(400).json({ error: err });
            }
        })
    })
});

//for posting data to check wheteher user is registered and display logged in if user 
//present in data base
app.get("/login", (req, res) => {
    res.render("login");
})

app.post("/login", async(req, res) => {
    const username = req.body.username;
    const password = req.body.password;

    const user = await Users.findOne({ username: username });

    const dbPassword = user.password;
    bcrypt.compare(password, dbPassword).then((match) => {
        if (!match) {
            res.status(400).json("Incorrect password")
        } else {

            const accessToken = createTokens(user);
            res.cookie("access-token", accessToken, {
                maxAge: 60 * 60 * 24 * 30,
                httpOnly: true,
            });
            res.json("Logged in");
        }
    });
});

app.get("/profile", validateToken, (req, res) => {
    res.json("profile");
});

//for forget password page and resetting password 
//token link is sent to user on their email and on clicking that link user will be 
//able to change password

app.get('/forget-password', (req, res, next) => {
    res.render("forget-password");
})

const JWT_SECRET = 'some jwt secret ... put in env file';

app.post('/forget-password', (req, res, next) => {
    const username = req.body.username;
    console.log(username);
    if (username !== Users.username) {
        console.log(username);
        res.send("User does not Exist");
        return;
    }

    const secret = JWT_SECRET + Users.password;
    const payload = {
        username: Users.username,
        id: Users.id,
    }
    const token = jwt.sign(payload, secret, { expiresIn: '15m' });
    const link = `http://localhost:3000/reset-password/${Users.id}/${token}`;
    res.send("Password reset link has been sent to your email");
    console.log(link);
})

app.get('/reset-password/:id/:token', (req, res, next) => {
    const { id, token } = req.params;
    // check user present in database
    if (id != Users.id) {
        res.send("Invalid Username");
        return;
    }

    const secret = JWT_SECRET + Users.password;

    try {
        const payload = jwt.verify(token, secret);
        res.render("reset-password", { username: Users.username });

    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }
})


app.post('/reset-password', (req, res, next) => {
    const { id, token } = req.params;
    const { password, password2 } = req.body;
    //we are assuming passwords match
    if (id !== Users.id) {
        res.send("Invalid Username");
        return;
    }
    const secret = JWT_SECRET + Users.password;
    try {
        const payload = jwt.verify(token, secret);
        Users.password = password;
        res.send(Users);

    } catch (error) {
        console.log(error.message);
        res.send(error.message);
    }

})


//book database api where book data can be saved
app.post('/books', (req, res) => {
    const { Title, Author, ISBN } = req.body;
    Booksdata.create({
        Title: Title,
        Author: Author,
        ISBN: ISBN,
    }).then(() => {
        res.json("Book Infromation Saved");

    }).catch((err) => {
        if (err) {
            res.status(400).json({ error: err });
        }
    })
})

app.get("/books", (req, res) => {
    res.render("books");
    res.send("books");
})

app.get("/dataofBooks", (req, res) => {
    res.render("dataofBooks");
})

db.sequelize.sync().then((req) => {
    app.listen('3000', () => {
        console.log('Connection is setup at 3000');
    });
});