export const fmtKES = (n?: number | null) =>
  n == null ? 'Ask for price'
            : `KSh ${new Intl.NumberFormat('en-KE', { maximumFractionDigits: 0 }).format(n)}`;
