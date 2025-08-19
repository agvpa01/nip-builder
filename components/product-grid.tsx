"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Loader2, FileText, Eye } from "lucide-react";

interface Product {
  title: string;
  productType: string;
  onlineStoreUrl: string;
  htmlStatus?: {
    hasAU: boolean;
    hasUS: boolean;
    hasAny: boolean;
    filename: string;
  };
}

interface ProductGridProps {
  onProductSelect: (product: Product) => void;
}

export function ProductGrid({ onProductSelect }: ProductGridProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const handleViewHTML = (product: Product, region: "au" | "us") => {
    const filename = product.onlineStoreUrl
      .replace(/[^a-zA-Z0-9]/g, "-")
      .toLowerCase();
    const url = `/api/html/${region}/${filename}`;
    window.open(url, "_blank");
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        "https://ysoc0k44w0os0gkg8k0s0ck8.coolify.vpa.com.au/api/products/simple"
      );
      const data = await response.json();

      if (data.success) {
        // Check HTML file status for all products
        const checkResponse = await fetch("/api/check-html", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ products: data.data.products }),
        });

        if (checkResponse.ok) {
          const checkData = await checkResponse.json();
          if (checkData.success) {
            setProducts(checkData.products);
          } else {
            setProducts(data.data.products);
          }
        } else {
          setProducts(data.data.products);
        }
      } else {
        setError("Failed to fetch products");
      }
    } catch (err) {
      setError("Error fetching products");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading products...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-12">
        <p className="text-destructive mb-4">{error}</p>
        <Button onClick={fetchProducts}>Try Again</Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product, index) => (
        <Card
          key={index}
          className="hover:shadow-lg transition-shadow cursor-pointer relative"
        >
          {product.htmlStatus?.hasAny && (
            <div className="absolute top-2 right-2 flex gap-1 z-10">
              {product.htmlStatus.hasAU && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewHTML(product, "au");
                  }}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="View AU HTML"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
              {product.htmlStatus.hasUS && (
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewHTML(product, "us");
                  }}
                  variant="outline"
                  size="sm"
                  className="h-8 w-8 p-0"
                  title="View US HTML"
                >
                  <Eye className="w-4 h-4" />
                </Button>
              )}
            </div>
          )}
          <CardHeader>
            <CardTitle className="text-lg line-clamp-2">
              {product.title}
            </CardTitle>
            {product.htmlStatus?.hasAny && (
              <div className="flex gap-2 mt-2">
                <Badge variant="secondary" className="text-xs">
                  <FileText className="w-3 h-3 mr-1" />
                  HTML Generated
                </Badge>
                {product.htmlStatus.hasAU && (
                  <Badge variant="outline" className="text-xs">
                    AU
                  </Badge>
                )}
                {product.htmlStatus.hasUS && (
                  <Badge variant="outline" className="text-xs">
                    US
                  </Badge>
                )}
              </div>
            )}
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">{product.productType}</p>
            <Button onClick={() => onProductSelect(product)} className="w-full">
              Build NIP
            </Button>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
