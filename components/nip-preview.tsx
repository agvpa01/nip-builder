"use client";

interface Product {
  title: string;
  productType: string;
  onlineStoreUrl: string;
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
  [key: string]: string;
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

interface NipPreviewProps {
  product: Product;
  directions: string;
  servingSize: string;
  ingredients: string;
  allergenAdvice: string;
  storage: string;
  supplementaryInfo: string;
  servingScoopInfo: string;
  nutritionalData: NutritionalData;
  aminoAcidData: AminoAcidData;
  compositionalData?: CompositionalData;
  borderThickness: number;
  region: "AU" | "US";
  nutritionalItems: NutritionalItem[];
  template?: "protein" | "supplements" | "complex";
  consumptionWarning?: string;
}

export function NipPreview({
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
  compositionalData = {},
  borderThickness,
  region,
  nutritionalItems,
  template = "protein",
  consumptionWarning = "",
}: NipPreviewProps) {
  const borderStyle = `${borderThickness}px solid black`;
  const thickBorderStyle = `${borderThickness * 5}px solid black`;

  const getBorderThickness = (
    thickness: "light" | "medium" | "large" | "xl" | "2xl" = "light"
  ) => {
    const thicknessMap = {
      light: 1,
      medium: 2,
      large: 3,
      xl: 4,
      "2xl": 5,
    };
    return `${thicknessMap[thickness]}px solid black`;
  };

  if (region === "US") {
    if (template === "supplements") {
      return (
        <div className="max-w-2xl mx-auto bg-white text-black p-8 font-sans text-sm leading-tight">
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-6">
              <div className="border-2 border-black max-w-md">
                <div className="text-center py-1 px-4 font-bold text-4xl">
                  SUPPLEMENT FACTS
                </div>
                <div className="px-4 pt-2 text-sm">
                  <div>Serving Size: 2 g (about 1/2 teaspoon)</div>
                  <div className="border-b-8 border-black">
                    Servings per Container: 100
                  </div>
                </div>
                <div className="px-4">
                  <div className="border-b-4 border-black flex justify-end text-sm font-semibold space-x-8">
                    <span className="text-right">Amount per serving</span>
                    <span className="text-right">%DV</span>
                  </div>
                </div>
                <div className="px-4">
                  <div
                    className="flex justify-between py-1"
                    style={{ borderBottom: "8px solid black" }}
                  >
                    <span className="font-semibold">
                      Gamma Aminobutyric Acid
                    </span>
                    <span>2 g</span>
                    <span>*</span>
                  </div>
                </div>
                <div className="px-4 py-2 text-xs border-black border-t-0">
                  <p>*Daily Value (DV) not established.</p>
                </div>
                <div className="bg-black text-white px-4 py-1 text-sm font-bold">
                  Other Ingredients: None
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    if (template === "complex") {
      return (
        <div className="max-w-2xl mx-auto bg-white text-black p-8 font-sans text-sm leading-tight">
          <div className="grid grid-cols-1 gap-8">
            <div className="space-y-6">
              <div className="border-2 border-black max-w-lg">
                <div className="text-center py-1 px-4 font-bold text-lg border-b-2 border-black">
                  SUPPLEMENT FACTS
                </div>
                <div className="px-4 py-2 text-sm border-b-2 border-black">
                  <div>Serving Size: 6.2g (1 scoop)</div>
                  <div>Servings per Container: 30</div>
                </div>
                <div className="px-4 py-1">
                  <div className="flex justify-end text-sm font-semibold space-x-8 border-b border-black">
                    <span className="text-right">Amount per serving</span>
                    <span className="text-right">%DV</span>
                  </div>
                </div>
                <table className="w-full border-collapse">
                  <tbody>
                    <tr>
                      <td className="px-4 py-1 font-bold border-b border-black">
                        Calories
                      </td>
                      <td className="px-4 py-1 text-right border-b border-black">
                        15
                      </td>
                      <td className="px-4 py-1 text-center border-b border-black"></td>
                    </tr>
                    <tr>
                      <td className="px-4 py-1 border-b border-black">
                        Vitamin C (from calcium ascorbate)
                      </td>
                      <td className="px-4 py-1 text-right border-b border-black">
                        35mg
                      </td>
                      <td className="px-4 py-1 text-center border-b border-black">
                        39%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-1 border-b border-black">
                        Vitamin B3 (as niacin)
                      </td>
                      <td className="px-4 py-1 text-right border-b border-black">
                        30mg
                      </td>
                      <td className="px-4 py-1 text-center border-b border-black">
                        30%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-1 border-b border-black">
                        Vitamin B6 (as pyridoxine hydrochloride)
                      </td>
                      <td className="px-4 py-1 text-right border-b border-black">
                        1mg
                      </td>
                      <td className="px-4 py-1 text-center border-b border-black">
                        60%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-1 border-b border-black">
                        Folate
                      </td>
                      <td className="px-4 py-1 text-right border-b border-black">
                        100mcg
                      </td>
                      <td className="px-4 py-1 text-center border-b border-black">
                        25%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-1 border-b border-black">
                        Vitamin B12 (as cyanocobalamin)
                      </td>
                      <td className="px-4 py-1 text-right border-b border-black">
                        5mcg
                      </td>
                      <td className="px-4 py-1 text-center border-b border-black">
                        210%
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-1 border-b border-black">
                        Arginine Alpha-ketoglutarate
                      </td>
                      <td className="px-4 py-1 text-right border-b border-black">
                        1,200mg
                      </td>
                      <td className="px-4 py-1 text-center border-b border-black">
                        **
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-1 border-b border-black">
                        Beta Alanine
                      </td>
                      <td className="px-4 py-1 text-right border-b border-black">
                        1,560mg
                      </td>
                      <td className="px-4 py-1 text-center border-b border-black">
                        **
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-1 border-b border-black">
                        Caffeine
                      </td>
                      <td className="px-4 py-1 text-right border-b border-black">
                        232mg
                      </td>
                      <td className="px-4 py-1 text-center border-b border-black">
                        **
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-1 border-b border-black">
                        Citrulline Malate
                      </td>
                      <td className="px-4 py-1 text-right border-b border-black">
                        400mg
                      </td>
                      <td className="px-4 py-1 text-center border-b border-black">
                        **
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-1 border-b border-black">
                        Creatine Monohydrate
                      </td>
                      <td className="px-4 py-1 text-right border-b border-black">
                        1,900mg
                      </td>
                      <td className="px-4 py-1 text-center border-b border-black">
                        **
                      </td>
                    </tr>
                    <tr>
                      <td className="px-4 py-1 border-b-2 border-black">
                        L-Tyrosine
                      </td>
                      <td className="px-4 py-1 text-right border-b-2 border-black">
                        97mg
                      </td>
                      <td className="px-4 py-1 text-center border-b-2 border-black">
                        **
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="px-4 py-2 text-xs">
                  <p>*Percent Daily Values are based on a 2,000 calorie diet</p>
                  <p>**Daily Value (DV) not established.</p>
                </div>
                <div className="bg-black text-white px-4 py-2 text-sm font-bold">
                  <div className="font-bold mb-1">Other Ingredients:</div>
                  <div className="text-xs font-normal">
                    Natural Flavour, Sucralose, Citric Acid, Silica Dioxide and
                    Beetroot powder.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="max-w-2xl mx-auto bg-white text-black p-8 font-sans text-sm leading-tight">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div>
              <h3 className="font-bold text-base mb-2">DIRECTIONS:</h3>
              <p>{directions}</p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">SERVING SIZE:</h3>
              <p>{servingSize}</p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">INGREDIENTS:</h3>
              <p>{ingredients}</p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">ALLERGEN ADVICE:</h3>
              <p>{allergenAdvice}</p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">STORAGE:</h3>
              <p>{storage}</p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">
                FORMULATED SUPPLEMENTARY SPORTS FOOD.
              </h3>
              <p>{supplementaryInfo}</p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">
                SERVING SCOOP INCLUDED,
              </h3>
              <p>{servingScoopInfo}</p>
            </div>
          </div>
          <div className="space-y-6">
            <div className="border-2 border-black">
              <div className="text-center py-1 px-4 font-bold text-2xl border-b-8 border-black">
                NUTRITION FACTS
              </div>
              <div className="px-4 py-2 text-sm border-b border-black">
                <div>
                  {nutritionalData.servingsPerPack} Servings per container
                </div>
                <div className="flex justify-between items-center mt-1">
                  <span className="font-bold">Serving Size</span>
                  <span className="font-bold">
                    1 scoop ({nutritionalData.servingSize})
                  </span>
                </div>
              </div>
              <div className="px-4 py-1 text-right text-sm font-bold border-b border-black">
                % Daily Value *
              </div>
              <div className="px-4">
                {nutritionalItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between py-1"
                    style={{
                      borderBottom: getBorderThickness(item.borderThickness),
                    }}
                  >
                    <span
                      className={
                        item.label.includes("Saturated")
                          ? "pl-4"
                          : item.label.includes("Trans")
                          ? "pl-4 italic"
                          : item.label.includes("Added")
                          ? "pl-8 italic"
                          : "font-bold"
                      }
                    >
                      {item.label} {nutritionalData[item.serveKey]}
                      {item.label.includes("mg") ? "mg" : "g"}
                    </span>
                    <span className={item.dailyValueKey ? "font-bold" : ""}>
                      {item.dailyValueKey
                        ? nutritionalData[item.dailyValueKey]
                        : ""}
                    </span>
                  </div>
                ))}
              </div>
              <div className="px-4 py-2 text-xs">
                <p>
                  *The % Daily Value (DV) tells you how much a nutrient in a
                  serving of food contributes to a daily diet. 2,000 calories a
                  day is used for general nutrition advice.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto bg-white   text-black p-8 font-sans text-sm leading-tight">
      <div
        className={`grid gap-8 w-full ${
          template === "protein" ? "grid-cols-1  lg:grid-cols-2" : "grid-cols-1"
        }`}
      >
        {template === "protein" && (
          <div className="space-y-4 w-full">
            <div>
              <h3 className="font-bold text-base mb-2">DIRECTIONS:</h3>
              <p>{directions}</p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">SERVING SIZE:</h3>
              <p>{servingSize}</p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">INGREDIENTS:</h3>
              <p>{ingredients}</p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">ALLERGEN ADVICE:</h3>
              <p>{allergenAdvice}</p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">STORAGE:</h3>
              <p>{storage}</p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">
                FORMULATED SUPPLEMENTARY SPORTS FOOD.
              </h3>
              <p>{supplementaryInfo}</p>
            </div>
            <div>
              <h3 className="font-bold text-base mb-2">
                SERVING SCOOP INCLUDED,
              </h3>
              <p>{servingScoopInfo}</p>
            </div>
          </div>
        )}
        <div className="w-full ">
          <div className="w-full ">
            <div className="bg-black text-white text-center py-2 px-4 font-bold tracking-widest text-sm">
              NUTRITIONAL INFORMATION
            </div>
            <table className="w-full border-collapse">
              <tbody>
                <tr style={{ borderBottom: thickBorderStyle }}>
                  <td className="py-1 px-2">
                    Serving Size: {nutritionalData.servingSize}
                  </td>
                  <td></td>
                  <td className="py-1 px-2 text-right">
                    {template === "supplements"
                      ? "Servings per Bottle"
                      : "Servings per Pack"}
                    : {nutritionalData.servingsPerPack}
                  </td>
                </tr>
                <tr style={{ borderBottom: borderStyle }}>
                  <td className="py-1 px-2"></td>
                  <td className="py-1 px-2 font-normal text-xs text-right w-32">
                    Per Serve
                  </td>
                  <td className="py-1 px-2 text-center font-normal text-xs">
                    Per 100g
                  </td>
                </tr>
                {nutritionalItems.map((item) => (
                  <tr
                    key={item.id}
                    style={{
                      borderBottom: getBorderThickness(item.borderThickness),
                    }}
                  >
                    <td
                      className={`py-1 px-2 ${
                        item.label.includes("Saturated") ||
                        item.label.includes("Sugars")
                          ? "italic pl-4"
                          : ""
                      }`}
                    >
                      {item.label}
                    </td>
                    <td className="py-1 px-2 text-center">
                      {nutritionalData[item.serveKey]}
                    </td>
                    <td className="py-1 px-2 text-center">
                      {nutritionalData[item.per100gKey]}
                    </td>
                  </tr>
                ))}
                {template === "complex" && (
                  <>
                    <tr>
                      <td
                        colSpan={3}
                        className="bg-black text-white text-center py-2 px-4 font-bold text-base"
                      >
                        COMPOSITIONAL INFORMATION
                      </td>
                    </tr>
                    {Object.entries(compositionalData).map(([key, data]) => (
                      <tr
                        key={key}
                        style={{
                          borderBottom: getBorderThickness(
                            data.borderThickness
                          ),
                        }}
                      >
                        <td className="py-1 px-2">{key}</td>
                        <td className="py-1 px-2 text-center">{data.serve}</td>
                        <td className="py-1 px-2 text-center">
                          {data.per100g}
                        </td>
                      </tr>
                    ))}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {template === "complex" && (
            <div className="space-y-4 mt-6 w-full">
              <div>
                <h3 className="font-bold text-base mb-2">INGREDIENTS:</h3>
                <p className="text-sm">{ingredients}</p>
              </div>
              {consumptionWarning && (
                <div className="border-2 border-black text-center py-2 px-4 font-bold text-xs">
                  {consumptionWarning}
                </div>
              )}
            </div>
          )}
          {template === "protein" && (
            <div className="mt-6 w-full">
              <div className="bg-black text-white text-center py-2 px-4 font-bold text-base">
                TYPICAL AMINO ACID PROFILE
              </div>
              <div
                className="text-right py-1 font-semibold"
                style={{ borderBottom: thickBorderStyle }}
              >
                Per 100g of Protein
              </div>
              <table className="w-full border-collapse">
                <tbody>
                  {Object.entries(aminoAcidData).map(([key, data]) => (
                    <tr
                      key={key}
                      style={{
                        borderBottom: getBorderThickness(data.borderThickness),
                      }}
                    >
                      <td className="py-1 px-2">{key}</td>
                      <td className="py-1 px-2 text-right">{data.value}</td>
                    </tr>
                  ))}
                  <tr
                    style={{
                      borderBottom: borderStyle,
                      borderTop: thickBorderStyle,
                    }}
                  >
                    <td className="py-1 px-2 font-semibold">
                      BCAAs* = 5,832 mg per serve
                    </td>
                    <td></td>
                  </tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
