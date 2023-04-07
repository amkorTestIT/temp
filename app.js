const createError = require('http-errors')
const express = require('express')
const path = require('path')
const cookieParser = require('cookie-parser')
const logger = require('morgan')
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const { getAccount, findById, signup } = require('./models/users.js')
const session = require('express-session')
// const MongoStore = require('connect-mongo')
const bcrypt = require('bcryptjs')
console.log(path.join(__dirname, `.env.serve-${process.env.NODE_ENV}`))
require('dotenv').config({
    path: path.join(__dirname, `.env.serve-${process.env.NODE_ENV}`),
})
// const cookieSession = require('cookie-session')
const usersRouter = require('./routes/users')
const lotRouter = require('./routes/lot')
const waferRouter = require('./routes/wafer')
const errorLogRouter = require('./routes/errorLog')

const { dateFormat } = require('./utils/format/date')
const mongoose = require('./utils/dbTool/db')
mongoose()
//Global varible
// IssueCounter = require('./utils/counter')()
// const job = require('./jobs/issueCounter')()

const app = express()

// view engine setup
app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

app.use(logger('dev'))
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cookieParser())
app.use(express.static(path.join(__dirname, 'public')))

/*---------------------------------------------------------*/
// Use Session
const db = {
    name: process.env.DB_NAME || '',
    host: process.env.DB_HOST || '',
    port: process.env.DB_PORT || '',
    user: process.env.DB_USER || '',
    password: process.env.DB_USER_PWD || '',
}
console.log(db)
app.use(
    session({
        secret: 'secret',
        resave: false,
        saveUninitialized: false,
    })
)
/*---------------------------------------------------------*/
// 初始化 Passport
app.use(passport.initialize())
app.use(passport.session())
// localStrategy
passport.use(
    'login',
    new LocalStrategy(
        { usernameField: 'account', passwordField: 'password' },
        async (account, password, done) => {
            try {
                const user = await getAccount(account)
                if (!user) return done(null, false)
                if (!bcrypt.compareSync(password, user.password))
                    return done(null, false)
                return done(null, user)
            } catch (err) {
                if (err) return done(err)
            }
        }
    )
)
passport.use(
    'register',
    new LocalStrategy(
        {
            passReqToCallback: true,
            usernameField: 'account',
            passwordField: 'password',
        },
        async (req, account, password, done) => {
            try {
                const existingUser = await getAccount(account)
                if (existingUser) return done(null, false)
                const hashedPassword = await bcrypt.hash(password, 10)
                const newUser = await signup(
                    {
                        account,
                        password: hashedPassword,
                    },
                    'EDITOR'
                )
                return done(null, newUser)
            } catch (err) {
                return done(err)
            }
        }
    )
)
// 序列化和反序列化
passport.serializeUser((user, done) => {
    process.nextTick(function () {
        // console.log('serializeUser', user);
        return done(null, {
            _id: user._id,
            roles: user.roles,
            account: user.account,
            displayname: user.displayname,
        })
    })
})
passport.deserializeUser((user, done) => {
    process.nextTick(async () => {
        const storedUser = await findById(user._id)
        if (!storedUser) return done(null, false)
        return done(null, storedUser)
    })
})
/*-------------------------------------------------------------------------*/
app.use('/users', usersRouter)
app.use('/lot', lotRouter)
app.use('/wafer', waferRouter)
app.use('/errorLog', errorLogRouter)

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404))
})

// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    // res.locals.message = err.message
    // res.locals.error = req.app.get('env') === 'development' ? err : {}

    // render the error page
    // res.status(err.status || 500)
    res.render('error', {
        msg: err.message,
        data: JSON.stringify({
            date: dateFormat(),
        }),
    })
})

module.exports = app
