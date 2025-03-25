import path from 'path';
import puppeteer from 'puppeteer';

export const generateOrderPdf = async (
  htmlContent: string,
  orderId: string,
) => {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: 'load' });
  const pdfPath = path.resolve(__dirname, `../pdfs/order-${orderId}.pdf`);
  await page.pdf({
    path: pdfPath,
    format: 'A4',
    printBackground: true,
  });

  await browser.close();
  return pdfPath;
};
