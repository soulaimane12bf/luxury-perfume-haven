// Lightweight search utilities: normalization and fuzzy matching
export function normalizeString(input?: string) {
  if (!input) return '';
  // remove diacritics, lower-case, trim
  return input
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .toLowerCase()
    .trim();
}

// Levenshtein distance
export function levenshtein(a: string, b: string) {
  const aa = String(a || '');
  const bb = String(b || '');
  const m = aa.length;
  const n = bb.length;
  const dp: number[][] = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
  for (let i = 0; i <= m; i++) dp[i][0] = i;
  for (let j = 0; j <= n; j++) dp[0][j] = j;
  for (let i = 1; i <= m; i++) {
    for (let j = 1; j <= n; j++) {
      const cost = aa[i - 1] === bb[j - 1] ? 0 : 1;
      dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
    }
  }
  return dp[m][n];
}

// fuzzyMatch: returns true when q roughly matches target.
export function fuzzyMatch(q: string, target: string, threshold = 0.35) {
  const nq = normalizeString(q);
  const nt = normalizeString(target);
  if (!nq || !nt) return false;
  if (nt.includes(nq)) return true; // exact substring
  // Use relative Levenshtein distance
  const dist = levenshtein(nq, nt);
  const rel = dist / Math.max(nt.length, 1);
  return rel <= threshold;
}

// matches any of product name, brand, category fields
interface ProductLike {
  name?: string;
  brand?: string;
  category?: string;
}

export function productMatchesQuery(product: ProductLike | null | undefined, query: string) {
  if (!product || !query) return false;
  const q = String(query);
  if (fuzzyMatch(q, product.name || '')) return true;
  if (fuzzyMatch(q, product.brand || '')) return true;
  // product.category can be slug or name
  if (fuzzyMatch(q, product.category || '')) return true;
  return false;
}
