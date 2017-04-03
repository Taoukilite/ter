var express = require('express');
var AMQPHost = 'amqp://djnrmdtt:ld9_Znh1jijsXE3m9s8QC0U3V4bNkzw4@spotted-monkey.rmq.cloudamqp.com/djnrmdtt';
var AMQPlocal = 'amqp://localhost';
var amqp = require('amqplib/callback_api');
var open = require('amqplib').connect();
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
        amqp.connect(AMQPlocal,
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
                    else if(ch != null) {
                        var QueueW = 'Work_queue';
                        ch.assertQueue(QueueW, {durable: true},function(err, q) {
                            //console.log(req.body.nbrJob);
                            for (i = 0; i < req.body.nbrJob; i++) {
                                // console.log(" Job "+i+" --> creating ticket");
                                ch.sendToQueue(QueueW, new Buffer(req.body.code), { correlationId: toString(i), replyTo: q.queue }, function () {
                                    //console.log(" Job "+i+" --> ticket is sent");
                                });
                            }
                        });

                    }
                });
        });
        res.render('calcpanel');
    }
    //console.log(request.session);
});

module.exports = router;