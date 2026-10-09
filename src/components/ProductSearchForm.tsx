"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
  initialData?: Product;
  onSubmit: (values: ProductDraft) => void | Promise<void>;
  isSubmitting?: boolean;
};

export default function ProductForm({
  initialData,
  onSubmit,
  isSubmitting = false,
}: ProductFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(ProductDraftSchema) as any,
    defaultValues: {
      title: initialData?.title || initialData?.name || "",
      price: initialData?.price ?? 0,
      stock: initialData?.stock ?? 0,
      category: initialData?.category || "furniture",
      description: initialData?.description || "",
    },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit as any)} noValidate style={{ display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "400px" }}>
      <div>
        <label htmlFor="title">ชื่อสินค้า: </label>
        <input id="title" {...register("title")} style={{ width: "100%", padding: "0.5rem" }} />
        {errors.title && <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.title.message as string}</span>}
      </div>

      <div>
        <label htmlFor="price">ราคา: </label>
        <input id="price" type="number" step="0.01" {...register("price", { valueAsNumber: true })} style={{ width: "100%", padding: "0.5rem" }} />
        {errors.price && <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.price.message as string}</span>}
      </div>

      <div>
        <label htmlFor="stock">จำนวนในสต็อก: </label>
        <input id="stock" type="number" {...register("stock", { valueAsNumber: true })} style={{ width: "100%", padding: "0.5rem" }} />
        {errors.stock && <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.stock.message as string}</span>}
      </div>

      <div>
        <label htmlFor="category">หมวดหมู่: </label>
        <select id="category" {...register("category")} style={{ width: "100%", padding: "0.5rem" }}>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        {errors.category && <span style={{ color: "red", fontSize: "0.875rem" }}>{errors.category.message as string}</span>}
      </div>

      <div>
        <label htmlFor="description">รายละเอียด: </label>
        <textarea id="description" rows={3} {...register("description")} style={{ width: "100%", padding: "0.5rem" }} />
      </div>

      <button type="submit" disabled={isSubmitting} style={{ padding: "0.5rem 1rem", cursor: "pointer" }}>
        {isSubmitting ? "กำลังบันทึก..." : "บันทึกข้อมูล"}
      </button>
    </form>
  );
}