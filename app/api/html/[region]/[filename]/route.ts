import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ region: string; filename: string }> }
) {
  try {
    const { region, filename } = await params;

    if (!region || !filename) {
      return NextResponse.json({ error: 'Region and filename are required' }, { status: 400 });
    }

    // Validate region
    const validRegions = ['au', 'us'];
    if (!validRegions.includes(region.toLowerCase())) {
      return NextResponse.json({ error: 'Invalid region. Must be "au" or "us"' }, { status: 400 });
    }

    // Construct the file path
    const filePath = join(process.cwd(), 'storage', 'html', region.toLowerCase(), `${filename}.html`);

    // Check if file exists
    if (!existsSync(filePath)) {
      return NextResponse.json({ error: `HTML file not found in ${region.toUpperCase()} region` }, { status: 404 });
    }

    // Read the HTML file
    const htmlContent = await readFile(filePath, 'utf8');

    // Return the HTML content with proper headers
    return new NextResponse(htmlContent, {
      status: 200,
      headers: {
        'Content-Type': 'text/html; charset=utf-8',
        'Cache-Control': 'public, max-age=3600', // Cache for 1 hour
        'X-Region': region.toLowerCase(),
      },
    });
  } catch (error) {
    console.error('Error serving HTML file:', error);
    return NextResponse.json({ error: 'Failed to serve HTML file' }, { status: 500 });
  }
}