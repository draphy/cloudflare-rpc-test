# Cloudflare RPC Test Service 2

This is a Cloudflare Worker service that demonstrates Remote Procedure Call (RPC) functionality using `Queues` and interacting with another service (@cloudflare-rpc-test/service-1).

## Overview

The service listens for incoming requests and handles two types of responses:

1. **Hello World**: If the request URL does not match a valid endpoint, it responds with a simple `"Hello World"` message.
2. **RPC Request**: If the request URL matches one of the predefined RPC return types `(response, serialiazableObject, function, or classInstance)`, it sends the corresponding type to a `Cloudflare Queue (CLOUDFLARE_RPC_TEST_QUEUE)`.

The service also has a queue event listener that processes the messages from the `Queue`. For each message, it calls the `getType` method of the `CLOUDFLARE_RPC_TEST_SERVICE_1` service, passing the message body as an argument. The response from the `getType` method is logged to the console.

## Prerequisites

- Cloudflare Workers account
- Wrangler CLI installed

## Setup

1. Clone the repository or copy the provided code.
2. Install dependencies using `pnpm install` or `npm install`.
3. Configure the necessary environment variables (if any).
4. Deploy the Worker using `wrangler`.

## Usage

After deploying the Worker, you can send requests to the service using the appropriate URL format:

* For a "Hello World" response: https://`your-worker-url`/
* For an RPC request: https://`your-worker-url`/`rpc-return-type`

Replace `your-worker-url` with the actual URL of your deployed Worker, and `rpc-return-type` with one of the valid RPC return types (response, serialiazableObject, function, or classInstance).

#### RPCReturnType

Currently this service support this type testing

```
type RPCReturnType = "function" | "response" | "serialiazableObject" | "classInstance"
```