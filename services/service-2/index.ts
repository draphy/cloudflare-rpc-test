import type PushNotificationService from '@cloudflare-rpc-test/service-1';
import type { RPCResponse } from '@cloudflare-rpc-test/service-1';

export interface Env {
  CLOUDFLARE_RPC_TEST_QUEUE: Queue<RPCReturnType>;
  CLOUDFLARE_RPC_TEST_SERVICE_1: Service<PushNotificationService>;
}

const rpcReturnType = ['response', 'serialiazableObject', 'function', 'classInstance'] as const;
export type RPCReturnType = (typeof rpcReturnType)[number];

export default {
  async fetch(request: Request, env: Env) {
    const pathParts = request.url.split('/');
    const endpoint = pathParts[pathParts.length - 1] as RPCReturnType;

    if (rpcReturnType.includes(endpoint)) {
      await env.CLOUDFLARE_RPC_TEST_QUEUE.send(endpoint);
      return new Response('Sent');
    }
    return new Response('Hello World');
  },
  async queue(batch, env) {
    console.log('HELLO', batch);

    const getTypePromises = batch.messages.map(async (message) => {
      console.log(`message ${message.id} processed: ${JSON.stringify(message.body)}`);
      if (message.body) {
        try {
          const rpcResponse = await env.CLOUDFLARE_RPC_TEST_SERVICE_1.getType(message.body);
          console.log('rpcResponse:', rpcResponse);

          if (message.body === 'classInstance') {
            const response = await (rpcResponse as Rpc.Stub<RPCResponse>).getResponse();
            console.log('response:', response);
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
