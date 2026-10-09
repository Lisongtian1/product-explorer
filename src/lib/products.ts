import { z } from "zod";
import fallbackData from "@/data/products-fallback.json";

// 1. ตัวเลือกคงที่ (Constants)
export const CATEGORIES = [
  "all",
  "beauty",
  "fragrances",
  "furniture",
  "groceries",
] as const;

export const SORT_FIELDS = ["title", "name", "price", "stock"] as const;

// 2. Schema และ Type สำหรับ Search / Filter
export const SearchQuerySchema = z.object({
  q: z.string().optional().default(""),
  category: z.string().optional().default("all"),
  sortBy: z.string().optional().default("title"),
  order: z.string().optional().default("asc"),
  limit: z.coerce.number().optional().default(10),
});

export type SearchQuery = {
  q?: string;
  category?: string;
  sortBy?: string;
  order?: string;
  limit?: number;
};

export const defaultQuery: SearchQuery = {
  q: "",
  category: "all",
  sortBy: "title",
  order: "asc",
  limit: 10,
};

// 3. Schema และ Type สำหรับ Form เพิ่ม/แก้ไขสินค้า
export const ProductDraftSchema = z.object({
  title: z.string().min(1, "Title is required"),
  name: z.string().optional(),
  price: z.coerce.number().min(0, "Price must be positive"),
  stock: z.coerce.number().min(0, "Stock must be positive"),
  category: z.string().min(1, "Category is required"),
  description: z.string().optional().default(""),
});

export type ProductDraft = z.infer<typeof ProductDraftSchema>;

// 4. Data Model ของ Product (รองรับทั้ง title และ name ให้ตรงกับทุกไฟล์)
export type Product = {
  id: string;
  name: string;
  title: string;
  price: number;
  stock: number;
  category: string;
  description: string;
};

// จัดการแปลงข้อมูล Fallback Data
const rawList = (fallbackData as any)?.products ?? (Array.isArray(fallbackData) ? fallbackData : []);

const initialProducts: Product[] = rawList.length
  ? rawList.map((item: any, idx: number) => ({
      id: String(item.id ?? `p${idx + 1}`),
      name: item.name ?? item.title ?? "Product",
      title: item.title ?? item.name ?? "Product",
      price: Number(item.price ?? 0),
      stock: Number(item.stock ?? 0),
      category: item.category ?? "general",
      description: item.description ?? "",
    }))
  : [
      {
        id: "p001",
        name: "Mechanical Keyboard",
        title: "Mechanical Keyboard",
        price: 2590,
        stock: 10,
        category: "furniture",
        description: "คีย์บอร์ด Mechanical สำหรับทำงานและเล่นเกม",
      },
      {
        id: "p002",
        name: "Wireless Mouse",
        title: "Wireless Mouse",
        price: 1290,
        stock: 25,
        category: "furniture",
        description: "เมาส์ไร้สาย น้ำหนักเบา",
      },
      {
        id: "p003",
        name: "USB-C Hub",
        title: "USB-C Hub",
        price: 1890,
        stock: 15,
        category: "furniture",
        description: "USB-C Hub พร้อม HDMI และ Card Reader",
      },
    ];

declare global {
  // eslint-disable-next-line no-var
  var demoProducts: Product[] | undefined;
}

const products =
  globalThis.demoProducts ?? structuredClone(initialProducts);

if (process.env.NODE_ENV !== "production") {
  globalThis.demoProducts = products;
}

// 5. Functions จัดการข้อมูลสินค้า
export function getProducts() {
  return products;
}

export function getProduct(id: string | number) {
  return products.find((product) => String(product.id) === String(id));
}

export function addProduct(draft: Partial<ProductDraft>) {
  const finalTitle = draft.title || draft.name || "New Product";
  const newProduct: Product = {
    id: `p${Date.now()}`,
    name: draft.name || finalTitle,
    title: finalTitle,
    price: Number(draft.price ?? 0),
    stock: Number(draft.stock ?? 0),
    category: draft.category ?? "general",
    description: draft.description ?? "",
  };
  products.unshift(newProduct);
  return newProduct;
}

export function updateProduct(id: string | number, values: Partial<Product>) {
  const product = getProduct(id);
  if (!product) {
    throw new Error("Product not found");
  }
  if (values.name && !values.title) values.title = values.name;
  if (values.title && !values.name) values.name = values.title;
  Object.assign(product, values);
  return product;
}

export function deleteProduct(id: string | number) {
  const index = products.findIndex((product) => String(product.id) === String(id));
  if (index === -1) {
    throw new Error("Product not found");
  }
  products.splice(index, 1);
}