# Cardano AlertBot

Telegram bot for near real-time Cardano alerts: confirmed transactions, staking rewards, and delegation changes.

## Quick Start

1. Clone the repo and install dependencies:
   ```bash
   npm ci
   ```
2. Copy `.env.example` to `.env` and fill in:
   - `TELEGRAM_BOT_TOKEN`
   - `BLOCKFROST_API_KEY`
   - `CARDANO_NETWORK` (`preprod` or `mainnet`)
3. Run the bot in development mode:
   ```bash
   npm run dev
   ```

## Features (MVP)

- Confirmed transaction notifications (ADA and native tokens)
- Staking reward notifications
- Delegation/pool change notifications
- Simple commands to watch an address or a stake key

## Architecture (High Level)

- Data source: Blockfrost (or Koios/db-sync in future)
- Polling worker -> queue -> rules engine -> Telegram delivery
- Reliability: rate-limit, retry/backoff, logging, and monitoring

## Security & Privacy

- Read-only by design: **no private keys** are ever requested or stored.
- Minimal data retention: wallet/stake key + Telegram ID.
- Planned `/delete` command for user-initiated data removal.

## License

MIT © Tex Labs
