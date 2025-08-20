import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";

export async function POST(request: NextRequest) {
  try {
    const { filename, templateData } = await request.json();

    if (!filename || !templateData) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Create the storage directory for templates
    const storageDir = join(process.cwd(), "storage", "templates");
    if (!existsSync(storageDir)) {
      await mkdir(storageDir, { recursive: true });
    }

    // Save the template data as JSON
    const filePath = join(storageDir, `${filename}-template.json`);
    await writeFile(filePath, JSON.stringify(templateData, null, 2), "utf8");

    return NextResponse.json({
      success: true,
      filename: `${filename}-template.json`,
      message: "Template saved successfully",
    });
  } catch (error) {
    console.error("Error saving template:", error);
    return NextResponse.json(
      { error: "Failed to save template" },
      { status: 500 }
    );
  }
}