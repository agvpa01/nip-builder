"use client";

import { useState, useEffect } from "react";
import { ProductGrid } from "@/components/product-grid";
import { NipBuilder } from "@/components/nip-builder";
import { TemplateSelector } from "@/components/template-selector";
import { Login } from "@/components/login";
import { Button } from "@/components/ui/button";
import { ArrowLeft, LogOut } from "lucide-react";

export default function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [showTemplateSelector, setShowTemplateSelector] = useState(false);
  const [showBuilder, setShowBuilder] = useState(false);

  // Check authentication status on component mount
  useEffect(() => {
    const checkAuth = () => {
      const authStatus = localStorage.getItem("nipBuilder_authenticated");
      setIsAuthenticated(authStatus === "true");
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem("nipBuilder_authenticated");
    localStorage.removeItem("nipBuilder_user");
    setIsAuthenticated(false);
    // Reset all states
    setSelectedProduct(null);
    setSelectedTemplate("");
    setShowTemplateSelector(false);
    setShowBuilder(false);
  };

  const handleProductSelect = (product: any) => {
    setSelectedProduct(product);
    setShowTemplateSelector(true);
  };

  const handleTemplateSelect = (template: string) => {
    setSelectedTemplate(template);
    setShowTemplateSelector(false);
    setShowBuilder(true);
  };

  const handleBackToProducts = () => {
    setShowBuilder(false);
    setShowTemplateSelector(false);
    setSelectedProduct(null);
    setSelectedTemplate("");
  };

  const handleBackToTemplates = () => {
    setShowBuilder(false);
    setShowTemplateSelector(true);
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header with logout button */}
        <div className="flex justify-between items-center mb-8">
          <div></div>
          <Button
            onClick={handleLogout}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </Button>
        </div>

        {!showTemplateSelector && !showBuilder ? (
          <div>
            <div className="text-center mb-8">
              <h1 className="text-4xl font-bold mb-4">NIP Builder</h1>
              <p className="text-muted-foreground text-lg">
                Select a product to create a Nutritional Information Panel
              </p>
            </div>
            <ProductGrid onProductSelect={handleProductSelect} />
          </div>
        ) : showTemplateSelector ? (
          <div>
            <div className="mb-6">
              <Button
                variant="outline"
                onClick={handleBackToProducts}
                className="mb-4 bg-transparent"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Products
              </Button>
              <h1 className="text-3xl font-bold mb-2">Choose Template</h1>
              <p className="text-muted-foreground mb-4">
                Selected Product: {selectedProduct?.title} (
                {selectedProduct?.productType})
              </p>
            </div>
            <TemplateSelector onTemplateSelect={handleTemplateSelect} />
          </div>
        ) : (
          <div>
            <div className="mb-6">
              <div className="flex gap-2 mb-4">
                <Button
                  variant="outline"
                  onClick={handleBackToProducts}
                  className="bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Products
                </Button>
                <Button
                  variant="outline"
                  onClick={handleBackToTemplates}
                  className="bg-transparent"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to Templates
                </Button>
              </div>
              <h1 className="text-3xl font-bold">
                Building NIP for: {selectedProduct?.title}
              </h1>
              <p className="text-muted-foreground">
                {selectedProduct?.productType} • {selectedTemplate}
              </p>
            </div>
            <NipBuilder product={selectedProduct} template={selectedTemplate} />
          </div>
        )}
      </div>
    </div>
  );
}
