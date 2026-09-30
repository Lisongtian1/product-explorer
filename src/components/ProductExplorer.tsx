"use client";

import { useEffect, useState } from "react";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";
import { defaultQuery, fetchProducts } from "@/lib/products";
import type { Product, ProductDraft, ProductList, SearchQuery } from "@/lib/products";

type LoadState = "loading" | "error" | "ready";

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<LoadState>("loading");
  const [errorMessage, setErrorMessage] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);

  function showResult(list: ProductList) {
    setProducts(list.products);
    setStatus("ready");
  }

  function showError(error: unknown) {
    setErrorMessage(error instanceof Error ? error.message : "เรียกข้อมูลไม่สำเร็จ");
    setStatus("error");
  }

  async function loadProducts(query: SearchQuery) {
    setStatus("loading");
    setErrorMessage("");
    try {
      showResult(await fetchProducts(query));
    } catch (error) {
      showError(error);
    }
  }

  // 4.1 โหลดอัตโนมัติเมื่อเปิดหน้า
  useEffect(() => {
    fetchProducts(defaultQuery).then(showResult).catch(showError);
  }, []);

  // 4.2 จัดการบันทึก (ทั้งเพิ่มและแก้ไข)
  function handleSave(draft: ProductDraft) {
    if (editingId !== null) {
      setProducts(products.map((item) => (item.id === editingId ? { ...draft, id: editingId } : item)));
      setEditingId(null);
    } else {
      setProducts([...products, { ...draft, id: Date.now() }]);
    }
  }

  // 4.2 ฟังก์ชันลบรายการ
  function removeProduct(id: number) {
    setProducts(products.filter((item) => item.id !== id));
    if (editingId === id) {
      setEditingId(null);
    }
  }

  const currentEditingProduct = products.find((item) => item.id === editingId) ?? null;

  return (
    <main style={{ padding: "1.5rem", maxWidth: "800px", margin: "0 auto" }}>
      <h1>รายการสินค้า</h1>

      <button
        type="button"
        onClick={() => loadProducts(defaultQuery)}
        disabled={status === "loading"}
        style={{ marginBottom: "1rem" }}
      >
        {status === "loading" ? "กำลังโหลด..." : "โหลดข้อมูลใหม่"}
      </button>

      {/* ฟอร์มค้นหา */}
      <ProductSearchForm onSearch={loadProducts} />

      {/* ฟอร์มเพิ่ม/แก้ไข (ใช้ key เพื่อ reset เมื่อสลับรายการที่แก้ไข) */}
      <ProductForm
        key={editingId ?? "new"}
        editing={currentEditingProduct}
        onSave={handleSave}
        onCancel={() => setEditingId(null)}
      />

      {/* ตารางและผลลัพธ์ */}
      <section aria-live="polite">
        {status === "loading" && <p>กำลังโหลดข้อมูล...</p>}
        {status === "error" && <p role="alert" style={{ color: "red" }}>{errorMessage}</p>}
        {status === "ready" && products.length === 0 && <p>ไม่พบสินค้าที่ตรงกับเงื่อนไข</p>}
        {status === "ready" && products.length > 0 && (
          <table border={1} cellPadding={8} style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr>
                <th>ชื่อสินค้า</th>
                <th>ราคา</th>
                <th>คงเหลือ</th>
                <th>หมวดหมู่</th>
                <th>จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {products.map((item) => (
                <tr key={item.id}>
                  <td>{item.title}</td>
                  <td>{item.price}</td>
                  <td>{item.stock}</td>
                  <td>{item.category}</td>
                  <td>
                    <button type="button" onClick={() => setEditingId(item.id)}>
                      แก้ไข
                    </button>
                    <button
                      type="button"
                      onClick={() => removeProduct(item.id)}
                      style={{ marginLeft: "0.5rem", color: "red" }}
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </main>
  );
}