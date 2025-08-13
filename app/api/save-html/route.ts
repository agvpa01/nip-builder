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

  if (region === "US" && template === "supplements") {
    nipContent = generateUSSupplementsHTML(productData);
  } else if (region === "AU" && template === "complex") {
    nipContent = generateAUComplexHTML(productData);
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
