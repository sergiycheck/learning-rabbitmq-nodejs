import dotenv from 'dotenv';
dotenv.config();

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

      const queue = 'task_queue';

      console.log('[*] Waiting for messages. To exit press CTRL+C');

      // This makes sure the queue is declared before attempting to consume from it
      channel.assertQueue(queue, {
        durable: true,
      });

      channel.prefetch(1);

      console.log(' [*] Waiting for messages in %s. To exit press CTRL+C', queue);

      channel.consume(
        queue,
        function (msg) {
          const secs = msg.content.toString().split('.').length - 1;

          console.log(' [x] Received %s', msg.content.toString());

          setTimeout(function () {
            console.log(' [x] Done');
            channel.ack(msg);
          }, secs * 1000);
        },
        {
          // automatic acknowledgment mode,
          // see ../confirms.html for details
          noAck: false,
        }
      );
    });
  });
}

connectToRabbitMq();
