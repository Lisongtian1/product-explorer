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
    <form
      onSubmit={handleSubmit(saveProduct)}
      noValidate
      style={{
        border: "1px solid #ccc",
        padding: "1.5rem",
        marginBottom: "1.5rem",
        borderRadius: "8px",
        backgroundColor: "#fff",
      }}
    >
      <h3 style={{ marginTop: 0 }}>
        {editing ? "แก้ไขสินค้า" : "เพิ่มสินค้าใหม่"}
      </h3>

      {/* ช่องชื่อสินค้า */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="title" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "bold" }}>
          ชื่อสินค้า:
        </label>
        <input
          id="title"
          required
          {...register("title")}
          aria-invalid={!!errors.title}
          aria-describedby="title-error"
          style={{ width: "100%", padding: "0.5rem", boxSizing: "border-box" }}
        />
        {errors.title && (
          <span id="title-error" role="alert" style={{ color: "red", fontSize: "0.875rem", display: "block", marginTop: "0.25rem" }}>
            {errors.title.message}
          </span>
        )}
      </div>

      {/* ช่องราคา */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="price" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "bold" }}>
          ราคา:
        </label>
        <input
          id="price"
          type="number"
          step="0.01"
          required
          {...register("price", { valueAsNumber: true })}
          aria-invalid={!!errors.price}
          aria-describedby="price-error"
          style={{ width: "100%", padding: "0.5rem", boxSizing: "border-box" }}
        />
        {errors.price && (
          <span id="price-error" role="alert" style={{ color: "red", fontSize: "0.875rem", display: "block", marginTop: "0.25rem" }}>
            {errors.price.message}
          </span>
        )}
      </div>

      {/* ช่องคงเหลือ */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="stock" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "bold" }}>
          คงเหลือ:
        </label>
        <input
          id="stock"
          type="number"
          required
          {...register("stock", { valueAsNumber: true })}
          aria-invalid={!!errors.stock}
          aria-describedby="stock-error"
          style={{ width: "100%", padding: "0.5rem", boxSizing: "border-box" }}
        />
        {errors.stock && (
          <span id="stock-error" role="alert" style={{ color: "red", fontSize: "0.875rem", display: "block", marginTop: "0.25rem" }}>
            {errors.stock.message}
          </span>
        )}
      </div>

      {/* ช่องหมวดหมู่ */}
      <div style={{ marginBottom: "1rem" }}>
        <label htmlFor="category" style={{ display: "block", marginBottom: "0.25rem", fontWeight: "bold" }}>
          หมวดหมู่:
        </label>
        <select
          id="category"
          required
          {...register("category")}
          aria-invalid={!!errors.category}
          aria-describedby="category-error"
          style={{ width: "100%", padding: "0.5rem", boxSizing: "border-box" }}
        >
          <option value="">กรุณาเลือกหมวดหมู่</option>
          {CATEGORIES.map((name) => (
            <option key={name} value={name}>
              {name}
            </option>
          ))}
        </select>
        {errors.category && (
          <span id="category-error" role="alert" style={{ color: "red", fontSize: "0.875rem", display: "block", marginTop: "0.25rem" }}>
            {errors.category.message}
          </span>
        )}
      </div>

      {/* ปุ่มกด */}
      <div style={{ marginTop: "1.25rem" }}>
        <button
          type="submit"
          disabled={!isDirty || !isValid}
          style={{
            padding: "0.5rem 1rem",
            backgroundColor: !isDirty || !isValid ? "#ccc" : "#0284c7",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: !isDirty || !isValid ? "not-allowed" : "pointer",
          }}
        >
          {editing ? "บันทึกการแก้ไข" : "เพิ่มสินค้า"}
        </button>
        {editing && (
          <button
            type="button"
            onClick={onCancel}
            style={{
              marginLeft: "0.5rem",
              padding: "0.5rem 1rem",
              backgroundColor: "#f1f5f9",
              border: "1px solid #cbd5e1",
              borderRadius: "4px",
              cursor: "pointer",
            }}
          >
            ยกเลิก
          </button>
        )}
      </div>
    </form>
  );
}