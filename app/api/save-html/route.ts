import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const { filename, htmlContent, productData } = await request.json();

    if (!filename || !productData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the storage directory based on region
    const region = productData.region || "AU";
    const storageDir = join(
      process.cwd(),
      "storage",
      "html",
      region.toLowerCase()
    );
    if (!existsSync(storageDir)) {
      await mkdir(storageDir, { recursive: true });
    }

    // Generate complete HTML with the actual NIP content
    const completeHtml = generateCompleteHTML(productData, htmlContent);

    // Save the HTML file
    const filePath = join(storageDir, `${filename}.html`);
    await writeFile(filePath, completeHtml, "utf8");

    return NextResponse.json({
      success: true,
      filename: `${filename}.html`,
      region: region,
      accessUrl: `/api/html/${region.toLowerCase()}/${filename}`,
    });
  } catch (error) {
    console.error("Error saving HTML:", error);
    return NextResponse.json({ error: "Failed to save HTML" }, { status: 500 });
  }
}

function generateCompleteHTML(productData: any, baseHtml: string): string {
  const {
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
  } = productData;

  // Generate the NIP content HTML based on the template and region
  let nipContent = "";

  if (region === "US") {
    if (template === "supplements") {
      nipContent = generateUSSupplementsHTML(productData);
    } else if (template === "protein") {
      nipContent = generateUSProteinHTML(productData);
    } else if (template === "complex") {
      nipContent = generateUSComplexHTML(productData);
    } else {
      nipContent = generateUSDefaultHTML(productData);
    }
  } else if (region === "AU") {
    if (template === "protein") {
      nipContent = generateAUProteinHTML(productData);
    } else if (template === "supplements") {
      nipContent = generateAUSupplementsHTML(productData);
    } else if (template === "complex") {
      nipContent = generateAUComplexHTML(productData);
    } else {
      nipContent = generateAUDefaultHTML(productData);
    }
  } else {
    nipContent = generateDefaultHTML(productData);
  }

  // Replace the placeholder content in the base HTML
  return baseHtml.replace(
    "<!-- The NIP content will be rendered here -->",
    nipContent
  );
}

function generateUSSupplementsHTML(productData: any): string {
  const {
    product,
    directions,
    servingSize,
    ingredients,
    allergenAdvice,
    storage,
    supplementaryInfo,
    servingScoopInfo,
    nutritionalData,
  } = productData;

  return `
    <div class="max-w-2xl mx-auto bg-white text-black p-8 font-sans text-sm leading-tight">
      <div class="border-2 border-black p-4 mb-4">
        <h2 class="text-lg font-bold mb-2">Supplement Facts</h2>
        <div class="border-b border-black pb-1 mb-2">
          <span class="font-bold">Serving Size:</span> ${servingSize}
        </div>
        
        <table class="w-full">
          <tbody>
            <tr class="border-b border-black">
              <td class="font-bold py-1">Amount Per Serving</td>
              <td class="text-right font-bold">% Daily Value</td>
            </tr>
            <tr class="border-b border-gray-400">
              <td class="py-1">Energy</td>
              <td class="text-right">${
                nutritionalData.energy_cal_serve || "0"
              } cal</td>
            </tr>
            <tr class="border-b border-gray-400">
              <td class="py-1">Protein</td>
              <td class="text-right">${
                nutritionalData.protein_serve || "0"
              }g</td>
            </tr>
            <tr class="border-b border-gray-400">
              <td class="py-1">Total Fat</td>
              <td class="text-right">${nutritionalData.fat_serve || "0"}g</td>
            </tr>
            <tr class="border-b border-gray-400">
              <td class="py-1">Total Carbohydrate</td>
              <td class="text-right">${nutritionalData.carbs_serve || "0"}g</td>
            </tr>
            <tr class="border-b border-gray-400">
              <td class="py-1">Sugars</td>
              <td class="text-right">${
                nutritionalData.sugars_serve || "0"
              }g</td>
            </tr>
            <tr>
              <td class="py-1">Sodium</td>
              <td class="text-right">${
                nutritionalData.sodium_serve || "0"
              }mg</td>
            </tr>
          </tbody>
        </table>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Directions:</h3>
        <div>${directions}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Ingredients:</h3>
        <div>${ingredients}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Allergen Advice:</h3>
        <div>${allergenAdvice}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Storage:</h3>
        <div>${storage}</div>
      </div>
      
      <div class="mb-4">
        <div class="text-xs">${supplementaryInfo}</div>
      </div>
      
      <div>
        <div class="text-xs font-bold">${servingScoopInfo}</div>
      </div>
    </div>
  `;
}

