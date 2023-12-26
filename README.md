# cc0-lib-companion-app

![uploader-1](https://arweave.net/54svwF8JNjHI2ZMA6tdrFTKujH3hWaWMXg9TcVzJW1M/cc0-lib-uploader-3.png)

This is cc0-lib companion uploader app built using tauri and nextjs. Data permanence powered by Irys (previously Bundlr Network).

## Features

- Drag and Drop
- Batch upload
- Max size per file: 4 Mb
- Track uploaded files using ENS

## Development

### Prerequisites

Tauri is Rust based so you need to install Rust and system dependecies.

Refer [this guide from the Tauri Docs](https://tauri.app/v1/guides/getting-started/prerequisites)

## Run local dev

```
pnpm tauri dev
```

## Building

```
pnpm tauri build
```

Please refer [this tauri guide](https://tauri.app/v1/guides/building/) to build on your specific platform
