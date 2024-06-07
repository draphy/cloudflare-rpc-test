# Cloudflare RPC Test

This is the monorepo that contains all code related to RPC testing.

# Testing

you can use the service 2 endpoint in the cloudflare for testing

currently it supports these types

```
type RPCReturnType = "function" | "response" | "object" | "classInstance"
```

## Package manager and dependencies

### pnpm

We use `pnpm`to manage all dependencies in the monorepo .

`pnpm install` will install dependencies for all services of the monorepo.

To install pnpm, install node first, then use :

```bash
corepack enable pnpm
corepack use pnpm@latest
```

To install bun :

```bash
curl -fsSL https://bun.sh/install | bash
```

## Formatting and Linting

We do not use root configuration files for linting and formatting, so each service can implement them using the tool of their choice.

# Node version

- use node version 20
- Use pnpm for installing dependency (pnpm i)
- reinstall pnpm if the node version is updated (npm i -g pnpm)
