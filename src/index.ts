import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { z } from "zod";
import {
  listContainers,
  containerLogs,
  startContainer,
  stopContainer,
  restartContainer,
  removeContainer,
  execCommand,
  containerStats,
  listImages,
  removeImage,
} from "./docker.js";

const server = new McpServer({
  name: "mcp-server-docker",
  version: "1.0.0",
});

server.tool(
  "list_containers",
  "List Docker containers. Set all=true to include stopped containers.",
  {
    all: z
      .boolean()
      .optional()
      .default(false)
      .describe("Include stopped containers"),
  },
  async ({ all }) => {
    const containers = await listContainers(all);
    return {
      content: [
        {
          type: "text",
          text:
            containers.length === 0
              ? "No containers found."
              : containers
                  .map(
                    (c) =>
                      `${c.id}  ${c.name.padEnd(30)}  ${c.image.padEnd(30)}  ${c.state.padEnd(10)}  ${c.status}`,
                  )
                  .join("\n"),
        },
      ],
    };
  },
);

server.tool(
  "container_logs",
  "Get logs from a Docker container.",
  {
    id: z.string().describe("Container ID or name"),
    tail: z
      .number()
      .optional()
      .default(100)
      .describe("Number of lines from the end"),
  },
  async ({ id, tail }) => {
    const logs = await containerLogs(id, tail);
    return { content: [{ type: "text", text: logs || "(no logs)" }] };
  },
);

server.tool(
  "start_container",
  "Start a stopped Docker container.",
  { id: z.string().describe("Container ID or name") },
  async ({ id }) => {
    const result = await startContainer(id);
    return { content: [{ type: "text", text: result }] };
  },
);

server.tool(
  "stop_container",
  "Stop a running Docker container.",
  { id: z.string().describe("Container ID or name") },
  async ({ id }) => {
    const result = await stopContainer(id);
    return { content: [{ type: "text", text: result }] };
  },
);

server.tool(
  "restart_container",
  "Restart a Docker container.",
  { id: z.string().describe("Container ID or name") },
  async ({ id }) => {
    const result = await restartContainer(id);
    return { content: [{ type: "text", text: result }] };
  },
);

server.tool(
  "remove_container",
  "Remove a Docker container. Use force=true to remove running containers.",
  {
    id: z.string().describe("Container ID or name"),
    force: z
      .boolean()
      .optional()
      .default(false)
      .describe("Force remove running container"),
  },
  async ({ id, force }) => {
    const result = await removeContainer(id, force);
    return { content: [{ type: "text", text: result }] };
  },
);

server.tool(
  "exec_command",
  "Execute a command inside a running Docker container.",
  {
    id: z.string().describe("Container ID or name"),
    command: z
      .array(z.string())
      .describe("Command and arguments, e.g. ['ls', '-la']"),
  },
  async ({ id, command }) => {
    const output = await execCommand(id, command);
    return {
      content: [{ type: "text", text: output || "(no output)" }],
    };
  },
);

server.tool(
  "container_stats",
  "Get CPU, memory, and network stats for a running Docker container.",
  { id: z.string().describe("Container ID or name") },
  async ({ id }) => {
    const stats = await containerStats(id);
    return {
      content: [
        {
          type: "text",
          text: [
            `CPU:     ${stats.cpu_percent}`,
            `Memory:  ${stats.memory_usage} / ${stats.memory_limit} (${stats.memory_percent})`,
            `Network: ↓ ${stats.network_rx}  ↑ ${stats.network_tx}`,
          ].join("\n"),
        },
      ],
    };
  },
);

server.tool("list_images", "List Docker images on the host.", {}, async () => {
  const images = await listImages();
  return {
    content: [
      {
        type: "text",
        text:
          images.length === 0
            ? "No images found."
            : images
                .map(
                  (img) =>
                    `${img.id}  ${img.tags.join(", ").padEnd(40)}  ${img.size.padEnd(10)}  ${img.created}`,
                )
                .join("\n"),
      },
    ],
  };
});

server.tool(
  "remove_image",
  "Remove a Docker image. Use force=true to force removal.",
  {
    id: z.string().describe("Image ID or tag"),
    force: z.boolean().optional().default(false).describe("Force remove"),
  },
  async ({ id, force }) => {
    const result = await removeImage(id, force);
    return { content: [{ type: "text", text: result }] };
  },
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("Fatal error:", error);
  process.exit(1);
});
