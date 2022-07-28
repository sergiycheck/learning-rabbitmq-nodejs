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

      const exchange = 'topic_logs';
      const exchangeType = 'topic';

      const args = process.argv.slice(2);

      const key = args.length > 0 ? args[0] : 'anonymous.info';
      const msg = args.slice(1).join(' ') || 'Hello World!';

      channel.assertExchange(exchange, exchangeType, {
        durable: false,
      });

      console.log('key ', key, ', msg', msg);

      channel.publish(exchange, key, Buffer.from(msg));
      console.log(" [x] Sent '%s'", msg);
    });

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
}

connectToRabbitMq();
