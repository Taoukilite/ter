var express = require('express');

var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    res.render('calcpanel');
});
router.post('/',function (req, res) {
    if(req.body.code === undefined || req.body.code===''){
        res.redirect('calcpanel');
    } else{
        console.log("Nouveau calcul : "+req.body.code);
        amqp.connect('amqp://djnrmdtt:D6Dro-i5EJfu3wztuJALTU21I0ViqUeG@spotted-monkey.rmq.cloudamqp.com/djnrmdtt',
            function(err,conn){
                if(err)
                    conn.createChannel(function(err, ch) {
                        var q='Work_queue';
                        ch.assertQueue(q, {durable: false});
                        for(i=0;i<req.body.nbrJob;i++){

                        }

                    });
        });

        res.render('calcpanel');
    }
    //console.log(request.session);
});

module.exports = router;