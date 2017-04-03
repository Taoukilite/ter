var exports = module.exports = {};
var AMQPHost = 'amqp://djnrmdtt:ld9_Znh1jijsXE3m9s8QC0U3V4bNkzw4@spotted-monkey.rmq.cloudamqp.com/djnrmdtt';
var AMQPlocal = 'amqp://localhost';
var amqpConn = undefined;
var open = require('amqplib').connect(AMQPlocal);
var amqp = require('amqplib');
var QueueW = 'Work_queue';
var QueueR = 'Response_queue';

exports.startWorking = function(socket) {
    socket.setMaxListeners(Infinity);
    var old=undefined;
    open.then(function (conn) {
        return conn.createChannel();
    }).then(function (ch) {
        ch.prefetch(1);
        socket.on('ready', function (data) {

            return ch.assertQueue(QueueW, {durable: true}).then(function (ok) {

                return ch.consume(QueueW, function (ticket) {
                    if (ticket !== null) {
                        //console.log(msg.content.toString());
                        socket.emit('job', ticket.content.toString());
                        socket.on('res', function (data) {

                            if (data != old) {
                                old = data;
                                //console.log(data);
                                /* Sending the response to rabbitmq (Response_queue) */
                                open.then(function(conn) {
                                    return conn.createChannel();
                                }).then(function(ch2) {
                                    return ch2.assertQueue(QueueR, {durable: true}).then(function(ok) {
                                        return ch2.sendToQueue(QueueR, new Buffer(data));
                                    });
                                }).catch(console.warn);
                            }
                        });
                    }
                }, {noAck:true});
            });
        });

    }).catch(console.warn);
};

