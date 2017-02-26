var express = require('express');
var amqp = require('amqplib/callback_api');
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
        amqp.connect("amqp://djnrmdtt:ld9_Znh1jijsXE3m9s8QC0U3V4bNkzw4@spotted-monkey.rmq.cloudamqp.com/djnrmdtt"   ,
            function(err, conn){
                if (err != null){
                    console.log("Connection error");
                    console.error(err);
                    process.exit(1);
                }
                    conn.createChannel(function(err, ch) {
                        if (err != null){
                            console.log("Channel creation error");
                            console.error(err);
                            process.exit(1);
                        }
                        var q='Work_queue';
                        ch.assertQueue(q, {durable: false});
                        //console.log(req.body.nbrJob);
                        for(i=0;i<req.body.nbrJob;i++){
                            ch.sendToQueue(q, new Buffer('Hello World!'+i));
                            console.log(" [x] Sent 'Hello World!'");
                        }

                    });
                conn.close();
        });

        res.render('calcpanel');
    }
    //console.log(request.session);
});

module.exports = router;