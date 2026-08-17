export function formatMoney(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)} млрд`;
  }
  if (value >= 1_000_000) {
    return `${(value / 1_000_000).toFixed(1)} млн`;
  }
  if (value >= 1_000) {
    return `${(value / 1_000).toFixed(0)} тыс`;
  }
  return value.toFixed(0);
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("ru-RU").format(Math.round(value));
}

export function formatPercent(value: number): string {
  return `${value.toFixed(1)}%`;
}
