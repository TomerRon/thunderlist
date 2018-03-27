const   express = require('express'),
        router = express.Router(),
        models  = require('./models/index'),
        Op = models.Sequelize.Op;

///////////////////////////////////////////////////
//               List API
///////////////////////////////////////////////////

// GET Lists by User ID
router.get('/lists', isLoggedIn, (req, res) => {
    models.List.findAll({ where: { userId: req.user.id }, order: [['createdAt', 'ASC']]})
    .then(lists => {
        res.json(lists);
    });
});

// GET List
router.get('/list/:listId', isLoggedIn, (req, res) => {
    models.List.findById(req.params.listId)
    .then(list => {
        if (list == null || req.user.id != list.userId) {
            return res.json({'message':'list not found'});
        } else {
            res.json(list);
        }
    });
});

// POST new List
router.post('/lists', isLoggedIn, (req, res) => {
    if (!req.body.name) return res.json({'message':'invalid name'});
    models.List.build( { name: req.body.name, userId: req.user.id } ).save()
    .then(list => {
        res.json(list);
    })
    .catch(err => {
        console.log(err);
    });
});

// DELETE List
router.delete('/lists', isLoggedIn, (req, res) => {
    models.List.findById(req.body.listId)
    .then(list => {
        if (list == null || req.user.id != list.userId) {
            return res.json({'message':'list not found'});
        } else {
            models.Task.destroy({ where: { listId: list.id } });
            models.List.destroy( {where: { id: list.id } } );
            res.json({'message':'ok'});
        }
    });
});

///////////////////////////////////////////////////
//               Task API
///////////////////////////////////////////////////

// GET Tasks by List ID
router.get('/lists/:listId', isLoggedIn, (req, res) => {
    models.List.findById(req.params.listId)
    .then(list => {
        if (list == null || req.user.id != list.userId) {
            return res.json({'message':'list not found'});
        } else {
            models.Task.findAll({ where: { listId: list.id }, order: [['createdAt', 'ASC']]}).then(tasks => {
                res.json(tasks);
            });
        }
    });
});

// GET Task
router.get('/lists/:listId/task/:taskId', isLoggedIn, (req, res) => {
    models.List.findById(req.params.listId)
    .then(list => {
        if (list == null || req.user.id != list.userId) {
            return res.json({'message':'task not found'});
        } else {
            models.Task.findOne({ where: { id: req.params.taskId, listId: list.id }}).then(task => {
                res.json(task);
            });
        }
    });
});

// POST new Task
router.post('/lists/:listId', isLoggedIn, (req, res) => {
    models.List.findById(req.params.listId)
    .then(list => {
        if (list == null || req.user.id != list.userId) {
            return res.json({'message':'task not found'});
        } else {
            models.Task.build( { content: req.body.content, done: (req.body.done ? req.body.done : false), listId: list.id } ).save().then(task => {
                res.json(task);
            });
        }
    });
});

// POST update Task
router.post('/lists/:listId/task/:taskId', isLoggedIn, (req, res) => {
    models.List.findById(req.params.listId)
    .then(list => {
        if (list == null || req.user.id != list.userId) {
            return res.json({'message':'task not found'});
        } else {
            var fields = {}
            if ("done" in req.body && ['true','false'].indexOf(req.body.done) >= 0)
                fields["done"] = req.body.done;
            if ("content" in req.body && typeof(req.body.content)==='string')
                fields["content"] = req.body.content;
            if (Object.keys(fields).length) {
                models.Task.update(fields, { where: { id: req.params.taskId, listId: list.id } })
                .then(task => {
                    res.json({'message':'ok'});
                });
            } else {
                res.json({'message':'invalid params'});
            }
        }
    });
});

// DELETE Task
router.delete('/lists/:listId/task/:taskId', isLoggedIn, (req, res) => {
    models.List.findById(req.params.listId)
    .then(list => {
        if (list == null || req.user.id != list.userId) {
            return res.json({'message':'list not found'});
        } else {
            models.Task.destroy( {where: { id: req.params.taskId, listId: list.id } } );
            res.json({'message':'ok'});
        }
    });
});

// POST search List
// Returns matching Tasks
router.post('/lists/:listId/search', isLoggedIn, (req, res) => {
    models.List.findById(req.params.listId)
    .then(list => {
        if (list == null || req.user.id != list.userId) {
            return res.json({'message':'list not found'});
        } else {
            if (typeof(req.body.content)==='string') {
                models.Task.findAll({ where: { content: { [Op.like]: '%'+req.body.content+'%' }, listId: list.id }, order: [['createdAt', 'ASC']]}).then(tasks => {
                    res.json(tasks);
                });
            }
        }
    });
});


// GET filter List
// :filter can be 'done' or 'inprogress'
// Returns matching Tasks
router.get('/lists/:listId/:filter', isLoggedIn, (req, res) => {
    if (['done','inprogress'].indexOf(req.params.filter) >= 0) {
        models.List.findById(req.params.listId)
        .then(list => {
            if (list == null || req.user.id != list.userId) {
                return res.json({'message':'list not found'});
            } else {
                var fields = { listId: list.id };
                switch (req.params.filter) {
                    case 'done':
                        fields['done'] = true;
                        break;
                    case 'inprogress':
                        fields['done'] = false;
                        break;
                }
                models.Task.findAll({ where: fields, order: [['createdAt', 'ASC']]}).then(tasks => {
                    res.json(tasks);
                });
            }
        });
    }
});

///////////////////////////////////////////////////
//               Middlewares
///////////////////////////////////////////////////

function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();
    res.redirect('/');
}

module.exports = router;