function generateAUComplexHTML(productData: any): string {
  const {
    product,
    directions,
    servingSize,
    ingredients,
    allergenAdvice,
    storage,
    supplementaryInfo,
    servingScoopInfo,
    nutritionalData,
    compositionalData,
    consumptionWarning,
    nutritionalItems,
    template,
  } = productData;

  const getBorderThickness = (thickness: string = "light") => {
    const thicknessMap: { [key: string]: string } = {
      light: "1px solid black",
      medium: "2px solid black",
      large: "3px solid black",
      xl: "4px solid black",
      "2xl": "5px solid black",
    };
    return thicknessMap[thickness] || "1px solid black";
  };

  const thickBorderStyle = "5px solid black";

  return `
    <div class="max-w-2xl mx-auto bg-white text-black p-8 font-sans text-sm leading-tight">
      <div class="grid gap-8 w-full grid-cols-1">
        <div class="w-full">
          <div class="w-full">
            <div class="bg-black text-white text-center py-2 px-4 font-bold tracking-widest text-sm">
              NUTRITIONAL INFORMATION
            </div>
            <table class="w-full border-collapse">
              <tbody>
                <tr style="border-bottom: ${thickBorderStyle}">
                  <td class="py-1 px-2">
                    Serving Size: ${servingSize}
                  </td>
                  <td></td>
                  <td class="py-1 px-2 text-right">
                    Servings per Bottle: ${nutritionalData.servingsPerPack}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid black">
                  <td class="py-1 px-2"></td>
                  <td class="py-1 px-2 font-normal text-xs text-right w-32">
                    Per Serve
                  </td>
                  <td class="py-1 px-2 text-center font-normal text-xs">
                    Per 100g
                  </td>
                </tr>
                ${
                  nutritionalItems
                    ? nutritionalItems
                        .map(
                          (item: any) => `
                  <tr style="border-bottom: ${getBorderThickness(
                    item.borderThickness
                  )}">
                    <td class="py-1 px-2 ${
                      item.label.includes("Saturated") ||
                      item.label.includes("Sugars")
                        ? "italic pl-4"
                        : ""
                    }">
                      ${item.label}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.serveKey] || "0"}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.per100gKey] || "0"}
                    </td>
                  </tr>
                `
                        )
                        .join("")
                    : ""
                }
                ${
                  compositionalData
                    ? `
                  <tr>
                    <td colspan="3" class="bg-black text-white text-center py-2 px-4 font-bold text-base">
                      COMPOSITIONAL INFORMATION
                    </td>
                  </tr>
                  ${Object.entries(compositionalData)
                    .map(
                      ([key, data]: [string, any]) => `
                    <tr style="border-bottom: ${getBorderThickness(
                      data.borderThickness
                    )}">
                      <td class="py-1 px-2">${key}</td>
                      <td class="py-1 px-2 text-center">${data.serve}</td>
                      <td class="py-1 px-2 text-center">${data.per100g}</td>
                    </tr>
                  `
                    )
                    .join("")}
                `
                    : ""
                }
              </tbody>
            </table>
          </div>
          <div class="space-y-4 mt-6 w-full">
            <div>
              <h3 class="font-bold text-base mb-2">INGREDIENTS:</h3>
              <div class="text-sm">${ingredients}</div>
            </div>
            ${
              consumptionWarning
                ? `<div class="border-2 border-black text-center py-2 px-4 font-bold text-xs">
              ${consumptionWarning}
            </div>`
                : ""
            }
          </div>
        </div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Directions:</h3>
        <div>${directions}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Ingredients:</h3>
        <div>${ingredients}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Allergen Advice:</h3>
        <div>${allergenAdvice}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Storage:</h3>
        <div>${storage}</div>
      </div>
      
      <div class="mb-4">
        <div class="text-xs">${supplementaryInfo}</div>
      </div>
      
      <div>
        <div class="text-xs font-bold">${servingScoopInfo}</div>
      </div>
    </div>
  `;
}

