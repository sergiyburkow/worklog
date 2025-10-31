export const INVENTORY_UNITS = [
  'pcs', 'kg', 'g', 'm', 'cm', 'mm', 'l'
] as const;

export type InventoryUnit = typeof INVENTORY_UNITS[number];


