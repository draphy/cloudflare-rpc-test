import { RpcTarget, WorkerEntrypoint } from 'cloudflare:workers';

class Counter extends RpcTarget {
  #value = 0;

  increment(amount: number) {
    this.#value += amount;
    return this.#value;
  }

  get value() {
    return this.#value;
  }
}

export default class extends WorkerEntrypoint {
  async fetch() {
    return new Response('Hello, world!');
  }
  async getResponse() {
    return new Response('This is a Response object');
  }
  async getObject() {
    return { message: 'This is a serializable object' };
  }
  async getFunction() {
    let value = 0;
    return (increment = 0) => {
      value += increment;
      return value;
    };
  }
  async getClass() {
    return new Counter();
  }
}
