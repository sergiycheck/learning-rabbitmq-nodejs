import dotenv from 'dotenv';
dotenv.config();

import amqp from 'amqplib/callback_api';

const args = process.argv.slice(2);

if (!args.length) {
  console.log('Usage: receive_logs_direct.ts info | warning | error');
  console.log('Example: yarn run receive_logs_direct.ts info warring');
  console.log('Example: yarn run receive_logs_direct.ts warring error');
  process.exit(1);
}

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

      channel.assertExchange(exchange, exchangeType, { durable: false });

      //empty string as second parameter
      //means that we don't want to send the message to any specific queue.
      const queueName = '';

      // create non-durable queue with a gen name
      //example return value amq.gen-JzTY20BRgKO-HjmUJj0wLg
      // deleted on disconnect
      channel.assertQueue(
        queueName,
        {
          exclusive: true,
        },
        function (err, createdQueue) {
          if (err) throw err;
          console.log('[*] Waiting for messages. To exit press CTRL+C');

          //tell the exchange to send messages to our queue
          //relationship between exchange and a queue
          //is called a binding

          const severities = args;

          severities.forEach(function (severity: string) {
            channel.bindQueue(createdQueue.queue, exchange, severity);
          });

          channel.consume(
            createdQueue.queue,
            (msg) => {
              console.log(" [x] %s: '%s'", msg.fields.routingKey, msg.content.toString());
            },
            {
              noAck: true,
            }
          );
        }
      );
    });
  });
}

connectToRabbitMq();
