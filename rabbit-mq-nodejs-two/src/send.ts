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
      const msg = process.argv.slice(2).join(' ') || 'Hello World!';

      //  queue will survive a RabbitMQ node restart.
      channel.assertQueue(queue, {
        durable: true,
      });
      channel.sendToQueue(queue, Buffer.from(msg), {
        persistent: true,
      });
      console.log(" [x] Sent '%s'", msg);
    });

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
}

connectToRabbitMq();
