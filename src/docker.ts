import Dockerode from "dockerode";

const docker = new Dockerode();

export interface ContainerInfo {
  id: string;
  name: string;
  image: string;
  state: string;
  status: string;
  ports: string;
  created: string;
}

export interface ContainerStats {
  cpu_percent: string;
  memory_usage: string;
  memory_limit: string;
  memory_percent: string;
  network_rx: string;
  network_tx: string;
}

export interface ImageInfo {
  id: string;
  tags: string[];
  size: string;
  created: string;
}

function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(1)} ${sizes[i]}`;
}

function formatPorts(ports: Dockerode.Port[]): string {
  return ports
    .map((p) => {
      if (p.PublicPort) return `${p.PublicPort}->${p.PrivatePort}/${p.Type}`;
      return `${p.PrivatePort}/${p.Type}`;
    })
    .join(", ");
}

export async function listContainers(all: boolean): Promise<ContainerInfo[]> {
  const containers = await docker.listContainers({ all });
  return containers.map((c) => ({
    id: c.Id.slice(0, 12),
    name: c.Names[0]?.replace(/^\//, "") ?? "",
    image: c.Image,
    state: c.State,
    status: c.Status,
    ports: formatPorts(c.Ports),
    created: new Date(c.Created * 1000).toISOString(),
  }));
}

export async function containerLogs(id: string, tail: number): Promise<string> {
  const container = docker.getContainer(id);
  const logs = await container.logs({
    stdout: true,
    stderr: true,
    tail,
    follow: false,
  });
  // Strip Docker log control characters (eslint: intentional for Docker output)
  return logs.toString("utf-8").replace(/[\x00-\x08]/g, ""); // eslint-disable-line no-control-regex
}

export async function startContainer(id: string): Promise<string> {
  const container = docker.getContainer(id);
  await container.start();
  return `Container ${id} started`;
}

export async function stopContainer(id: string): Promise<string> {
  const container = docker.getContainer(id);
  await container.stop();
  return `Container ${id} stopped`;
}

export async function restartContainer(id: string): Promise<string> {
  const container = docker.getContainer(id);
  await container.restart();
  return `Container ${id} restarted`;
}

export async function removeContainer(
  id: string,
  force: boolean,
): Promise<string> {
  const container = docker.getContainer(id);
  await container.remove({ force });
  return `Container ${id} removed`;
}

export async function execCommand(
  id: string,
  command: string[],
): Promise<string> {
  const container = docker.getContainer(id);
  const exec = await container.exec({
    Cmd: command,
    AttachStdout: true,
    AttachStderr: true,
  });
  const stream = await exec.start({ hijack: true, stdin: false });
  return new Promise((resolve) => {
    const chunks: Buffer[] = [];
    stream.on("data", (chunk: Buffer) => chunks.push(chunk));
    stream.on("end", () => {
      resolve(
        Buffer.concat(chunks)
          .toString("utf-8")
          .replace(/[\x00-\x08]/g, ""), // eslint-disable-line no-control-regex
      );
    });
  });
}

interface CpuStats {
  cpu_usage: { total_usage: number; percpu_usage?: number[] };
  system_cpu_usage: number;
}

interface MemoryStats {
  usage?: number;
  limit?: number;
}

type NetworkStats = Record<string, { rx_bytes?: number; tx_bytes?: number }>;

export async function containerStats(id: string): Promise<ContainerStats> {
  const container = docker.getContainer(id);
  const stats = (await container.stats({
    stream: false,
  })) as {
    cpu_stats: CpuStats;
    precpu_stats: CpuStats;
    memory_stats: MemoryStats;
    networks?: NetworkStats;
  };

  const cpuStats = stats.cpu_stats;
  const precpuStats = stats.precpu_stats;
  const cpuDelta =
    cpuStats.cpu_usage.total_usage - precpuStats.cpu_usage.total_usage;
  const systemDelta = cpuStats.system_cpu_usage - precpuStats.system_cpu_usage;
  const cpuCount = cpuStats.cpu_usage.percpu_usage?.length ?? 1;
  const cpuPercent =
    systemDelta > 0
      ? ((cpuDelta / systemDelta) * cpuCount * 100).toFixed(2)
      : "0.00";

  const memUsage = stats.memory_stats.usage ?? 0;
  const memLimit = stats.memory_stats.limit ?? 0;
  const memPercent =
    memLimit > 0 ? ((memUsage / memLimit) * 100).toFixed(2) : "0.00";

  const networks = stats.networks ?? {};
  let rxBytes = 0;
  let txBytes = 0;
  for (const iface of Object.values(networks)) {
    rxBytes += iface.rx_bytes ?? 0;
    txBytes += iface.tx_bytes ?? 0;
  }

  return {
    cpu_percent: `${cpuPercent}%`,
    memory_usage: formatBytes(memUsage),
    memory_limit: formatBytes(memLimit),
    memory_percent: `${memPercent}%`,
    network_rx: formatBytes(rxBytes),
    network_tx: formatBytes(txBytes),
  };
}

export async function listImages(): Promise<ImageInfo[]> {
  const images = await docker.listImages();
  return images.map((img) => ({
    id: img.Id.replace("sha256:", "").slice(0, 12),
    tags: img.RepoTags ?? ["<none>"],
    size: formatBytes(img.Size),
    created: new Date(img.Created * 1000).toISOString(),
  }));
}

export async function removeImage(id: string, force: boolean): Promise<string> {
  const image = docker.getImage(id);
  await image.remove({ force });
  return `Image ${id} removed`;
}
