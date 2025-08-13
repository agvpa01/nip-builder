import { NextRequest, NextResponse } from 'next/server';
import { existsSync } from 'fs';
import { join } from 'path';

export async function POST(request: NextRequest) {
  try {
    const { products } = await request.json();

    if (!products || !Array.isArray(products)) {
      return NextResponse.json({ error: 'Products array is required' }, { status: 400 });
    }

    const results = products.map((product: any) => {
      // Generate filename from onlineStoreUrl
      const filename = product.onlineStoreUrl.replace(/[^a-zA-Z0-9]/g, '-').toLowerCase();
      
      // Check both AU and US directories
      const auPath = join(process.cwd(), 'storage', 'html', 'au', `${filename}.html`);
      const usPath = join(process.cwd(), 'storage', 'html', 'us', `${filename}.html`);
      
      const hasAU = existsSync(auPath);
      const hasUS = existsSync(usPath);
      
      return {
        ...product,
        htmlStatus: {
          hasAU,
          hasUS,
          hasAny: hasAU || hasUS,
          filename
        }
      };
    });

    return NextResponse.json({ success: true, products: results });
  } catch (error) {
    console.error('Error checking HTML files:', error);
    return NextResponse.json({ error: 'Failed to check HTML files' }, { status: 500 });
  }
}