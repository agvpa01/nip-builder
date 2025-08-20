"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { RichTextarea } from "@/components/ui/rich-textarea";
import { Label } from "@/components/ui/label";
import { NipPreview } from "@/components/nip-preview";
import { Download, Eye, Plus, Trash2, Save } from "lucide-react";

interface Product {
  title: string;
  productType: string;
  onlineStoreUrl: string;
}

interface NipBuilderProps {
  product: Product;
  template: Template; // template now comes from parent component
}

interface NutritionalData {
  servingSize: string;
  servingsPerPack: string;
  energy_kj_serve: string;
  energy_kj_100g: string;
  energy_cal_serve: string;
  energy_cal_100g: string;
  protein_serve: string;
  protein_100g: string;
  fat_serve: string;
  fat_100g: string;
  saturated_fat_serve: string;
  saturated_fat_100g: string;
  carbs_serve: string;
  carbs_100g: string;
  sugars_serve: string;
  sugars_100g: string;
  sodium_serve: string;
  sodium_100g: string;
  gaba_serve?: string;
  gaba_100g?: string;
}

interface AminoAcidData {
  [key: string]: {
    value: string;
    borderThickness: "light" | "medium" | "large" | "xl" | "2xl";
  };
}

interface CompositionalData {
  [key: string]: {
    serve: string;
    per100g: string;
    borderThickness: "light" | "medium" | "large" | "xl" | "2xl";
  };
}

interface NutritionalItem {
  id: string;
  label: string;
  serveKey: string;
  per100gKey: string;
  dailyValueKey?: string;
  borderThickness?: "light" | "medium" | "large" | "xl" | "2xl";
}

type Region = "AU" | "US";
type Template = "protein" | "supplements" | "complex";

