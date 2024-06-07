import type PushNotificationService from '@cloudflare-rpc-test/service-1';

export interface Env {
  CLOUDFLARE_RPC_TEST_QUEUE: Queue<RPCReturnType>;
  CLOUDFLARE_RPC_TEST_SERVICE_1: Service<PushNotificationService>;
}

const rpcReturnType = ['response', 'object', 'function', 'classInstance'] as const;
export type RPCReturnType = (typeof rpcReturnType)[number];

export default {
  async fetch(request: Request, env: Env) {
    const url = new URL(request.url);
    const path = url.pathname;

    if (path.endsWith('/classInstance')) {
      using rpcResponse = await env.CLOUDFLARE_RPC_TEST_SERVICE_1.getClass();
      await rpcResponse.increment(2); // returns 2
      await rpcResponse.increment(1); // returns 3
      await rpcResponse.increment(-5); // returns -2

      const count = await rpcResponse.value; // returns -2
      console.log('class response:', count);
      return new Response(`This the class response: ${count}`);
    }

    if (path.endsWith('/function')) {
      using rpcResponse = await env.CLOUDFLARE_RPC_TEST_SERVICE_1.getFunction();
      await rpcResponse(2); // returns 2
      await rpcResponse(1); // returns 3
      const count = await rpcResponse(-5); // returns -2
      console.log('function response:', count);
      return new Response(`This the function response: ${count}`);
    }

    if (path.endsWith('/object')) {
      using rpcResponse = await env.CLOUDFLARE_RPC_TEST_SERVICE_1.getObject();
      console.log('object response:', rpcResponse.message);
      return new Response(rpcResponse.message);
    }

    if (path.endsWith('/response')) {
      using rpcResponse = await env.CLOUDFLARE_RPC_TEST_SERVICE_1.getResponse();
      const response = await rpcResponse.text();
      console.log('response:', response);
      return new Response(response);
    }

    if (path.endsWith('/queue')) {
      const returnValue = url.searchParams.get('return') as RPCReturnType | null;

      if (returnValue) {
        await env.CLOUDFLARE_RPC_TEST_QUEUE.send(returnValue);
        return new Response('Sent to queue');
      }
      return new Response('Please provide query params as /queue?return=');
    }
    return new Response('Hello World');
  },
  async queue(batch, env) {
    console.log('HELLO', batch);

    const getTypePromises = batch.messages.map(async (message) => {
      console.log(`message ${message.id} processed: ${JSON.stringify(message.body)}`);
      if (message.body) {
        try {
          if (message.body === 'classInstance') {
            using rpcResponse = await env.CLOUDFLARE_RPC_TEST_SERVICE_1.getClass();
            await rpcResponse.increment(2); // returns 2
            await rpcResponse.increment(1); // returns 3
            await rpcResponse.increment(-5); // returns -2

            const count = await rpcResponse.value; // returns -2
            console.log('class response:', count);
          }

          if (message.body === 'function') {
            using rpcResponse = await env.CLOUDFLARE_RPC_TEST_SERVICE_1.getFunction();
            await rpcResponse(2); // returns 2
            await rpcResponse(1); // returns 3
            const count = await rpcResponse(-5); // returns -2
            console.log('function response:', count);
          }

          if (message.body === 'object') {
            using rpcResponse = await env.CLOUDFLARE_RPC_TEST_SERVICE_1.getObject();
            console.log('object response:', rpcResponse.message);
          }

          if (message.body === 'response') {
            using rpcResponse = await env.CLOUDFLARE_RPC_TEST_SERVICE_1.getResponse();
            console.log('response:', await rpcResponse.text());
          }

          message.ack();
        } catch (error) {
          console.error(`Error with Message ${JSON.stringify({ id: message.id, body: message.body })}`);
          console.error(error);
          message.retry();
        }
      }
    });
    await Promise.allSettled(getTypePromises);
  }
} satisfies ExportedHandler<Env, RPCReturnType>;
