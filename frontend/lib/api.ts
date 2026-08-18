const BASE = process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000";

export interface Summary {
  terminals: number;
  payments: number;
  turnover: number;
  reward: number;
  commission: number;
  avg_check: number;
  zero_commission_count: number;
  zero_commission_turnover: number;
  period: string;
}

export interface Segment {
  name: string;
  count: number;
  turnover: number;
  share: number;
  payments: number;
  avg_check: number;
}

export interface Bucket {
  label: string;
  count: number;
  turnover: number;
}

export interface Terminal {
  number: number;
  name: string;
  payments: number;
  turnover: number;
  reward: number;
  commission: number;
  avg_check: number;
  has_commission: boolean;
}

let token = "";

export function setToken(value: string): void {
  token = value;
}

export interface EfficiencyItem {
  number: number;
  name: string;
  turnover: number;
  reward: number;
  yield_per_million: number;
  ratio_to_average: number;
}

export interface Efficiency {
  average: number;
  best: EfficiencyItem[];
  worst: EfficiencyItem[];
}

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}/api/v1${path}`, {
    cache: "no-store",
    headers: { "X-Demo-Token": token },
  });
  if (!response.ok) {
    throw new Error(`API ${response.status}: ${path}`);
  }
  return response.json() as Promise<T>;
}

export type Region = string | null;

function withRegion(params: Record<string, string | number>, region: Region): string {
  const query = new URLSearchParams(
    Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
  );
  if (region) query.set("region", region);
  return query.toString();
}

export async function login(password: string): Promise<string> {
  const response = await fetch(`${BASE}/api/v1/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  if (!response.ok) {
    throw new Error("wrong-password");
  }
  const data = (await response.json()) as { token: string };
  setToken(data.token);
  return data.token;
}

export const fetchSummary = (region: Region = null) =>
  get<Summary>(`/dashboard/summary?${withRegion({}, region)}`);
export const fetchSegments = (region: Region = null) =>
  get<Segment[]>(`/dashboard/segments?${withRegion({}, region)}`);
export const fetchDistribution = (region: Region = null) =>
  get<Bucket[]>(`/dashboard/distribution?${withRegion({}, region)}`);
export const fetchTerminals = (
  limit = 20,
  order: "asc" | "desc" = "desc",
  region: Region = null,
) => get<Terminal[]>(`/dashboard/terminals?${withRegion({ limit, order }, region)}`);
export const fetchEfficiency = (region: Region = null) =>
  get<Efficiency>(`/dashboard/efficiency?${withRegion({}, region)}`);
