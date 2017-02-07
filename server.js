var express = require('express');

var app = express();

var bodyparser = require('body-parser');

var session = require('express-session');


/** Moteur de templates : EJS */
app.set('view engine','ejs');

/** express middlewares */
app.use('/assets',express.static('public'));
app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());
app.use(session({
    secret: 'secretterces',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));
app.use(requir('/middlewares/flash'));

/** Routes */

/** Index route */
app.get('/',function(request,response){
   response.render('pages/index',{test:"salutt"});
});

app.post('/',function (request, response) {
   if(request.body.code === undefined || request.body.code===''){
       //response.render('pages/index',{error : "pas de code"});
        response.redirect('/')
   }
   console.log(request.body);
});

app.listen(5555);