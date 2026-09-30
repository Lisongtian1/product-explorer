"use client";

import React, { useState } from "react";
import ProductSearchForm from "./ProductSearchForm";
import ProductForm from "./ProductForm";

const API_BASE = "https://dummyjson.com"; 

interface Product {
  id: number;
  title: string;
  price: number;
  stock: number;
  category: string;
}

export default function ProductExplorer() {
  const [products, setProducts] = useState<Product[]>([]);
  const [status, setStatus] = useState<"idle" | "loading" | "ready" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");
  const [editingProduct, setEditingProduct] = useState<any>(null);

  const fetchProducts = async () => {
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch(`${API_BASE}/products`);
      if (!res.ok) throw new Error("เรียกข้อมูลไม่สำเร็จ");
      const data = await res.json();
      setProducts(data.products || []);
      setStatus("ready");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to fetch");
    }
  };

  // ค้นหาข้อมูลสินค้า: ใส่หน่วงเวลา 10 วินาทีเพื่อให้ปุ่มค้างสถานะ 'กำลังค้นหา' นานพอที่จะแคปภาพทัน
  const handleSearch = async (query: { q: string; limit: number; sortBy: string; order?: string }): Promise<void> => {
    setStatus("loading");
    setErrorMessage("");

    // หน่วงเวลาค้างไว้ 10 วินาที (10000ms)
    await new Promise((resolve) => setTimeout(resolve, 10000));

    try {
      const encodedQuery = encodeURIComponent(query.q || "");
      const res = await fetch(`${API_BASE}/products/search?q=${encodedQuery}&limit=${query.limit || 10}&sortBy=${query.sortBy || "title"}`);
      
      if (!res.ok) throw new Error("ค้นหาข้อมูลไม่สำเร็จ");
      const data = await res.json();
      setProducts(data.products || []);
      setStatus("ready");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "Failed to fetch");
    }
  };

  const handleSave = async (formData: any): Promise<void> => {
    console.log("Save:", formData);
    setEditingProduct(null);
  };

  const handleCancel = () => {
    setEditingProduct(null);
  };

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ textAlign: "center" }}>รายการสินค้า</h1>

      <div style={{ textAlign: "center", marginBottom: "20px" }}>
        <button
          onClick={fetchProducts}
          disabled={status === "loading"}
          style={{
            padding: "8px 16px",
            cursor: status === "loading" ? "not-allowed" : "pointer",
          }}
        >
          {status === "loading" ? "กำลังโหลด..." : "โหลดข้อมูลใหม่"}
        </button>
      </div>

      <div style={{ marginBottom: "20px" }}>
        <ProductSearchForm onSearch={handleSearch} />
      </div>

      <div style={{ marginBottom: "20px" }}>
        <ProductForm 
          editing={editingProduct} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      </div>

      <div style={{ marginTop: "20px", textAlign: "center" }}>
        {status === "idle" && (
          <p style={{ fontSize: "18px", color: "#555" }}>คลิกปุ่มโหลดข้อมูลเพื่อเริ่ม</p>
        )}

        {status === "loading" && (
          <p style={{ fontSize: "18px", color: "#0070f3" }}>กำลังโหลดข้อมูล</p>
        )}

        {status === "error" && (
          <p style={{ fontSize: "18px", color: "red", fontWeight: "bold" }}>
            {errorMessage || "เรียกข้อมูลไม่สำเร็จ"}
          </p>
        )}

        {status === "ready" && (
          products.length === 0 ? (
            <p style={{ fontSize: "18px", color: "#666", padding: "20px" }}>
              ไม่พบสินค้าที่ตรงกับเงื่อนไข
            </p>
          ) : (
            <table
              border={1}
              cellPadding={8}
              cellSpacing={0}
              style={{ width: "100%", borderCollapse: "collapse", marginTop: "10px" }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f2f2f2" }}>
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
                    <td style={{ textAlign: "left" }}>{item.title}</td>
                    <td>{item.price}</td>
                    <td>{item.stock}</td>
                    <td>{item.category}</td>
                    <td>
                      <button 
                        onClick={() => setEditingProduct(item)}
                        style={{ marginRight: "5px", color: "blue" }}
                      >
                        แก้ไข
                      </button>
                      <button style={{ color: "red" }}>ลบ</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )
        )}
      </div>
    </div>
  );
}