import passport from 'passport';
import { Router, Request, Response } from 'express';
import checkLoggedInMiddleware from '../middlewares/checkLoggedIn'

const linkedinAuthRouter = Router();

linkedinAuthRouter.get('/', (req, res) =>  {
  res.render('index.ejs');
});

linkedinAuthRouter.get('/linkedin/profile', checkLoggedInMiddleware, (req: Request, res: Response) => {
  const { user } = req

  res.render('linkedinProfile.ejs.ejs', { user });
});

linkedinAuthRouter.get('/linkedin/error', checkLoggedInMiddleware, (req: Request, res: Response) => {
  res.render('error.ejs');
});

linkedinAuthRouter.get('/auth/linkedin',
  passport.authenticate(
    'linkedin',
    {
      scope: ['public_profile', 'email']
    }
  )
);

linkedinAuthRouter.get('/auth/linkedin/callback',
  passport.authenticate(
    'linkedin',
    {
      successRedirect: '/linkedin/profile',
      failureRedirect: '/linkedin/error'
    }
  )
);

linkedinAuthRouter.get('/logout', (req: Request, res: Response) => {
  req.logout();
  res.redirect('/');
});

export default linkedinAuthRouter;