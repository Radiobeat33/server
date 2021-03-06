var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth').OAuth2Strategy;

exports.setup = function (User){
  passport.use(new GoogleStrategy({
      clientID: $config.google.clientID,
      clientSecret: $config.google.clientSecret,
      callbackURL: 'http://spectreswag.herokuapp.com/auth/g/google/callback'
    },
    function(accessToken, refreshToken, profile, done) {
      User.findOne({'providers.google.id': profile.id }, function(err, user){
        if (err) return done(err);
        if (!user) {
          var newUser = new User({'providers.google.id': profile.id, 'providers.google.token': accessToken});
          newUser.save(function(err, user){
            if (err) { return done(err); }
            done(null, profile); 
          });
        }
        if (user){
          user.save({'providers.google.token': accessToken}, function(err, user){
            if(err) { return done(err); }
            done(null, profile); 
          });
        } 
      }); 
    }
  ));
}