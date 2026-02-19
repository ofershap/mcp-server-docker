import { describe, it, expect, vi } from "vitest";

vi.mock("dockerode", () => {
  const mockContainer = {
    logs: vi.fn().mockResolvedValue(Buffer.from("log line 1\nlog line 2")),
    start: vi.fn().mockResolvedValue(undefined),
    stop: vi.fn().mockResolvedValue(undefined),
    restart: vi.fn().mockResolvedValue(undefined),
    remove: vi.fn().mockResolvedValue(undefined),
    stats: vi.fn().mockResolvedValue({
      cpu_stats: {
        cpu_usage: { total_usage: 200, percpu_usage: [100, 100] },
        system_cpu_usage: 10000,
      },
      precpu_stats: {
        cpu_usage: { total_usage: 100 },
        system_cpu_usage: 9000,
      },
      memory_stats: { usage: 52428800, limit: 1073741824 },
      networks: { eth0: { rx_bytes: 1024, tx_bytes: 2048 } },
    }),
    exec: vi.fn().mockResolvedValue({
      start: vi.fn().mockResolvedValue({
        on: vi.fn((event: string, cb: (data?: Buffer) => void) => {
          if (event === "data") cb(Buffer.from("command output"));
          if (event === "end") cb();
        }),
      }),
    }),
  };

  const MockDockerode = vi.fn().mockImplementation(() => ({
    listContainers: vi.fn().mockResolvedValue([
      {
        Id: "abc123def456",
        Names: ["/my-container"],
        Image: "nginx:latest",
        State: "running",
        Status: "Up 2 hours",
        Ports: [{ PublicPort: 8080, PrivatePort: 80, Type: "tcp" }],
        Created: 1700000000,
      },
    ]),
    listImages: vi.fn().mockResolvedValue([
      {
        Id: "sha256:abc123def456789",
        RepoTags: ["nginx:latest"],
        Size: 142000000,
        Created: 1700000000,
      },
    ]),
    getContainer: vi.fn().mockReturnValue(mockContainer),
    getImage: vi.fn().mockReturnValue({
      remove: vi.fn().mockResolvedValue(undefined),
    }),
  }));

  return { default: MockDockerode };
});

import {
  listContainers,
  containerLogs,
  startContainer,
  stopContainer,
  restartContainer,
  removeContainer,
  containerStats,
  listImages,
  removeImage,
} from "../src/docker.js";

describe("listContainers", () => {
  it("returns formatted container list", async () => {
    const containers = await listContainers(false);
    expect(containers).toHaveLength(1);
    expect(containers[0].name).toBe("my-container");
    expect(containers[0].image).toBe("nginx:latest");
    expect(containers[0].state).toBe("running");
  });
});

describe("containerLogs", () => {
  it("returns log output", async () => {
    const logs = await containerLogs("abc123", 100);
    expect(logs).toContain("log line 1");
  });
});

describe("startContainer", () => {
  it("starts a container", async () => {
    const result = await startContainer("abc123");
    expect(result).toContain("started");
  });
});

describe("stopContainer", () => {
  it("stops a container", async () => {
    const result = await stopContainer("abc123");
    expect(result).toContain("stopped");
  });
});

describe("restartContainer", () => {
  it("restarts a container", async () => {
    const result = await restartContainer("abc123");
    expect(result).toContain("restarted");
  });
});

describe("removeContainer", () => {
  it("removes a container", async () => {
    const result = await removeContainer("abc123", false);
    expect(result).toContain("removed");
  });
});

describe("containerStats", () => {
  it("returns formatted stats", async () => {
    const stats = await containerStats("abc123");
    expect(stats.cpu_percent).toContain("%");
    expect(stats.memory_usage).toBeTruthy();
    expect(stats.network_rx).toBeTruthy();
  });
});

describe("listImages", () => {
  it("returns formatted image list", async () => {
    const images = await listImages();
    expect(images).toHaveLength(1);
    expect(images[0].tags).toContain("nginx:latest");
  });
});

describe("removeImage", () => {
  it("removes an image", async () => {
    const result = await removeImage("abc123", false);
    expect(result).toContain("removed");
  });
});
