import { Strategy } from "passport-local";

const configurePassport = (passport, UsersService) => {
  passport.use(
    "local",
    new Strategy(
      { usernameField: "email", passwordField: "password" },
      async (email, password, done) => {
        try {
          const user = await UsersService.getUserByEmail(email);
          if (!user) return done(null, false, { message: "User not found" });
          const isValid = await UsersService.verifyUserPassword(user, password);
          if (isValid) {
            return done(null, user);
          } else {
            return done(null, false, { message: "Incorrect Password" });
          }
        } catch (err) {
          return done(err);
        }
      }
    )
  );
  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id, done) => {
    try {
      const user = UsersService.getUserById(id);
      done(null, user);
    } catch (err) {
      done(err);
    }
  });
};

export default configurePassport;