export function NipBuilder({ product, template }: NipBuilderProps) {
  const [showPreview, setShowPreview] = useState(false);
  const [borderThickness, setBorderThickness] = useState([1]);
  const [region, setRegion] = useState<Region>("AU");

  const [directions, setDirections] = useState(
    template === "complex"
      ? "Mix 1 scoop (6.2g) with 200-300mL of water. Consume 30 minutes before training."
      : "Add 1 heaped scoop (30g) to 200mL of water or low fat milk. Stir or shake for 20 seconds, or until completely dispersed."
  );
  const [servingSize, setServingSize] = useState(
    template === "complex" ? "6.2 grams" : "30 grams"
  );
  const [ingredients, setIngredients] = useState(
    template === "complex"
      ? "Creatine Monohydrate, Beta Alanine, Arginine Alpha-ketoglutarate, Natural Flavour, Citrulline Malate, Caffeine, L-Tyrosine, Sweetener (Sucralose), Calcium Ascorbate, Citric Acid, Silica Dioxide, Pyridoxine HCl, Pteroylglutamic Acid, Cyanocobalamin, Colour."
      : "Whey Protein Isolate (Milk)(Emulsifier (Soy Lecithin)), Flavour, Xanthan, Sucralose."
  );
  const [allergenAdvice, setAllergenAdvice] = useState(
    template === "complex"
      ? "Contains Caffeine."
      : "Contains Milk and less than 1% Soy Lecithin (as instantiser)."
  );
  const [storage, setStorage] = useState(
    "To maximise freshness, keep sealed and store in a cool dry place out of direct sunlight."
  );
  const [supplementaryInfo, setSupplementaryInfo] = useState(
    "FORMULATED SUPPLEMENTARY SPORTS FOOD. This product is not to be used as a sole source of nutrition. It must be used in conjunction with a balanced diet and a suitable physical training or exercise program. Not suitable for children under 15 years of age. Not suitable for pregnant women. Should only be used under medical or dietetic supervision."
  );
  const [servingScoopInfo, setServingScoopInfo] = useState(
    "SERVING SCOOP INCLUDED, but may settle to the bottom of the bag during transit. Content sold by weight not volume, some settling may occur."
  );
  const [consumptionWarning, setConsumptionWarning] = useState(
    "CONSUME WITHIN 60 DAYS OF OPENING"
  );

  const complexNutritionalItems: NutritionalItem[] = [
    {
      id: "1",
      label: "Energy (kJ)",
      serveKey: "energy_kj_serve",
      per100gKey: "energy_kj_100g",
      borderThickness: "light",
    },
    {
      id: "2",
      label: "Energy (Cal)",
      serveKey: "energy_cal_serve",
      per100gKey: "energy_cal_100g",
      borderThickness: "light",
    },
    {
      id: "3",
      label: "Protein (g)",
      serveKey: "protein_serve",
      per100gKey: "protein_100g",
      borderThickness: "light",
    },
    {
      id: "4",
      label: "Total Fat (g)",
      serveKey: "fat_serve",
      per100gKey: "fat_100g",
      borderThickness: "light",
    },
    {
      id: "5",
      label: "Saturated Fat (g)",
      serveKey: "saturated_fat_serve",
      per100gKey: "saturated_fat_100g",
      borderThickness: "light",
    },
    {
      id: "6",
      label: "Total Carbohydrate (g)",
      serveKey: "carbs_serve",
      per100gKey: "carbs_100g",
      borderThickness: "light",
    },
    {
      id: "7",
      label: "Sugars (g)",
      serveKey: "sugars_serve",
      per100gKey: "sugars_100g",
      borderThickness: "light",
    },
    {
      id: "8",
      label: "Sodium (mg)",
      serveKey: "sodium_serve",
      per100gKey: "sodium_100g",
      borderThickness: "light",
    },
    {
      id: "9",
      label: "Vitamin B6 (mg)",
      serveKey: "vitamin_b6_serve",
      per100gKey: "vitamin_b6_100g",
      borderThickness: "light",
    },
    {
      id: "10",
      label: "Folate (μg)",
      serveKey: "folate_serve",
      per100gKey: "folate_100g",
      borderThickness: "light",
    },
    {
      id: "11",
      label: "Vitamin B12 (μg)",
      serveKey: "vitamin_b12_serve",
      per100gKey: "vitamin_b12_100g",
      borderThickness: "light",
    },
    {
      id: "12",
      label: "Vitamin C (mg)",
      serveKey: "vitamin_c_serve",
      per100gKey: "vitamin_c_100g",
      borderThickness: "light",
    },
  ];

  const proteinNutritionalItems: NutritionalItem[] = [
    {
      id: "1",
      label: "Energy (kJ)",
      serveKey: "energy_kj_serve",
      per100gKey: "energy_kj_100g",
      borderThickness: "light",
    },
    {
      id: "2",
      label: "Energy (Cal)",
      serveKey: "energy_cal_serve",
      per100gKey: "energy_cal_100g",
      borderThickness: "light",
    },
    {
      id: "3",
      label: "Protein (g)",
      serveKey: "protein_serve",
      per100gKey: "protein_100g",
      dailyValueKey: "protein_dv",
      borderThickness: "light",
    },
    {
      id: "4",
      label: "Total Fat (g)",
      serveKey: "fat_serve",
      per100gKey: "fat_100g",
      dailyValueKey: "fat_dv",
      borderThickness: "light",
    },
    {
      id: "5",
      label: "Saturated Fat (g)",
      serveKey: "saturated_fat_serve",
      per100gKey: "saturated_fat_100g",
      dailyValueKey: "saturated_fat_dv",
      borderThickness: "light",
    },
    {
      id: "6",
      label: "Total Carbohydrate (g)",
      serveKey: "carbs_serve",
      per100gKey: "carbs_100g",
      dailyValueKey: "carbs_dv",
      borderThickness: "medium",
    },
    {
      id: "7",
      label: "Sugars (g)",
      serveKey: "sugars_serve",
      per100gKey: "sugars_100g",
      borderThickness: "light",
    },
    {
      id: "8",
      label: "Sodium (mg)",
      serveKey: "sodium_serve",
      per100gKey: "sodium_100g",
      dailyValueKey: "sodium_dv",
      borderThickness: "light",
    },
  ];

  const supplementsNutritionalItems: NutritionalItem[] = [
    {
      id: "1",
      label: "Energy (kJ)",
      serveKey: "energy_kj_serve",
      per100gKey: "energy_kj_100g",
      borderThickness: "light",
    },
    {
      id: "2",
      label: "Energy (Cal)",
      serveKey: "energy_cal_serve",
      per100gKey: "energy_cal_100g",
      borderThickness: "light",
    },
    {
      id: "3",
      label: "Protein (g)",
      serveKey: "protein_serve",
      per100gKey: "protein_100g",
      borderThickness: "light",
    },
    {
      id: "4",
      label: "Total Fat (g)",
      serveKey: "fat_serve",
      per100gKey: "fat_100g",
      borderThickness: "light",
    },
    {
      id: "5",
      label: "Saturated Fat (g)",
      serveKey: "saturated_fat_serve",
      per100gKey: "saturated_fat_100g",
      borderThickness: "light",
    },
    {
      id: "6",
      label: "Total Carbohydrate (g)",
      serveKey: "carbs_serve",
      per100gKey: "carbs_100g",
      borderThickness: "light",
    },
    {
      id: "7",
      label: "Sugars (g)",
      serveKey: "sugars_serve",
      per100gKey: "sugars_100g",
      borderThickness: "light",
    },
    {
      id: "8",
      label: "Sodium (mg)",
      serveKey: "sodium_serve",
      per100gKey: "sodium_100g",
      borderThickness: "light",
    },
    {
      id: "9",
      label: "GABA (mg)",
      serveKey: "gaba_serve",
      per100gKey: "gaba_100g",
      borderThickness: "light",
    },
  ];

  const [nutritionalItems, setNutritionalItems] = useState<NutritionalItem[]>(
    template === "protein"
      ? proteinNutritionalItems
      : template === "supplements"
      ? supplementsNutritionalItems
      : complexNutritionalItems
  );

  const [nutritionalData, setNutritionalData] = useState<
    NutritionalData & { [key: string]: string }
  >({
    servingSize:
      template === "protein"
        ? "30g"
        : template === "supplements"
        ? "2g"
        : "6.2g",
    servingsPerPack:
      template === "protein" ? "33" : template === "supplements" ? "100" : "30",
    energy_kj_serve:
      template === "protein" ? "480" : template === "supplements" ? "0" : "56",
    energy_kj_100g:
      template === "protein"
        ? "1,600"
        : template === "supplements"
        ? "0"
        : "905",
    energy_cal_serve:
      template === "protein" ? "115" : template === "supplements" ? "0" : "13",
    energy_cal_100g:
      template === "protein" ? "382" : template === "supplements" ? "0" : "215",
    protein_serve:
      template === "protein"
        ? "26.4"
        : template === "supplements"
        ? "0"
        : "2.7",
    protein_100g:
      template === "protein" ? "88.0" : template === "supplements" ? "0" : "43",
    protein_dv: "53%",
    fat_serve:
      template === "protein" ? "0.2" : template === "supplements" ? "0" : "0",
    fat_100g:
      template === "protein" ? "0.7" : template === "supplements" ? "0" : "0.1",
    fat_dv: "0%",
    saturated_fat_serve:
      template === "protein" ? "0.1" : template === "supplements" ? "0" : "0",
    saturated_fat_100g:
      template === "protein" ? "0.2" : template === "supplements" ? "0" : "0.1",
    saturated_fat_dv: "0%",
    carbs_serve:
      template === "protein" ? "1.5" : template === "supplements" ? "0" : "0.7",
    carbs_100g:
      template === "protein"
        ? "4.9"
        : template === "supplements"
        ? "0"
        : "10.6",
    carbs_dv: "1%",
    sugars_serve:
      template === "protein" ? "0.8" : template === "supplements" ? "0" : "0.6",
    sugars_100g:
      template === "protein" ? "2.5" : template === "supplements" ? "0" : "9.2",
    sodium_serve:
      template === "protein" ? "43" : template === "supplements" ? "0" : "0.3",
    sodium_100g:
      template === "protein" ? "145" : template === "supplements" ? "0" : "4.9",
    sodium_dv: "3%",
    gaba_serve: "2,000",
    gaba_100g: "100,000",
    vitamin_b6_serve: "1.0",
    vitamin_b6_100g: "16.1",
    folate_serve: "100",
    folate_100g: "1,610",
    vitamin_b12_serve: "5.0",
    vitamin_b12_100g: "80.7",
    vitamin_c_serve: "39.0",
    vitamin_c_100g: "629",
    cholesterol_serve: "0",
    cholesterol_dv: "0%",
    dietary_fiber_serve: "0",
    dietary_fiber_dv: "0%",
    total_sugars_serve: "1",
    added_sugars_serve: "0",
    vitamin_d_serve: "0",
    vitamin_d_dv: "0%",
    calcium_serve: "130",
    calcium_dv: "10%",
    iron_serve: "0",
    iron_dv: "0%",
    potassium_serve: "120",
    potassium_dv: "2%",
  });

  const [compositionalData, setCompositionalData] = useState<CompositionalData>(
    {
      "AAKG (g)": { serve: "1.7", per100g: "19.1", borderThickness: "light" },
      "Beta Alanine (mg)": {
        serve: "1,560",
        per100g: "25,100",
        borderThickness: "light",
      },
      "Arginine (mg)": {
        serve: "232",
        per100g: "3,740",
        borderThickness: "light",
      },
      "Citrulline Malate (g)": {
        serve: "0.4",
        per100g: "7.3",
        borderThickness: "light",
      },
      "Creatine Monohydrate (g)": {
        serve: "1.9",
        per100g: "30.3",
        borderThickness: "light",
      },
      "L-Tyrosine (mg)": {
        serve: "97",
        per100g: "1,560",
        borderThickness: "light",
      },
    }
  );

  const [aminoAcidData, setAminoAcidData] = useState<AminoAcidData>({
    "Alanine (mg)": { value: "5,010", borderThickness: "light" },
    "Arginine (mg)": { value: "2,160", borderThickness: "light" },
    "Aspartic acid (mg)": { value: "10,500", borderThickness: "light" },
    "Cysteine (mg)": { value: "2,430", borderThickness: "light" },
    "Glutamic acid (mg)": { value: "17,000", borderThickness: "light" },
    "Glycine (mg)": { value: "1,620", borderThickness: "light" },
    "Histidine (mg)": { value: "1,550", borderThickness: "light" },
    "Isoleucine (mg)*": { value: "6,340", borderThickness: "light" },
    "Leucine (mg)*": { value: "10,300", borderThickness: "light" },
    "Lysine (mg)": { value: "10,000", borderThickness: "light" },
    "Methionine (mg)": { value: "2,150", borderThickness: "light" },
    "Phenylalanine (mg)": { value: "2,980", borderThickness: "light" },
    "Proline (mg)": { value: "6,050", borderThickness: "light" },
    "Serine (mg)": { value: "4,590", borderThickness: "light" },
    "Threonine (mg)": { value: "6,710", borderThickness: "light" },
    "Tryptophan (mg)": { value: "2,300", borderThickness: "light" },
    "Tyrosine (mg)": { value: "2,840", borderThickness: "light" },
    "Valine (mg)*": { value: "5,450", borderThickness: "large" },
  });

  const updateNutritionalData = (field: string, value: string) => {
    setNutritionalData((prev) => ({ ...prev, [field]: value }));
  };

  const updateAminoAcidData = (field: string, value: string) => {
    setAminoAcidData((prev) => ({
      ...prev,
      [field]: { ...prev[field], value },
    }));
  };

  const updateAminoAcidBorderThickness = (
    field: string,
    thickness: "light" | "medium" | "large" | "xl" | "2xl"
  ) => {
    setAminoAcidData((prev) => ({
      ...prev,
      [field]: { ...prev[field], borderThickness: thickness },
    }));
  };

  const updateCompositionalData = (
    field: string,
    type: "serve" | "per100g",
    value: string
  ) => {
    setCompositionalData((prev) => ({
      ...prev,
      [field]: { ...prev[field], [type]: value },
    }));
  };

  const updateCompositionalBorderThickness = (
    field: string,
    thickness: "light" | "medium" | "large" | "xl" | "2xl"
  ) => {
    setCompositionalData((prev) => ({
      ...prev,
      [field]: { ...prev[field], borderThickness: thickness },
    }));
  };

  const addCompositionalItem = () => {
    const newKey = `New Ingredient ${
      Object.keys(compositionalData).length + 1
    }`;
    setCompositionalData((prev) => ({
      ...prev,
      [newKey]: { serve: "0", per100g: "0", borderThickness: "light" },
    }));
  };

  const removeCompositionalItem = (key: string) => {
    setCompositionalData((prev) => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  const addNutritionalItem = () => {
    const newId = Date.now().toString();
    const newServeKey = `custom_serve_${newId}`;
    const newPer100gKey = `custom_100g_${newId}`;
    const newDailyValueKey = `custom_dv_${newId}`;

    const newItem: NutritionalItem = {
      id: newId,
      label: "New Nutrient",
      serveKey: newServeKey,
      per100gKey: newPer100gKey,
      dailyValueKey: newDailyValueKey,
      borderThickness: "light",
    };

    setNutritionalItems((prev) => [...prev, newItem]);
    setNutritionalData((prev) => ({
      ...prev,
      [newServeKey]: "0",
      [newPer100gKey]: "0",
      [newDailyValueKey]: "0%",
    }));
  };

  const removeNutritionalItem = (id: string) => {
    const itemToRemove = nutritionalItems.find((item) => item.id === id);
    if (itemToRemove) {
      setNutritionalItems((prev) => prev.filter((item) => item.id !== id));
      setNutritionalData((prev) => {
        const newData = { ...prev };
        delete newData[itemToRemove.serveKey];
        delete newData[itemToRemove.per100gKey];
        if (itemToRemove.dailyValueKey) {
          delete newData[itemToRemove.dailyValueKey];
        }
        return newData;
      });
    }
  };

  const updateNutritionalItemLabel = (id: string, newLabel: string) => {
    setNutritionalItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, label: newLabel } : item))
    );
  };

  const updateNutritionalItemBorderThickness = (
    id: string,
    thickness: "light" | "medium" | "large" | "xl" | "2xl"
  ) => {
    setNutritionalItems((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, borderThickness: thickness } : item
      )
    );
  };

  const addAminoAcid = () => {
    const newKey = `New Amino Acid ${Object.keys(aminoAcidData).length + 1}`;
    setAminoAcidData((prev) => ({
      ...prev,
      [newKey]: { value: "0", borderThickness: "light" },
    }));
  };

  const removeAminoAcid = (key: string) => {
    setAminoAcidData((prev) => {
      const newData = { ...prev };
      delete newData[key];
      return newData;
    });
  };

  const handleSaveHTML = async () => {
    try {
      // Extract filename from onlineStoreUrl
      const filename = product.onlineStoreUrl
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase();

      // Check if HTML file already exists
      const checkResponse = await fetch("/api/check-html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ products: [product] }),
      });

      if (checkResponse.ok) {
        const checkData = await checkResponse.json();
        if (checkData.success && checkData.products[0]?.htmlStatus?.hasAny) {
          const existingRegions = [];
          if (checkData.products[0].htmlStatus.hasAU)
            existingRegions.push("AU");
          if (checkData.products[0].htmlStatus.hasUS)
            existingRegions.push("US");

          const confirmOverwrite = confirm(
            `An HTML file already exists for this product in the following region(s): ${existingRegions.join(
              ", "
            )}. Do you want to overwrite it?`
          );

          if (!confirmOverwrite) {
            return; // User cancelled, don't save
          }
        }
      }

      // Generate the HTML content by rendering the NipPreview component
      const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${product.title} - Nutritional Information</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&display=swap" rel="stylesheet">
  <style>
    body { font-family: 'Roboto', sans-serif; }
  </style>
</head>
<body>
  <div id="nip-content">
    <!-- The NIP content will be rendered here -->
  </div>
</body>
</html>`;

      const response = await fetch("/api/save-html", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
          htmlContent,
          productData: {
            product,
            directions,
            servingSize,
            ingredients,
            allergenAdvice,
            storage,
            supplementaryInfo,
            servingScoopInfo,
            nutritionalData,
            aminoAcidData,
            compositionalData,
            region,
            template,
          },
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`HTML saved successfully! Access it at: ${result.accessUrl}`);
      } else {
        alert("Failed to save HTML");
      }
    } catch (error) {
      console.error("Error saving HTML:", error);
      alert("Error saving HTML");
    }
  };

  const handleSaveTemplate = async () => {
    try {
      // Extract filename from onlineStoreUrl
      const filename = product.onlineStoreUrl
        .replace(/[^a-zA-Z0-9]/g, "-")
        .toLowerCase();

      // Prepare template data
      const templateData = {
        product,
        template,
        region,
        directions,
        servingSize,
        ingredients,
        allergenAdvice,
        storage,
        supplementaryInfo,
        servingScoopInfo,
        consumptionWarning,
        nutritionalData,
        aminoAcidData,
        compositionalData,
        borderThickness,
        savedAt: new Date().toISOString(),
      };

      const response = await fetch("/api/save-template", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          filename,
          templateData,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        alert(`Template saved successfully! File: ${result.filename}`);
      } else {
        alert("Failed to save template");
      }
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Error saving template");
    }
  };

  if (showPreview) {
    return (
      <div className="w-full">
        <div className="mb-6 flex gap-4 justify-end w-full">
          <Button onClick={() => setShowPreview(false)} variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            Back to Editor
          </Button>
          <Button onClick={handleSaveTemplate} variant="secondary">
            <Save className="w-4 h-4 mr-2" />
            Save Template
          </Button>
          <Button onClick={handleSaveHTML}>
            <Download className="w-4 h-4 mr-2" />
            Save HTML
          </Button>
        </div>
        <NipPreview
          product={product}
          directions={directions}
          servingSize={servingSize}
          ingredients={ingredients}
          allergenAdvice={allergenAdvice}
          storage={storage}
          supplementaryInfo={supplementaryInfo}
          servingScoopInfo={servingScoopInfo}
          nutritionalData={nutritionalData}
          aminoAcidData={aminoAcidData}
          compositionalData={compositionalData}
          borderThickness={borderThickness[0]}
          region={region}
          nutritionalItems={nutritionalItems}
          template={template}
          consumptionWarning={consumptionWarning}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-4 mb-6 flex-wrap">
        <Button onClick={() => setShowPreview(true)}>
          <Eye className="w-4 h-4 mr-2" />
          Preview NIP
        </Button>
        <Button onClick={handleSaveTemplate} variant="secondary">
          <Save className="w-4 h-4 mr-2" />
          Save Template
        </Button>

        <div className="flex gap-2">
          <Button
            variant={region === "AU" ? "default" : "outline"}
            onClick={() => setRegion("AU")}
            size="sm"
          >
            AU/NZ Format
          </Button>
          <Button
            variant={region === "US" ? "default" : "outline"}
            onClick={() => setRegion("US")}
            size="sm"
          >
            US Format
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Text Sections */}
        <Card>
          <CardHeader>
            <CardTitle>Text Sections</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="directions">Directions</Label>
              <RichTextarea
                id="directions"
                value={directions}
                onChange={setDirections}
                rows={3}
                placeholder="Enter directions with formatting..."
              />
            </div>

            <div>
              <Label htmlFor="serving-size">Serving Size</Label>
              <Input
                id="serving-size"
                value={servingSize}
                onChange={(e) => setServingSize(e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="ingredients">Ingredients</Label>
              <RichTextarea
                id="ingredients"
                value={ingredients}
                onChange={setIngredients}
                rows={3}
                placeholder="Enter ingredients with formatting..."
              />
            </div>

            <div>
              <Label htmlFor="allergen">Allergen Advice</Label>
              <RichTextarea
                id="allergen"
                value={allergenAdvice}
                onChange={setAllergenAdvice}
                rows={2}
                placeholder="Enter allergen advice with formatting..."
              />
            </div>

            <div>
              <Label htmlFor="storage">Storage</Label>
              <RichTextarea
                id="storage"
                value={storage}
                onChange={setStorage}
                rows={3}
                placeholder="Enter storage instructions with formatting..."
              />
            </div>

            <div>
              <Label htmlFor="supplementary">Supplementary Info</Label>
              <RichTextarea
                id="supplementary"
                value={supplementaryInfo}
                onChange={setSupplementaryInfo}
                rows={4}
                placeholder="Enter supplementary information with formatting..."
              />
            </div>

            <div>
              <Label htmlFor="serving-scoop">Serving Scoop Info</Label>
              <RichTextarea
                id="serving-scoop"
                value={servingScoopInfo}
                onChange={setServingScoopInfo}
                rows={3}
                placeholder="Enter serving scoop information with formatting..."
              />
            </div>

            {template === "complex" && (
              <div>
                <Label htmlFor="consumption-warning">Consumption Warning</Label>
                <Input
                  id="consumption-warning"
                  value={consumptionWarning}
                  onChange={(e) => setConsumptionWarning(e.target.value)}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Nutritional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Nutritional Information
              <Button onClick={addNutritionalItem} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Row
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Serving Size</Label>
                <Input
                  value={nutritionalData.servingSize}
                  onChange={(e) =>
                    updateNutritionalData("servingSize", e.target.value)
                  }
                />
              </div>
              <div>
                <Label>
                  {template === "supplements"
                    ? "Servings per Bottle"
                    : "Servings per Pack"}
                </Label>
                <Input
                  value={nutritionalData.servingsPerPack}
                  onChange={(e) =>
                    updateNutritionalData("servingsPerPack", e.target.value)
                  }
                />
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="font-semibold">
                {region === "AU"
                  ? "Per Serve / Per 100g"
                  : "Per Serve / Daily Value"}
              </h4>

              {nutritionalItems.map((item) => (
                <div
                  key={item.id}
                  className="grid grid-cols-6 gap-2 items-center"
                >
                  <Input
                    placeholder="Nutrient name"
                    value={item.label}
                    onChange={(e) =>
                      updateNutritionalItemLabel(item.id, e.target.value)
                    }
                    className="text-sm"
                  />
                  <Input
                    placeholder="Per Serve"
                    value={nutritionalData[item.serveKey] || ""}
                    onChange={(e) =>
                      updateNutritionalData(item.serveKey, e.target.value)
                    }
                  />
                  <Input
                    placeholder={region === "AU" ? "Per 100g" : "Daily Value"}
                    value={
                      nutritionalData[
                        region === "AU"
                          ? item.per100gKey
                          : item.dailyValueKey || item.per100gKey
                      ] || ""
                    }
                    onChange={(e) =>
                      updateNutritionalData(
                        region === "AU"
                          ? item.per100gKey
                          : item.dailyValueKey || item.per100gKey,
                        e.target.value
                      )
                    }
                  />
                  <select
                    value={item.borderThickness || "light"}
                    onChange={(e) =>
                      updateNutritionalItemBorderThickness(
                        item.id,
                        e.target.value as any
                      )
                    }
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xl">XL</option>
                    <option value="2xl">2XL</option>
                  </select>
                  <Button
                    onClick={() => removeNutritionalItem(item.id)}
                    variant="destructive"
                    size="sm"
                    className="px-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {template === "complex" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Compositional Information
              <Button onClick={addCompositionalItem} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Ingredient
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {Object.entries(compositionalData).map(([key, data]) => (
                <div key={key} className="grid grid-cols-6 gap-2 items-center">
                  <Input
                    placeholder="Ingredient name"
                    value={key}
                    onChange={(e) => {
                      const newData = { ...compositionalData };
                      delete newData[key];
                      newData[e.target.value] = data;
                      setCompositionalData(newData);
                    }}
                    className="text-sm"
                  />
                  <Input
                    placeholder="Per Serve"
                    value={data.serve}
                    onChange={(e) =>
                      updateCompositionalData(key, "serve", e.target.value)
                    }
                  />
                  <Input
                    placeholder="Per 100g"
                    value={data.per100g}
                    onChange={(e) =>
                      updateCompositionalData(key, "per100g", e.target.value)
                    }
                  />
                  <select
                    value={data.borderThickness}
                    onChange={(e) =>
                      updateCompositionalBorderThickness(
                        key,
                        e.target.value as any
                      )
                    }
                    className="px-2 py-1 border rounded text-sm"
                  >
                    <option value="light">Light</option>
                    <option value="medium">Medium</option>
                    <option value="large">Large</option>
                    <option value="xl">XL</option>
                    <option value="2xl">2XL</option>
                  </select>
                  <Button
                    onClick={() => removeCompositionalItem(key)}
                    variant="destructive"
                    size="sm"
                    className="px-2"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {region === "AU" && template === "protein" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex justify-between items-center">
              Amino Acid Profile
              <Button onClick={addAminoAcid} size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Add Amino Acid
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(aminoAcidData).map(([key, data]) => (
                <div key={key} className="space-y-2">
                  <div className="flex gap-2 items-center">
                    <Input
                      placeholder="Amino Acid Name"
                      value={key}
                      onChange={(e) => {
                        const newData = { ...aminoAcidData };
                        delete newData[key];
                        newData[e.target.value] = data;
                        setAminoAcidData(newData);
                      }}
                      className="flex-1"
                    />
                    <Input
                      placeholder="Value"
                      value={data.value}
                      onChange={(e) => updateAminoAcidData(key, e.target.value)}
                      className="w-24"
                    />
                    <Button
                      onClick={() => removeAminoAcid(key)}
                      variant="destructive"
                      size="sm"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <select
                    value={data.borderThickness}
                    onChange={(e) =>
                      updateAminoAcidBorderThickness(key, e.target.value as any)
                    }
                    className="w-full px-2 py-1 border rounded text-sm"
                  >
                    <option value="light">Light Border</option>
                    <option value="medium">Medium Border</option>
                    <option value="large">Large Border</option>
                    <option value="xl">XL Border</option>
                    <option value="2xl">2XL Border</option>
                  </select>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