function generateUSProteinHTML(productData: any): string {
  const {
    product,
    directions,
    servingSize,
    ingredients,
    allergenAdvice,
    storage,
    supplementaryInfo,
    servingScoopInfo,
    nutritionalData,
    nutritionalItems,
    aminoAcidData,
    template,
  } = productData;

  const getBorderThickness = (thickness: string = "light") => {
    const thicknessMap: { [key: string]: string } = {
      light: "1px solid black",
      medium: "2px solid black",
      large: "3px solid black",
      xl: "4px solid black",
      "2xl": "5px solid black",
    };
    return thicknessMap[thickness] || "1px solid black";
  };

  const thickBorderStyle = "5px solid black";

  return `
    <div class="max-w-2xl mx-auto bg-white text-black p-8 font-sans text-sm leading-tight">
      <div class="grid gap-8 w-full grid-cols-1">
        <div class="w-full">
          <div class="w-full">
            <div class="bg-black text-white text-center py-2 px-4 font-bold tracking-widest text-sm">
              NUTRITION FACTS
            </div>
            <table class="w-full border-collapse">
              <tbody>
                <tr style="border-bottom: ${thickBorderStyle}">
                  <td class="py-1 px-2">
                    Serving Size: ${servingSize}
                  </td>
                  <td></td>
                  <td class="py-1 px-2 text-right">
                    Servings per Container: ${nutritionalData.servingsPerPack}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid black">
                  <td class="py-1 px-2"></td>
                  <td class="py-1 px-2 font-normal text-xs text-right w-32">
                    Amount Per Serving
                  </td>
                  <td class="py-1 px-2 text-center font-normal text-xs">
                    % Daily Value*
                  </td>
                </tr>
                ${
                  nutritionalItems
                    ? nutritionalItems
                        .map(
                          (item: any) => `
                  <tr style="border-bottom: ${getBorderThickness(
                    item.borderThickness
                  )}">
                    <td class="py-1 px-2 ${
                      item.label.includes("Saturated") ||
                      item.label.includes("Sugars") ||
                      item.label.includes("Added") ||
                      item.label.includes("Dietary")
                        ? "italic pl-4"
                        : ""
                    }">
                      ${item.label}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.serveKey] || "0"}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.dailyValueKey] || "*"}
                    </td>
                  </tr>
                `
                        )
                        .join("")
                    : ""
                }
              </tbody>
            </table>
            <div class="text-xs mt-2 px-2">
              * Daily Value not established.
            </div>
          </div>
        </div>
        ${
          template === "protein" &&
          aminoAcidData &&
          Object.keys(aminoAcidData).length > 0
            ? `
          <div class="w-full">
            <div class="bg-black text-white text-center py-2 px-4 font-bold tracking-widest text-sm">
              TYPICAL AMINO ACID PROFILE
            </div>
            <table class="w-full border-collapse">
              <tbody>
                <tr style="border-bottom: 1px solid black">
                  <td class="py-1 px-2"></td>
                  <td class="py-1 px-2 font-normal text-xs text-center">
                    Per Serve
                  </td>
                </tr>
                ${Object.entries(aminoAcidData)
                  .map(
                    ([key, data]: [string, any]) => `
                  <tr style="border-bottom: ${getBorderThickness(
                    data.borderThickness
                  )}">
                    <td class="py-1 px-2">
                      ${key}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${data.value}
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `
            : ""
        }
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Directions:</h3>
        <div>${directions}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Ingredients:</h3>
        <div>${ingredients}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Allergen Advice:</h3>
        <div>${allergenAdvice}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Storage:</h3>
        <div>${storage}</div>
      </div>
      
      <div class="mb-4">
        <div class="text-xs">${supplementaryInfo}</div>
      </div>
      
      <div>
        <div class="text-xs font-bold">${servingScoopInfo}</div>
      </div>
    </div>
  `;
}

function generateUSComplexHTML(productData: any): string {
  const {
    product,
    directions,
    servingSize,
    ingredients,
    allergenAdvice,
    storage,
    supplementaryInfo,
    servingScoopInfo,
    nutritionalData,
    nutritionalItems,
    compositionalData,
    consumptionWarning,
    template,
  } = productData;

  const getBorderThickness = (thickness: string = "light") => {
    const thicknessMap: { [key: string]: string } = {
      light: "1px solid black",
      medium: "2px solid black",
      large: "3px solid black",
      xl: "4px solid black",
      "2xl": "5px solid black",
    };
    return thicknessMap[thickness] || "1px solid black";
  };

  const thickBorderStyle = "5px solid black";

  return `
    <div class="max-w-2xl mx-auto bg-white text-black p-8 font-sans text-sm leading-tight">
      <div class="grid gap-8 w-full grid-cols-1">
        <div class="w-full">
          <div class="w-full">
            <div class="bg-black text-white text-center py-2 px-4 font-bold tracking-widest text-sm">
              SUPPLEMENT FACTS
            </div>
            <table class="w-full border-collapse">
              <tbody>
                <tr style="border-bottom: ${thickBorderStyle}">
                  <td class="py-1 px-2">
                    Serving Size: ${servingSize}
                  </td>
                  <td></td>
                  <td class="py-1 px-2 text-right">
                    Servings per Container: ${nutritionalData.servingsPerPack}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid black">
                  <td class="py-1 px-2"></td>
                  <td class="py-1 px-2 font-normal text-xs text-right w-32">
                    Amount Per Serving
                  </td>
                  <td class="py-1 px-2 text-center font-normal text-xs">
                    % Daily Value*
                  </td>
                </tr>
                ${
                  nutritionalItems
                    ? nutritionalItems
                        .map(
                          (item: any) => `
                  <tr style="border-bottom: ${getBorderThickness(
                    item.borderThickness
                  )}">
                    <td class="py-1 px-2 ${
                      item.label.includes("Saturated") ||
                      item.label.includes("Sugars") ||
                      item.label.includes("Added") ||
                      item.label.includes("Dietary")
                        ? "italic pl-4"
                        : ""
                    }">
                      ${item.label}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.serveKey] || "0"}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.dailyValueKey] || "*"}
                    </td>
                  </tr>
                `
                        )
                        .join("")
                    : ""
                }
              </tbody>
            </table>
            <div class="text-xs mt-2 px-2">
              * Daily Value not established.
            </div>
          </div>
        </div>
        ${
          template === "complex" &&
          compositionalData &&
          Object.keys(compositionalData).length > 0
            ? `
          <div class="w-full">
            <div class="bg-black text-white text-center py-2 px-4 font-bold tracking-widest text-sm">
              COMPOSITIONAL INFORMATION
            </div>
            <table class="w-full border-collapse">
              <tbody>
                <tr style="border-bottom: 1px solid black">
                  <td class="py-1 px-2"></td>
                  <td class="py-1 px-2 font-normal text-xs text-center">
                    Per Serve
                  </td>
                </tr>
                ${Object.entries(compositionalData)
                  .map(
                    ([key, data]: [string, any]) => `
                  <tr style="border-bottom: ${getBorderThickness(
                    data.borderThickness
                  )}">
                    <td class="py-1 px-2">
                      ${key}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${data.value}
                    </td>
                  </tr>
                `
                  )
                  .join("")}
              </tbody>
            </table>
          </div>
        `
            : ""
        }
        ${
          consumptionWarning
            ? `
          <div class="w-full">
            <div class="bg-red-600 text-white text-center py-2 px-4 font-bold tracking-widest text-sm">
              CONSUMPTION WARNING
            </div>
            <div class="border border-red-600 p-4">
              <div class="text-sm">${consumptionWarning}</div>
            </div>
          </div>
        `
            : ""
        }
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Directions:</h3>
        <div>${directions}</div>
      </div>
      
      ${
        consumptionWarning
          ? `<div class="mb-4">
        <h3 class="font-bold mb-2">Warning:</h3>
        <div class="text-red-600">${consumptionWarning}</div>
      </div>`
          : ""
      }
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Ingredients:</h3>
        <div>${ingredients}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Allergen Advice:</h3>
        <div>${allergenAdvice}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Storage:</h3>
        <div>${storage}</div>
      </div>
      
      <div class="mb-4">
        <div class="text-xs">${supplementaryInfo}</div>
      </div>
      
      <div>
        <div class="text-xs font-bold">${servingScoopInfo}</div>
      </div>
    </div>
  `;
}

function generateAUProteinHTML(productData: any): string {
  const {
    product,
    directions,
    servingSize,
    ingredients,
    allergenAdvice,
    storage,
    supplementaryInfo,
    servingScoopInfo,
    nutritionalData,
    nutritionalItems,
    aminoAcidData,
    template,
  } = productData;

  const getBorderThickness = (thickness: string = "light") => {
    const thicknessMap: { [key: string]: string } = {
      light: "1px solid black",
      medium: "2px solid black",
      large: "3px solid black",
      xl: "4px solid black",
      "2xl": "5px solid black",
    };
    return thicknessMap[thickness] || "1px solid black";
  };

  const thickBorderStyle = "5px solid black";

  return `
    <div class="max-w-2xl mx-auto bg-white text-black p-8 font-sans text-sm leading-tight">
      <div class="grid gap-8 w-full grid-cols-1 lg:grid-cols-2">
        <div class="space-y-4 w-full">
          <div>
            <h3 class="font-bold text-base mb-2">DIRECTIONS:</h3>
            <div>${directions}</div>
          </div>
          <div>
            <h3 class="font-bold text-base mb-2">SERVING SIZE:</h3>
            <p>${servingSize}</p>
          </div>
          <div>
            <h3 class="font-bold text-base mb-2">INGREDIENTS:</h3>
            <div>${ingredients}</div>
          </div>
          <div>
            <h3 class="font-bold text-base mb-2">ALLERGEN ADVICE:</h3>
            <div>${allergenAdvice}</div>
          </div>
          <div>
            <h3 class="font-bold text-base mb-2">STORAGE:</h3>
            <div>${storage}</div>
          </div>
          <div>
            <h3 class="font-bold text-base mb-2">FORMULATED SUPPLEMENTARY SPORTS FOOD.</h3>
            <div>${supplementaryInfo}</div>
          </div>
          <div>
            <h3 class="font-bold text-base mb-2">SERVING SCOOP INCLUDED,</h3>
            <div>${servingScoopInfo}</div>
          </div>
        </div>
        <div class="w-full">
          <div class="w-full">
            <div class="bg-black text-white text-center py-2 px-4 font-bold tracking-widest text-sm">
              NUTRITIONAL INFORMATION
            </div>
            <table class="w-full border-collapse">
              <tbody>
                <tr style="border-bottom: ${thickBorderStyle}">
                  <td class="py-1 px-2">
                    Serving Size: ${servingSize}
                  </td>
                  <td></td>
                  <td class="py-1 px-2 text-right">
                    Servings per Pack: ${nutritionalData.servingsPerPack}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid black">
                  <td class="py-1 px-2"></td>
                  <td class="py-1 px-2 font-normal text-xs text-right w-32">
                    Per Serve
                  </td>
                  <td class="py-1 px-2 text-center font-normal text-xs">
                    Per 100g
                  </td>
                </tr>
                ${
                  nutritionalItems
                    ? nutritionalItems
                        .map(
                          (item: any) => `
                  <tr style="border-bottom: ${getBorderThickness(
                    item.borderThickness
                  )}">
                    <td class="py-1 px-2 ${
                      item.label.includes("Saturated") ||
                      item.label.includes("Sugars")
                        ? "italic pl-4"
                        : ""
                    }">
                      ${item.label}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.serveKey] || "0"}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.per100gKey] || "0"}
                    </td>
                  </tr>
                `
                        )
                        .join("")
                    : ""
                }
              </tbody>
            </table>
          </div>
          <div class="mt-6 w-full">
            <div class="bg-black text-white text-center py-2 px-4 font-bold text-base">
              TYPICAL AMINO ACID PROFILE
            </div>
            <div class="text-right py-1 font-semibold" style="border-bottom: ${thickBorderStyle}">
              Per 100g of Protein
            </div>
            <table class="w-full border-collapse">
              <tbody>
                ${
                  aminoAcidData
                    ? Object.entries(aminoAcidData)
                        .map(
                          ([key, data]: [string, any]) => `
                  <tr style="border-bottom: ${getBorderThickness(
                    data.borderThickness
                  )}">
                    <td class="py-1 px-2">${key}</td>
                    <td class="py-1 px-2 text-right">${data.value}</td>
                  </tr>
                `
                        )
                        .join("")
                    : ""
                }
                <tr style="border-bottom: 1px solid black; border-top: ${thickBorderStyle}">
                  <td class="py-1 px-2 font-semibold">
                    BCAAs* = 5,832 mg per serve
                  </td>
                  <td></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Directions:</h3>
        <div>${directions}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Ingredients:</h3>
        <div>${ingredients}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Allergen Advice:</h3>
        <div>${allergenAdvice}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Storage:</h3>
        <div>${storage}</div>
      </div>
      
      <div class="mb-4">
        <div class="text-xs">${supplementaryInfo}</div>
      </div>
      
      <div>
        <div class="text-xs font-bold">${servingScoopInfo}</div>
      </div>
    </div>
  `;
}

function generateAUSupplementsHTML(productData: any): string {
  const {
    product,
    directions,
    servingSize,
    ingredients,
    allergenAdvice,
    storage,
    supplementaryInfo,
    servingScoopInfo,
    nutritionalData,
    nutritionalItems,
    template,
  } = productData;

  const getBorderThickness = (thickness: string = "light") => {
    const thicknessMap: { [key: string]: string } = {
      light: "1px solid black",
      medium: "2px solid black",
      large: "3px solid black",
      xl: "4px solid black",
      "2xl": "5px solid black",
    };
    return thicknessMap[thickness] || "1px solid black";
  };

  const thickBorderStyle = "5px solid black";

  return `
    <div class="max-w-2xl mx-auto bg-white text-black p-8 font-sans text-sm leading-tight">
      <div class="grid gap-8 w-full grid-cols-1">
        <div class="w-full">
          <div class="w-full">
            <div class="bg-black text-white text-center py-2 px-4 font-bold tracking-widest text-sm">
              NUTRITIONAL INFORMATION
            </div>
            <table class="w-full border-collapse">
              <tbody>
                <tr style="border-bottom: ${thickBorderStyle}">
                  <td class="py-1 px-2">
                    Serving Size: ${servingSize}
                  </td>
                  <td></td>
                  <td class="py-1 px-2 text-right">
                    Servings per Bottle: ${nutritionalData.servingsPerPack}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid black">
                  <td class="py-1 px-2"></td>
                  <td class="py-1 px-2 font-normal text-xs text-right w-32">
                    Per Serve
                  </td>
                  <td class="py-1 px-2 text-center font-normal text-xs">
                    Per 100g
                  </td>
                </tr>
                ${
                  nutritionalItems
                    ? nutritionalItems
                        .map(
                          (item: any) => `
                  <tr style="border-bottom: ${getBorderThickness(
                    item.borderThickness
                  )}">
                    <td class="py-1 px-2 ${
                      item.label.includes("Saturated") ||
                      item.label.includes("Sugars")
                        ? "italic pl-4"
                        : ""
                    }">
                      ${item.label}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.serveKey] || "0"}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.per100gKey] || "0"}
                    </td>
                  </tr>
                `
                        )
                        .join("")
                    : ""
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Directions:</h3>
        <div>${directions}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Ingredients:</h3>
        <div>${ingredients}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Allergen Advice:</h3>
        <div>${allergenAdvice}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Storage:</h3>
        <div>${storage}</div>
      </div>
      
      <div class="mb-4">
        <div class="text-xs">${supplementaryInfo}</div>
      </div>
      
      <div>
        <div class="text-xs font-bold">${servingScoopInfo}</div>
      </div>
    </div>
  `;
}

function generateUSDefaultHTML(productData: any): string {
  const {
    product,
    directions,
    servingSize,
    ingredients,
    allergenAdvice,
    storage,
    supplementaryInfo,
    servingScoopInfo,
    nutritionalData,
    nutritionalItems,
    template,
  } = productData;

  const getBorderThickness = (thickness: string = "light") => {
    const thicknessMap: { [key: string]: string } = {
      light: "1px solid black",
      medium: "2px solid black",
      large: "3px solid black",
      xl: "4px solid black",
      "2xl": "5px solid black",
    };
    return thicknessMap[thickness] || "1px solid black";
  };

  const thickBorderStyle = "5px solid black";

  return `
    <div class="max-w-2xl mx-auto bg-white text-black p-8 font-sans text-sm leading-tight">
      <div class="grid gap-8 w-full grid-cols-1">
        <div class="w-full">
          <div class="w-full">
            <div class="bg-black text-white text-center py-2 px-4 font-bold tracking-widest text-sm">
              NUTRITION FACTS
            </div>
            <table class="w-full border-collapse">
              <tbody>
                <tr style="border-bottom: ${thickBorderStyle}">
                  <td class="py-1 px-2">
                    Serving Size: ${servingSize}
                  </td>
                  <td></td>
                  <td class="py-1 px-2 text-right">
                    Servings per Container: ${nutritionalData.servingsPerPack}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid black">
                  <td class="py-1 px-2"></td>
                  <td class="py-1 px-2 font-normal text-xs text-right w-32">
                    Amount Per Serving
                  </td>
                  <td class="py-1 px-2 text-center font-normal text-xs">
                    % Daily Value*
                  </td>
                </tr>
                ${
                  nutritionalItems
                    ? nutritionalItems
                        .map(
                          (item: any) => `
                  <tr style="border-bottom: ${getBorderThickness(
                    item.borderThickness
                  )}">
                    <td class="py-1 px-2 ${
                      item.label.includes("Saturated") ||
                      item.label.includes("Sugars") ||
                      item.label.includes("Added") ||
                      item.label.includes("Dietary")
                        ? "italic pl-4"
                        : ""
                    }">
                      ${item.label}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.serveKey] || "0"}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.dailyValueKey] || "*"}
                    </td>
                  </tr>
                `
                        )
                        .join("")
                    : ""
                }
              </tbody>
            </table>
            <div class="text-xs mt-2 px-2">
              * Daily Value not established.
            </div>
          </div>
        </div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Directions:</h3>
        <div>${directions}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Ingredients:</h3>
        <div>${ingredients}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Allergen Advice:</h3>
        <div>${allergenAdvice}</div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Storage:</h3>
        <div>${storage}</div>
      </div>
      
      <div class="mb-4">
        <div class="text-xs">${supplementaryInfo}</div>
      </div>
      
      <div>
        <div class="text-xs font-bold">${servingScoopInfo}</div>
      </div>
    </div>
  `;
}

function generateAUDefaultHTML(productData: any): string {
  const {
    product,
    directions,
    servingSize,
    ingredients,
    allergenAdvice,
    storage,
    supplementaryInfo,
    servingScoopInfo,
    nutritionalData,
    nutritionalItems,
    template,
  } = productData;

  const getBorderThickness = (thickness: string = "light") => {
    const thicknessMap: { [key: string]: string } = {
      light: "1px solid black",
      medium: "2px solid black",
      large: "3px solid black",
      xl: "4px solid black",
      "2xl": "5px solid black",
    };
    return thicknessMap[thickness] || "1px solid black";
  };

  const thickBorderStyle = "5px solid black";

  return `
    <div class="max-w-2xl mx-auto bg-white text-black p-8 font-sans text-sm leading-tight">
      <div class="grid gap-8 w-full grid-cols-1">
        <div class="w-full">
          <div class="w-full">
            <div class="bg-black text-white text-center py-2 px-4 font-bold tracking-widest text-sm">
              NUTRITIONAL INFORMATION
            </div>
            <table class="w-full border-collapse">
              <tbody>
                <tr style="border-bottom: ${thickBorderStyle}">
                  <td class="py-1 px-2">
                    Serving Size: ${servingSize}
                  </td>
                  <td></td>
                  <td class="py-1 px-2 text-right">
                    Servings per Bottle: ${nutritionalData.servingsPerPack}
                  </td>
                </tr>
                <tr style="border-bottom: 1px solid black">
                  <td class="py-1 px-2"></td>
                  <td class="py-1 px-2 font-normal text-xs text-right w-32">
                    Per Serve
                  </td>
                  <td class="py-1 px-2 text-center font-normal text-xs">
                    Per 100g
                  </td>
                </tr>
                ${
                  nutritionalItems
                    ? nutritionalItems
                        .map(
                          (item: any) => `
                  <tr style="border-bottom: ${getBorderThickness(
                    item.borderThickness
                  )}">
                    <td class="py-1 px-2 ${
                      item.label.includes("Saturated") ||
                      item.label.includes("Sugars")
                        ? "italic pl-4"
                        : ""
                    }">
                      ${item.label}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.serveKey] || "0"}
                    </td>
                    <td class="py-1 px-2 text-center">
                      ${nutritionalData[item.per100gKey] || "0"}
                    </td>
                  </tr>
                `
                        )
                        .join("")
                    : ""
                }
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Directions:</h3>
        <p>${directions}</p>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Ingredients:</h3>
        <p>${ingredients}</p>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Allergen Advice:</h3>
        <p>${allergenAdvice}</p>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Storage:</h3>
        <p>${storage}</p>
      </div>
      
      <div class="mb-4">
        <p class="text-xs">${supplementaryInfo}</p>
      </div>
      
      <div>
        <p class="text-xs font-bold">${servingScoopInfo}</p>
      </div>
    </div>
  `;
}

function generateDefaultHTML(productData: any): string {
  const {
    product,
    directions,
    servingSize,
    ingredients,
    allergenAdvice,
    storage,
    supplementaryInfo,
    servingScoopInfo,
    nutritionalData,
  } = productData;

  return `
    <div class="max-w-2xl mx-auto bg-white text-black p-8 font-sans text-sm leading-tight">
      <div class="border-2 border-black mb-4">
        <h2 class="bg-black text-white p-2 text-center font-bold">NUTRITION INFORMATION</h2>
        <div class="p-4">
          <div class="mb-2">
            <span class="font-bold">Serving Size:</span> ${servingSize}
          </div>
          
          <table class="w-full border-collapse">
            <thead>
              <tr class="border-b-2 border-black">
                <th class="text-left py-2"></th>
                <th class="text-center py-2">Per Serve</th>
                <th class="text-center py-2">Per 100g</th>
              </tr>
            </thead>
            <tbody>
              <tr class="border-b border-gray-400">
                <td class="py-1 font-bold">Energy (kJ)</td>
                <td class="text-center">${
                  nutritionalData.energy_kj_serve || "0"
                }</td>
                <td class="text-center">${
                  nutritionalData.energy_kj_100g || "0"
                }</td>
              </tr>
              <tr class="border-b border-gray-400">
                <td class="py-1 font-bold">Energy (Cal)</td>
                <td class="text-center">${
                  nutritionalData.energy_cal_serve || "0"
                }</td>
                <td class="text-center">${
                  nutritionalData.energy_cal_100g || "0"
                }</td>
              </tr>
              <tr class="border-b border-gray-400">
                <td class="py-1">Protein (g)</td>
                <td class="text-center">${
                  nutritionalData.protein_serve || "0"
                }</td>
                <td class="text-center">${
                  nutritionalData.protein_100g || "0"
                }</td>
              </tr>
              <tr class="border-b border-gray-400">
                <td class="py-1">Total Fat (g)</td>
                <td class="text-center">${nutritionalData.fat_serve || "0"}</td>
                <td class="text-center">${nutritionalData.fat_100g || "0"}</td>
              </tr>
              <tr class="border-b border-gray-400">
                <td class="py-1">Saturated Fat (g)</td>
                <td class="text-center">${
                  nutritionalData.saturated_fat_serve || "0"
                }</td>
                <td class="text-center">${
                  nutritionalData.saturated_fat_100g || "0"
                }</td>
              </tr>
              <tr class="border-b border-gray-400">
                <td class="py-1">Carbohydrate (g)</td>
                <td class="text-center">${
                  nutritionalData.carbs_serve || "0"
                }</td>
                <td class="text-center">${
                  nutritionalData.carbs_100g || "0"
                }</td>
              </tr>
              <tr class="border-b border-gray-400">
                <td class="py-1">Sugars (g)</td>
                <td class="text-center">${
                  nutritionalData.sugars_serve || "0"
                }</td>
                <td class="text-center">${
                  nutritionalData.sugars_100g || "0"
                }</td>
              </tr>
              <tr>
                <td class="py-1">Sodium (mg)</td>
                <td class="text-center">${
                  nutritionalData.sodium_serve || "0"
                }</td>
                <td class="text-center">${
                  nutritionalData.sodium_100g || "0"
                }</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Directions:</h3>
        <p>${directions}</p>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Ingredients:</h3>
        <p>${ingredients}</p>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Allergen Advice:</h3>
        <p>${allergenAdvice}</p>
      </div>
      
      <div class="mb-4">
        <h3 class="font-bold mb-2">Storage:</h3>
        <p>${storage}</p>
      </div>
      
      <div class="mb-4">
        <p class="text-xs">${supplementaryInfo}</p>
      </div>
      
      <div>
        <p class="text-xs font-bold">${servingScoopInfo}</p>
      </div>
    </div>
  `;
}
