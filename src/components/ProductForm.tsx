"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CATEGORIES, ProductDraftSchema } from "@/lib/products";
import type { Product, ProductDraft } from "@/lib/products";

type ProductFormProps = {
  editing: Product | null;
  onSave: (draft: ProductDraft) => void;
  onCancel: () => void;
};

export default function ProductForm({ editing, onSave, onCancel }: ProductFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isDirty, isValid },
  } = useForm<ProductDraft>({
    resolver: zodResolver(ProductDraftSchema),
    mode: "onTouched",
    defaultValues: editing
      ? {
          title: editing.title,
          price: editing.price,
          stock: editing.stock,
          category: editing.category,
        }
      : {
          title: "",
          price: undefined,
          stock: undefined,
        },
  });

  function saveProduct(values: ProductDraft) {
    onSave(values);
    reset();
  }

  return (
    <form onSubmit={handleSubmit(saveProduct)} noValidate style={{ border: "1px solid #ccc", padding: "1rem", marginBottom: "1.5rem" }}>
      <h3>{editing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}</h3>

      <div>
        <label htmlFor="title">ชื่อสินค้า: </label>
        <input
          id="title"
          required
          {...register("title")}
          aria-invalid={!!errors.title}
          aria-describedby="title-error"
        />
        {errors.title && (
          <span id="title-error" role="alert" style={{ color: "red", marginLeft: "0.5rem" }}>
            {errors.title.message}
          </span>
        )}
      </div>

      <div style={{ marginTop: "0.5rem" }}>
        <label htmlFor="price">ราคา: </label>
        <input
          id="price"
          type="number"
          step="0.01"
          required
          {...register("price", { valueAsNumber: true })}
          aria-invalid={!!errors.price}
          aria-describedby="price-error"
        />
        {errors.price && (
          <span id="price-error" role="alert" style={{ color: "red", marginLeft: "0.5rem" }}>
            {errors.price.message}
          </span>
        )}
      </div>

      <div style={{ marginTop: "0.5rem" }}>
        <label htmlFor="stock">คงเหลือ: </label>
        <input
          id="stock"
          type="number"
          required
          {...register("stock", { valueAsNumber: true })}
          aria-invalid={!!errors.stock}
          aria-describedby="stock-error"
        />
        {errors.stock && (
          <span id="stock-error" role="alert" style={{ color: "red", marginLeft: "0.5rem" }}>
            {errors.stock.message}
          </span>
        )}
      </div>

      <div style={{ marginTop: "0.5rem" }}>
        <label htmlFor="category">หมวดหมู่: </label>
        <select
          id="category"
          required
          {...register("category")}
          aria-invalid={!!errors.category}
          aria-describedby="category-error"
        >
          <option value="">กรุณาเลือกหมวดหมู่</option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        {errors.category && (
          <span id="category-error" role="alert" style={{ color: "red", marginLeft: "0.5rem" }}>
            {errors.category.message}
          </span>
        )}
      </div>

      <div style={{ marginTop: "1rem" }}>
        <button type="submit" disabled={!isDirty || !isValid}>
          {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </button>
        {editing && (
          <button type="button" onClick={onCancel} style={{ marginLeft: "0.5rem" }}>
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}