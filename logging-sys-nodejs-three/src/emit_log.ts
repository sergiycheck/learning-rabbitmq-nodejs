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

      const exchange = 'logs';
      const exchangeType = 'fanout';
      const queueName = '';
      let msg = process.argv.slice(2).join(' ') || 'Hello World!';

      channel.assertExchange(exchange, exchangeType, { durable: false });

      channel.publish(exchange, queueName, Buffer.from(msg));
      console.log(" [x] Sent '%s'", msg);
    });

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
}

connectToRabbitMq();
