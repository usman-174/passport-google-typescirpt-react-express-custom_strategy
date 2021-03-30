import { v4 } from 'uuid'
import  passport  from 'passport'
import { Strategy as GoogleStrategy } from "passport-google-oauth20"
import { Strategy as GithubStrategy } from "passport-github"
import { User } from '../Models/User'
import { config } from "dotenv"
config()


passport.serializeUser((user: any, done: any) => {
    return done(null, user._id)
  })
  passport.deserializeUser(async (userId: string, done: any) => {
    const user = await User.findById(userId)
  
    return done(null, user)
  })
  
  passport.use(
    new GoogleStrategy(
      {
        clientID: String(process.env.GOOGLE_CLIENT_ID),
        clientSecret: String(process.env.GOOGLE_SECRET),
        callbackURL: "/auth/google/callback",
      },
      async function (_: string, __: string, profile, cb) {
        const exists = await User.findById(profile.id)
        if (!exists) {
          console.log("CREATIN NEW USER IN DB")
  
          const user = new User({
            _id: profile.id,
            username: profile.name?.givenName,
            email: (profile.emails as any)[0].value,
            provider: profile.provider,
            password: profile.name?.familyName + v4(),
          })
          await user.save()
          return cb(null, user)
        }
        console.log("USER FOUND BY ID")
        return cb(null, exists)
      }
    )
  )
 
  passport.use(
    new GithubStrategy(
      {
        clientID: `${process.env.GITHUB_CLIENT_ID}`,
        clientSecret: `${process.env.GITHUB_CLIENT_SECRET}`,
        callbackURL: "/auth/github/callback",
        passReqToCallback: true,
      },
      async function (req: any, _: any, __: any, profile: any, cb: any) {
        console.log("REQUEST USER :", req?.user)
        const exists = await User.findById(profile.id)
        if (!exists) {
          console.log("CREATIN NEW USER IN DB")
  
          const user = new User({
            _id: profile.id,
            username: profile.username,
            email: (profile.emails as any)[0].value,
            provider: profile.provider,
            password: profile.username + v4(),
          })
          await user.save()
          return cb(null, user)
        }
        console.log("USER FOUND BY ID")
        return cb(null, exists)
      }
    )
  )
  