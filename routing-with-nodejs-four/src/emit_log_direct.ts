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

      const exchange = 'direct_logs';
      const exchangeType = 'direct';

      const args = process.argv.slice(2);

      let msg = args.slice(1).join(' ') || 'Hello World!';

      type SeverityType = 'info' | 'warning' | 'error' | string;

      let severity: SeverityType = args.length ? args[0] : 'error';

      channel.assertExchange(exchange, exchangeType, {
        durable: false,
      });

      console.log('severity ', severity, ', msg', msg);

      channel.publish(exchange, severity, Buffer.from(msg));
      console.log(" [x] Sent '%s'", msg);
    });

    setTimeout(function () {
      connection.close();
      process.exit(0);
    }, 500);
  });
}

connectToRabbitMq();
