import dotenv from 'dotenv';
dotenv.config();

import { randomUUID } from 'crypto';
import amqp from 'amqplib/callback_api';

const args = process.argv.slice(2);

if (!args.length) {
  console.log('Usage: receive_logs_topic.ts num');
  process.exit(1);
}

function connectToRabbitMq() {
  const port = process.env.RABBIT_MQ_PORT;

  amqp.connect(`amqp://localhost:${port}`, function (error0, connection) {
    if (error0) {
      throw error0;
    }

    connection.createChannel(function (err, channel) {
      if (err) {
        throw err;
      }

      const queueRPC = 'rpc_queue';

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

          const correlationId = randomUUID();
          const [stringNum] = args;
          const num = parseInt(stringNum);
          console.log(' [x] Requesting fib(%d)', num);

          channel.consume(
            createdQueue.queue,
            (msg) => {
              if (msg.properties.correlationId === correlationId) {
                console.log('[.] Got ', msg.content.toString());

                setTimeout(() => {
                  connection.close();
                  process.exit(0);
                });
              }
            },
            { noAck: true }
          );

          channel.sendToQueue(queueRPC, Buffer.from(num.toString()), {
            correlationId: correlationId,
            replyTo: createdQueue.queue,
          });
        }
      ); // asserted queue
    }); // end of created channel
  });
}

connectToRabbitMq();
