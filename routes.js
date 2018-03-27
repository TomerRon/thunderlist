module.exports = function(app, passport) {
    
    app.get('/', function(req, res) {
        if (req.user)
            res.redirect('/dashboard')
        else
            res.render('index', { user: null });
    });
    
    app.get('/dashboard', function(req, res) {
        if (req.user) {
            let startTutorial = req.query.tutorial;
            res.render('dashboard', { user: req.user, startTutorial: startTutorial, loadjs: ['/js/dashboard.js'] });
        }
        else {
            res.redirect('/');
        }
    });
    
    app.get('/lists/:id', function(req, res) {
        if (req.user)
            res.render('tasks', { user: req.user, listId: req.params.id, loadjs: ['/js/tasks.js'] });
        else
            res.redirect('/');
    })
    
    app.get('/login', function(req, res) {
        res.render('login', { message: req.flash('loginMessage'), user: req.user ? req.user : null }); 
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/',
        failureRedirect : '/login',
        failureFlash : true
    }));

    app.get('/signup', function(req, res) {
        res.render('signup', { message: req.flash('signupMessage'), user: req.user ? req.user : null });
    });

    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/dashboard?tutorial=true',
        failureRedirect : '/signup',
        failureFlash : true
    }));
    
    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
};