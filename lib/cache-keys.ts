// lib/cache-keys.ts

export const CK = {
  // listings — key includes every filter so each combination is cached separately
  listings: (filters: Record<string, unknown>) =>
    `listings:${JSON.stringify(filters)}`,

  // single vehicle detail
  vehicle: (slug: string) => `vehicle:${slug}`,

  // condition counts (with filters — for tab badges)
  conditionCounts: (filters: Record<string, unknown>) =>
    `condition-counts:${JSON.stringify(filters)}`,

  // category counts
  categoryCounts: () => `category-counts`,

  // budget bucket counts
  budgetCounts: () => `budget-counts`,

  // homepage stats (total, sold, years)
  stats: () => `stats`,

  // featured vehicle (staff pick)
  featured: () => `featured`,

  // recently sold
  recentSold: (limit: number) => `recent-sold:${limit}`,

  // adjacent vehicles on detail page
  adjacent: (id: string, condition: string, createdAt: string) =>
    `adjacent:${id}:${condition}:${createdAt}`,

  // similar vehicles
  similar: (id: string, body: string | null, price: number | null) =>
    `similar:${id}:${body}:${price}`,
} as const;