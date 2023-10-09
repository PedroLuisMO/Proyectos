const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task-c')
const isAuth = require('../middleware/isAuth');

router.get('/',isAuth, taskController.homePage);
router.get('/createTask', taskController.getTask);
router.post('/createTask',isAuth, taskController.postTask);
router.get('/delete/:title', isAuth, taskController.deleteTask);
router.get('/edit/:title', isAuth, taskController.getEdit);
router.post('/edit/editTask', taskController.postEdit);
router.get('/done/:title', isAuth, taskController.getDone);

module.exports = router;