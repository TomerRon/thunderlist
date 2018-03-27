const   LocalStrategy   = require('passport-local').Strategy,
        models  = require('../models/index');

module.exports = function(passport) {
    
    // Local signup strategy
    passport.use('local-signup', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        process.nextTick(function() {
            models.User.findOne({ where: { username:  username }}).then(user => {
                if (user) {
                    return done(null, false, req.flash('signupMessage', 'That username is already taken.'));
                } else {
                    let newUser            = models.User.build({ username: username, password: models.User.generateHash(password)});
                    newUser.save().then(() => {
                        models.List.build({ name: 'My First List', userId: newUser.id }).save()
                        .then(list => {
                            models.Task.build({ content: 'Learn how to use Thunderlist', done: false, listId: list.id }).save();
                            models.Task.build({ content: 'Make the world a better place', done: false, listId: list.id }).save();
                            models.List.build({ name: 'My Completed List', userId: newUser.id }).save()
                            .then(list2 => {
                                models.Task.build({ content: 'My first completed task', done: true, listId: list2.id }).save();
                                models.Task.build({ content: 'My second completed task', done: true, listId: list2.id }).save();
                                models.Task.build({ content: 'My third completed task', done: true, listId: list2.id }).save();
                                return done(null, newUser);
                            });
                        });
                    });
                }
            });
        });    
    }));
    
    // Local login strategy
    passport.use('local-login', new LocalStrategy({
        passReqToCallback : true
    },
    function(req, username, password, done) {
        models.User.findOne({ where: { username:  username }}).then(user => {
            if (!user)
                return done(null, false, req.flash('loginMessage', 'No user found.'));
            if (!user.validPassword(password))
                return done(null, false, req.flash('loginMessage', 'Oops! Wrong password.'));
            return done(null, user);
        });

    }));
    
    
    passport.serializeUser(function(user, done) {
        done(null, user.id);
    });
    passport.deserializeUser(function(id, done) {
        models.User.findById(id).then(user => {
            done(null, user);
        });
    });
};
