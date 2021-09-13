import express, { Application } from 'express';
import session from 'express-session';
import passport from 'passport';
import { Strategy as LinkedInStrategy } from 'passport-linkedin-oauth2';
import { linkedinConfigs } from './src/common/configs'
import linkedinAuthRouter from './src/routers/linkedinAuth.route'

const app: Application = express();
const port = 3000;

// Views
app.set('view engine', 'ejs');
app.set('views','./src/views');

// Session
app.use(session({
  resave: false,
  saveUninitialized: true,
  secret: 'SECRET_KEY'
}));

// Passport
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser((user, cb) => {
  cb(null, user);
});

passport.deserializeUser((obj: any, cb: Function) => {
  cb(null, obj);
});

// Passport-facebook
passport.use(new LinkedInStrategy({
    clientID: linkedinConfigs.clientID,
    clientSecret: linkedinConfigs.clientSecret,
    callbackURL: linkedinConfigs.callbackURL,
    profileFields: ['r_emailaddress', 'r_liteprofile'], // <===
  }, (accessToken, refreshToken, profile, done) => {
    return done(null, profile);
  }
));

// Body parsing Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/', linkedinAuthRouter);

try {
  app.listen(port, (): void => {
    console.log(`Connected successfully on port ${port}`);
  });
} catch (error: any) {
  console.error(`Error occurred: ${error.message}`);
}
