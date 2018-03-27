const   chai = require('chai'),
        expect = require('chai').expect,
        chaiHttp = require('chai-http'),
        app = require('../app'),
        models  = require('../models/index'),
        request = require('supertest');

chai.use(chaiHttp);

describe('API',  function() {
    
    this.timeout(5000);
    
    const authenticatedUser = request.agent(app);
    let newUser = {username: 'test_'+Math.random().toString(36).substring(7), password: 'password1'};
    let list = {};
    
    after(() => {
        models.User.destroy({where: { username: newUser.username } });
    });
    
    describe('Users', function() {
        it('POST signup', ()=> {
            return authenticatedUser
            .post('/signup')
            .send(newUser)
            .then(function(res) {
                return models.User.findOne({ where: { username: newUser.username }}).then(user => {
                    expect(user).to.be.an('object');
                    expect(user).to.have.property('id');
                    expect(user).to.have.property('username');
                    expect(user.username).to.equal(newUser.username);
                });
            });
        });
        it('POST login', () => {
          return authenticatedUser
          .post('/login')
          .send(newUser)
          .then((res) => {
                expect(res.statusCode).to.equal(302);
                expect(res.redirect).to.be.true;
          })
        });
    });
    
    describe('Lists', function() {
        let temp_list;
        
        describe('GET lists', () => {
            it('should return nothing when not authenticated', () => {
                return chai.request(app).get('/api/lists').then((res) => {
                    expect(res.body).to.be.empty;
                });
            });
            it('should return user lists when authenticated', () => {
                return authenticatedUser.get('/api/lists').then((res) => {
                    expect(res.body[0]).to.be.an('object');
                    expect(res.body[0]).to.have.property('name');
                    
                    list = res.body[0];
                });
            });
        });
        
        describe('GET list', () => {
            it('should return error when list is not found', () => {
                return authenticatedUser
                .get('/api/list/invalidlist')
                .then(function(res) {
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('list not found');
                });
            });
            it('should return nothing when not authenticated', () => {
                return chai.request(app).get('/api/lists').then((res) => {
                    expect(res.body).to.be.empty;
                });
            });
            it('should return list info when authenticated', () => {
                return authenticatedUser
                .get('/api/list/'+list.id)
                .then(function(res) {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('name');
                    expect(res.body.id).to.equal(list.id);
                });
            });
        });
        
        describe('POST lists', () => {
            it('should return error when no name is entered', () => {
                return authenticatedUser
                .post('/api/lists')
                .then(function(res) {
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('invalid name');
                });
            });
            it('should return nothing when not authenticated', () => {
                return chai.request(app).get('/api/lists').then((res) => {
                    expect(res.body).to.be.empty;
                });
            });
            it('should create new list when authenticated', () => {
                return authenticatedUser
                .post('/api/lists')
                .send({name: 'My test list'})
                .then(function(res) {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('name');
                    expect(res.body.name).to.equal('My test list');
                    
                    temp_list = res.body;
                });
            });
        });
        
        describe('DELETE lists', () => {
            it('should return error when list is not found', () => {
                return authenticatedUser
                .delete('/api/lists')
                .send({listId: 'invalidId'})
                .then(function(res) {
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('list not found');
                });
            });
            it('should return nothing when not authenticated', () => {
                return chai.request(app)
                .delete('/api/lists')
                .send({listId: temp_list.id})
                .then((res) => {
                    expect(res.body).to.be.empty;
                });
            });
            it('should delete list when authenticated', () => {
                return authenticatedUser
                .delete('/api/lists')
                .send({listId: temp_list.id})
                .then(function(res) {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('ok');
                });
            });
        });
    })
    
    describe('Tasks', function() {
        let task;
        
        describe('GET lists/:listId', () => {
            it('should return nothing when not authenticated', () => {
                return chai.request(app).get('/api/lists/'+list.id).then((res) => {
                    expect(res.body).to.be.empty;
                });
            });
            it('should return tasks when authenticated', () => {
                return authenticatedUser
                .get('/api/lists/'+list.id)
                .then(function(res) {
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.have.property('content');
                    expect(res.body[0]).to.have.property('done');
                    
                    task = res.body[0];
                });
            });
        });
        
        describe('GET lists/:listId/task/:taskId', () => {
            it('should return nothing when not authenticated', () => {
                return chai.request(app).get('/api/lists/'+list.id+'/task/'+task.id).then((res) => {
                    expect(res.body).to.be.empty;
                });
            });
            it('should return task when authenticated', () => {
                return authenticatedUser
                .get('/api/lists/'+list.id+'/task/'+task.id)
                .then(function(res) {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('content');
                    expect(res.body).to.have.property('done');
                });
            });
        });
        
        describe('POST lists/:listId', () => {
            it('should return nothing when not authenticated', () => {
                return chai.request(app)
                .post('/api/lists/'+list.id)
                .send({content: 'My new task'})
                .then((res) => {
                    expect(res.body).to.be.empty;
                });
            });
            it('should create task when authenticated', () => {
                return authenticatedUser
                .post('/api/lists/'+list.id)
                .send({content: 'My new task'})
                .then((res) => {
                    expect(res.body).to.be.an('object');
                    expect(res.body).to.have.property('content');
                    expect(res.body).to.have.property('done');
                    expect(res.body.content).to.equal('My new task');
                    expect(res.body.done).to.be.false;
                });
            });
        });
        
        describe('POST lists/:listId/task/:taskId', () => {
            it('should return nothing when not authenticated', () => {
                return chai.request(app)
                .post('/api/lists/'+list.id+'/task/'+task.id)
                .send({done: 'true', content: 'My newer task'})
                .then((res) => {
                    expect(res.body).to.be.empty;
                });
            });
            it('should return error with invalid params', () => {
                return authenticatedUser
                .post('/api/lists/'+list.id+'/task/'+task.id)
                .send({invalidParam: 'invalid'})
                .then((res) => {
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('invalid params');
                });
            });
            
            it('should update task when authenticated', () => {
                return authenticatedUser
                .post('/api/lists/'+list.id+'/task/'+task.id)
                .send({done: 'true', content: 'My newer task'})
                .then((res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('ok');
                    return authenticatedUser
                    .get('/api/lists/'+list.id+'/task/'+task.id)
                    .then(function(res) {
                        expect(res.body.done).to.be.true;
                        expect(res.body.content).to.equal('My newer task');
                    });
                });
            });
        });
        
        describe('DELETE lists/:listId/task/:taskId', () => {
            it('should return nothing when not authenticated', () => {
                return chai.request(app)
                .delete('/api/lists/'+list.id+'/task/'+task.id)
                .then((res) => {
                    expect(res.body).to.be.empty;
                });
            });
            it('should delete task when authenticated', () => {
                return authenticatedUser
                .delete('/api/lists/'+list.id+'/task/'+task.id)
                .then((res) => {
                    expect(res.statusCode).to.equal(200);
                    expect(res.body).to.have.property('message');
                    expect(res.body.message).to.equal('ok');
                });
            });
            
        });
        
        describe('POST lists/:listId/search', () => {
            it('should return nothing when not authenticated', () => {
                return chai.request(app)
                .post('/api/lists/'+list.id+'/search')
                .send({content: 'world'})
                .then((res) => {
                    expect(res.body).to.be.empty;
                });
            });
            it('should search tasks when authenticated', () => {
                return authenticatedUser
                .post('/api/lists/'+list.id+'/search')
                .send({content: 'new'})
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.have.property('content');
                    expect(res.body[0].content).to.equal('My new task');
                });
            });
        });
        
        describe('POST lists/:listId/filter', () => {
            it('should return nothing when not authenticated', () => {
                return chai.request(app)
                .get('/api/lists/'+list.id+'/inprogress')
                .then((res) => {
                    expect(res.body).to.be.empty;
                });
            });
            it('should filter in progress tasks when authenticated', () => {
                return authenticatedUser
                .get('/api/lists/'+list.id+'/inprogress')
                .then((res) => {
                    expect(res.body).to.be.an('array');
                    expect(res.body[0]).to.have.property('content');
                    expect(res.body[0].done).to.be.false;
                });
            });
            it('should filter done tasks when authenticated', () => {
                return authenticatedUser
                .get('/api/lists/'+list.id+'/done')
                .then((res) => {
                    expect(res.body).to.be.an('array');
                });
            });
        });
        
    });
});