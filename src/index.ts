import cors from "cors"
import { config } from "dotenv"
import express, { Request, Response } from "express"
// import { Strategy as GoogleStrategy } from "passport-google-oauth20"
// import { Strategy as GithubStrategy } from "passport-github"
import session from "express-session"
import jwt from "jsonwebtoken"
import cookie from "cookie"
import cookieParser from "cookie-parser"
import mongoose from "mongoose"
import passport from "passport"
import { User } from "./Models/User"
import { v4 } from "uuid"
import { isAuth } from "./middlewares/auth"
// SETUP

require("./services/passport")

const app = express()
config()

app.get("/", (_: Request, res: Response) => {
  _.logOut()
  res.send("HELLLO FROM INDEX PAGE")
})

// MIDDLEWARES
app.use(express.json())
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "development"
        ? `http://localhost:3000`
        : process.env.CLIENT_URL,
    credentials: true,
  })
)
app.use(
  session({
    secret: process.env.SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
  })
)
app.use(cookieParser())
app.use(passport.initialize())
app.use(passport.session())

app.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile email"] })
)

app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/login" }),
  function (_, res) {
    // Successful authentication, redirect home.

    res.redirect(
      `${
        process.env.NODE_ENV === "development"
          ? `http://localhost:3000`
          : process.env.CLIENT_URL
      }`
    )
  }
)

app.get("/auth/github", passport.authenticate("github"))

app.get(
  "/auth/github/callback",
  passport.authenticate("github", {
    failureRedirect: "http://localhost:3000/login",
    session: true,
  }),
  function (_, res) {
    res.redirect("http://localhost:3000")
  }
)

app.post("/auth/register", async (req: Request, res: Response) => {
  const { email, username } = req.body
  if (!email || !username) return res.json({ error: "Invalid Arguments" })

  const user = new User({
    username,
    email,
    provider: "local",
    _id: v4(),
  })
  await user.save()

  return res.json({ msg: "User Successfully Registered NOW LOGININ" })
})
app.post("/auth/login", async (req: Request, res: Response) => {
  if (req.user || (req.user as any)?.provider !== "local") {
    console.log("User was Oauthed")
    console.log("----------------------")

    req.logout()
    res.clearCookie("connect.sid")
  }
  console.log("------------------------------")

  const { email, password } = req.body
  if (!email || !password) return res.json({ error: "Invalid Arguments" })

  const user = await User.findOne({ password, email, provider: "local" })

  if (!user) {
    return res.json({ msg: "Invalid Credentials" })
  }
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET as string)

  res.set(
    "Set-Cookie",
    cookie.serialize("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 3600,
      path: "/",
    })
  )

  return res.json(user)
})

app.post("/register", async (req: Request, res: Response) => {
  const { email, password, username } = req.body

  if (!email || !password || !username) {
    return res.json({ error: "Invalid Details Provided" })
  }

  if (req?.user) {
    return res.json({ error: "You need to be loggedout to register" })
  }

  console.log(username, password, email)

  const user = new User({
    _id: v4(),
    username,
    email,
    password,
  })
  console.log("user saved=", user)

  await user.save()
  return res.json({ msg: "You are logged In", user })
})

app.get("/getuser", isAuth, (req: Request, res: Response) => {
  if (req.user) {
    return res.json({user:req.user})
  }
  return res.send("User not found")
})

app.get("/auth/logout", isAuth, (req, res) => {
  req.logout()
  res.clearCookie("connect.sid")
  res.clearCookie("token")
  res.send("done")
})

mongoose.connect(
  String(process.env.DB_URL),
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useFindAndModify: true,
  },
  () => {
    console.log("Connected To DATABSE(MONGODB) ")
  }
)
app.listen(process.env.PORT, () => {
  console.log(` listining to http://localhost:${process.env.PORT}`)
})
