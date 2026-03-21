import fs from "fs";
import path from "path";

export interface PortfolioItem {
  id: string;
  filename: string;
  originalName: string;
  order: number;
  createdAt: string;
}

const DATA_PATH = path.join(process.cwd(), "data", "portfolio.json");

function ensureDataDir() {
  const dir = path.dirname(DATA_PATH);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(DATA_PATH)) {
    fs.writeFileSync(DATA_PATH, JSON.stringify([], null, 2));
  }
}

export function getPortfolioItems(): PortfolioItem[] {
  ensureDataDir();
  const raw = fs.readFileSync(DATA_PATH, "utf-8");
  const items: PortfolioItem[] = JSON.parse(raw);
  return items.sort((a, b) => a.order - b.order);
}

export function savePortfolioItems(items: PortfolioItem[]) {
  ensureDataDir();
  fs.writeFileSync(DATA_PATH, JSON.stringify(items, null, 2));
}

export function addPortfolioItem(
  item: Omit<PortfolioItem, "order">
): PortfolioItem {
  const items = getPortfolioItems();
  const maxOrder = items.length > 0 ? Math.max(...items.map((i) => i.order)) : -1;
  const newItem: PortfolioItem = { ...item, order: maxOrder + 1 };
  items.push(newItem);
  savePortfolioItems(items);
  return newItem;
}

export function deletePortfolioItem(id: string): boolean {
  const items = getPortfolioItems();
  const index = items.findIndex((i) => i.id === id);
  if (index === -1) return false;

  const deleted = items[index];
  const filePath = path.join(process.cwd(), "public", "uploads", deleted.filename);
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }

  items.splice(index, 1);
  // Re-order remaining items
  items.sort((a, b) => a.order - b.order).forEach((item, i) => {
    item.order = i;
  });
  savePortfolioItems(items);
  return true;
}

export function reorderPortfolioItems(orderedIds: string[]) {
  const items = getPortfolioItems();
  orderedIds.forEach((id, index) => {
    const item = items.find((i) => i.id === id);
    if (item) item.order = index;
  });
  savePortfolioItems(items);
  return getPortfolioItems();
}
