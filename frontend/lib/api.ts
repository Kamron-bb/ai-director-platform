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

async function get<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE}/api/v1${path}`, { cache: "no-store" });
  if (!response.ok) {
    throw new Error(`API ${response.status}: ${path}`);
  }
  return response.json() as Promise<T>;
}

export const fetchSummary = () => get<Summary>("/dashboard/summary");
export const fetchSegments = () => get<Segment[]>("/dashboard/segments");
export const fetchDistribution = () => get<Bucket[]>("/dashboard/distribution");
export const fetchTerminals = (limit = 20) =>
  get<Terminal[]>(`/dashboard/terminals?limit=${limit}`);
