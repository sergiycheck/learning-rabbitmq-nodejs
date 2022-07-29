import dotenv from 'dotenv';
dotenv.config();

import { getFibonacciNums } from './fib_nums';

import amqp from 'amqplib/callback_api';

function connectToRabbitMq() {
  const port = process.env.RABBIT_MQ_PORT;

  amqp.connect(`amqp://localhost:${port}`, function (error0, connection) {
    if (error0) {
      throw error0;
    }

    connection.createChannel(function (error1, channel) {
      if (error1) {
        throw error1;
      }

      const queue = 'rpc_queue';
      channel.assertQueue(queue, {
        durable: false,
      });

      // we might want to run more than one server process
      // in order to spread th load equally over multiple servers
      // we need to set the prefetch settings
      channel.prefetch(1);
      console.log(' [x] Awaiting RPC requests');

      //we consume messages from the queue
      channel.consume(queue, function reply(msg) {
        const n = parseInt(msg.content.toString());

        console.log(' [.] fib(%d)', n);

        const result = getFibonacciNums(n);

        channel.sendToQueue(msg.properties.replyTo, Buffer.from(result.toString()), {
          correlationId: msg.properties.correlationId,
        });

        channel.ack(msg);
      });
    });

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
}

connectToRabbitMq();
