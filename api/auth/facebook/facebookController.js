var passport = require('passport');
var FacebookStrategy = require('passport-facebook').Strategy;

exports.setup = function (User){
  passport.use(new FacebookStrategy({
      clientID: $config.facebook.clientID,
      clientSecret: $config.facebook.clientSecret,
      callbackURL: 'http://www.spectreswag.herokuapp.com/auth/fb/facebook/callback'
    },
    function(accessToken, refreshToken, profile, done) { 
      User.findOne({username: profile.id}, function(err, user){
        if (err) return done(err);
        if (!user) {
          var newUser = new User({username: profile.id});
          newUser.save(function(err, user){
            if (err) { return done(err); }
          });
        };
    	  done(null, profile);
      })
    }
  ));
}

