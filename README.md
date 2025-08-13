# local-api-gateway

Library to simulate an AWS API Gateway locally. It maps incoming paths to microservices.

## Usage

```bash
npm install
npm run build
npx gw start
```

The `start` command prompts for a path and target for each route and asks if you want to add more.
Configurations can be saved under `~/.gw` as JSON files.

### Commands

- `gw start [name] [-d|--detach]` – start the gateway, optionally using a saved configuration and running in the background.
- `gw config set <name>` – create a configuration by entering routes.
- `gw config get <name>` – read and print a saved configuration.
- `gw logs <name>` – show gateway logs.
- `gw stop <name>` – stop a detached gateway.
- `gw status <name>` – show gateway status.
- `gw restart <name>` – restart a detached gateway.
- `gw version` – print the current version.

All routes include CORS support and requests and responses are logged with colors.
The server listens on port `3000`.
