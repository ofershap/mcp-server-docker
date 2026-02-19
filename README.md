# mcp-server-docker

[![npm version](https://img.shields.io/npm/v/mcp-server-docker.svg)](https://www.npmjs.com/package/mcp-server-docker)
[![npm downloads](https://img.shields.io/npm/dm/mcp-server-docker.svg)](https://www.npmjs.com/package/mcp-server-docker)
[![CI](https://github.com/ofershap/mcp-server-docker/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/mcp-server-docker/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Manage Docker containers, images, and services directly from your AI assistant — list, start, stop, inspect logs, execute commands, and monitor resource usage.

```bash
npx mcp-server-docker
```

> Works with Claude Desktop, Cursor, VS Code Copilot, and any MCP client. Zero auth — connects to your local Docker socket automatically.

![Demo](assets/demo.gif)

## Tools

| Tool                | What it does                                                        |
| ------------------- | ------------------------------------------------------------------- |
| `list_containers`   | List running (or all) containers with status, ports, and image info |
| `container_logs`    | Get recent logs from a container                                    |
| `start_container`   | Start a stopped container                                           |
| `stop_container`    | Stop a running container                                            |
| `restart_container` | Restart a container                                                 |
| `remove_container`  | Remove a container (with optional force)                            |
| `exec_command`      | Execute a command inside a running container                        |
| `container_stats`   | Get live CPU, memory, and network stats                             |
| `list_images`       | List all Docker images on the host                                  |
| `remove_image`      | Remove a Docker image                                               |

## Quick Start

### Cursor

Add to `.cursor/mcp.json`:

```json
{
  "mcpServers": {
    "docker": {
      "command": "npx",
      "args": ["-y", "mcp-server-docker"]
    }
  }
}
```

### Claude Desktop

Add to `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "docker": {
      "command": "npx",
      "args": ["-y", "mcp-server-docker"]
    }
  }
}
```

### VS Code

Add to user settings or `.vscode/mcp.json`:

```json
{
  "mcp": {
    "servers": {
      "docker": {
        "command": "npx",
        "args": ["-y", "mcp-server-docker"]
      }
    }
  }
}
```

## Examples

- "List all running Docker containers"
- "Show me the logs from the nginx container"
- "Restart the api-server container"
- "What's the CPU and memory usage of my postgres container?"
- "Execute `ls -la /app` inside the web container"
- "List all Docker images and their sizes"
- "Stop all containers that are using the old image"

## Prerequisites

- **Docker** must be running on your machine
- The MCP server connects to the Docker socket at `/var/run/docker.sock` (Linux/macOS) or the named pipe on Windows
- No API keys or tokens required

## Development

```bash
git clone https://github.com/ofershap/mcp-server-docker.git
cd mcp-server-docker
npm install
npm test
npm run build
```

## Author

**Ofer Shapira**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-ofershap-blue?logo=linkedin)](https://linkedin.com/in/ofershap)
[![GitHub](https://img.shields.io/badge/GitHub-ofershap-black?logo=github)](https://github.com/ofershap)

## License

MIT © 2026 Ofer Shapira
