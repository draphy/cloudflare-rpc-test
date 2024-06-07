import type { RPCReturnType } from '@cloudflare-rpc-test/service-2';
import { RpcTarget, WorkerEntrypoint } from 'cloudflare:workers';

export class RPCResponse extends RpcTarget {
  getResponse() {
    return new Response('This is a Response object');
  }
}

export default class extends WorkerEntrypoint {
  async fetch() {
    return new Response('Hello, world!');
  }
  async getType(type: RPCReturnType) {
    switch (type) {
      case 'response':
        return new Response('This is a Response object');
      case 'serialiazableObject':
        return { message: 'This is a serializable object' };
      case 'function':
        return () => console.log('This is a function');
      case 'classInstance':
        return new RPCResponse();
      default:
        return;
    }
  }
}
