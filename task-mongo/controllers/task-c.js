const Task = require('../Models/task');

exports.homePage = async (req,res,next) => {
    const taskResult = await Task.find({userId:req.session.userId.toString()});
    res.render('home', {
        tasks: taskResult
    });
}

exports.getTask = (req,res,next) => {
     res.render('create');
}

exports.postTask = async (req,res,next) => {
    const title = req.body.title;
    const description = req.body.description;
    const task = new Task({
        title: title,
        description: description,
        userId: req.session.userId
    })

    await task.save();
    res.redirect('/');
}

exports.deleteTask = async (req,res,next) => {
    const titulo = req.params.title;
    const queryR = await Task.findOne({title:titulo});
    if (queryR!== null){
       await Task.deleteOne({_id: queryR._id});
    }
    res.redirect('/');
}

exports.getEdit = async (req,res,next) => {
    const titulo = req.params.title;
    const queryR = await Task.findOne({title:titulo});
    res.render('edit', {
        oldData: queryR
    });
}

exports.postEdit = async (req,res,next) => {
    const newtitulo = req.body.title;
    const newdescription = req.body.description;
    const oldID = req.body.oldID;
    const element = await Task.findOne({_id: oldID});
    element.title = newtitulo;
    element.description = newdescription;
    await element.save();
    res.redirect('/');
}

exports.getDone = async (req,res,next) => {
    const titulo = req.params.title;
    const element = await Task.findOne({title:titulo});
    (element.statusTask === false) ? element.statusTask=true : element.statusTask=false;
    await element.save();
    res.redirect('/');
}