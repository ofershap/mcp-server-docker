# mcp-server-docker

[![npm version](https://img.shields.io/npm/v/mcp-docker-server.svg)](https://www.npmjs.com/package/mcp-docker-server)
[![npm downloads](https://img.shields.io/npm/dm/mcp-docker-server.svg)](https://www.npmjs.com/package/mcp-docker-server)
[![CI](https://github.com/ofershap/mcp-server-docker/actions/workflows/ci.yml/badge.svg)](https://github.com/ofershap/mcp-server-docker/actions/workflows/ci.yml)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

Control Docker containers, images, and services from your AI coding assistant. List, start, stop, read logs, run commands inside containers, and check resource usage.

```bash
npx mcp-docker-server
```

> Compatible with Claude Desktop, Cursor, VS Code Copilot, and any MCP-compatible client. No API keys needed. Connects to your local Docker socket automatically.

![MCP server for Docker containers, logs, and resource monitoring](assets/demo.gif)

<sub>Demo built with <a href="https://github.com/ofershap/remotion-readme-kit">remotion-readme-kit</a></sub>

## Why

If you work with Docker daily, you know the routine: switch to a terminal, type `docker ps`, scroll through logs, copy container IDs, restart services. It adds up. This MCP server lets your AI assistant handle those tasks for you while you stay focused on code. Ask it to check which containers are running, pull up logs from a failing service, or restart something that got stuck. It talks to Docker's API through the local socket, so there's nothing to configure and no credentials to manage.

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
      "args": ["-y", "mcp-docker-server"]
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
      "args": ["-y", "mcp-docker-server"]
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
        "args": ["-y", "mcp-docker-server"]
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
- The server connects to the Docker socket at `/var/run/docker.sock` (Linux/macOS) or the named pipe on Windows
- No API keys or tokens required

## Development

```bash
git clone https://github.com/ofershap/mcp-server-docker.git
cd mcp-server-docker
npm install
npm test
npm run build
```

## See also

More MCP servers and developer tools on my [portfolio](https://gitshow.dev/ofershap).

## Author

**Ofer Shapira**

[![LinkedIn](https://img.shields.io/badge/LinkedIn-ofershap-blue?logo=linkedin)](https://linkedin.com/in/ofershap)
[![GitHub](https://img.shields.io/badge/GitHub-ofershap-black?logo=github)](https://github.com/ofershap)
[![Portfolio](https://img.shields.io/badge/Portfolio-gitshow.dev-orange)](https://gitshow.dev/ofershap)

## License

MIT © 2026 Ofer Shapira
