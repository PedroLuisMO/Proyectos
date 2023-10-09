const { validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const User = require("../Models/user");

exports.getlogin = (req,res,next) => {
    res.render("login.ejs");
}

exports.getsignup = (req, res, next) => {
  res.render("signup.ejs");
};

exports.postsignup = async (req, res, next) => {
  const email = req.body.email;
  const pass = req.body.pass;
  const conpass = req.body.conpass;

  const errors = validationResult(req);
  //console.log("errors: " + errors.array()[0].msg);
  if (!errors.isEmpty()) {
    return res.render("signup", {
      errorMessage: errors.array()[0].msg,
    });
  }
  hashPass = await bcrypt.hash(pass, 10);
  const user = new User({
    email: email,
    password: hashPass,
  });
  await user.save();
  res.redirect("/login");
};

exports.postlogin = async (req,res, next) => {
    const email = req.body.email;
    const pass = req.body.pass;
    const erros = validationResult(req);
    if (!erros.isEmpty()){
        return res.render('login', {
            errorMessage: erros.array()[0].msg
        })
    }
    try{
        const userResult = await User.findOne({email: email});
        if (!userResult){
            return res.render('login', {
                errorMessage: 'Email not found'
            })
        }
        const doMatch = await bcrypt.compare(pass, userResult.password);
        if (!doMatch){
            return res.render('login', {
                errorMessage: 'Password must be match'
            })
        } else {
            req.session.isLoggedIn = true;
            req.session.user = userResult;
            req.session.userId = userResult._id;
            return req.session.save(err => {
                if (err){
                    res.render('login', {
                        errorMessage: 'Error al guardar la sesion'
                    })
                } else {
                    res.redirect('/')
                }
            })
        }
    } catch(err){
        console.log(err);
        res.render('login');
    }
}

exports.getLogout = (req,res,next) => {
    req.session.destroy(err=>{
        if (err){
        return console.log('error al destruir la sesion', err);
        }
        res.redirect('login');
    })
}
