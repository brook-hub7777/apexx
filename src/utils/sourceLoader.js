export function sanitizeSourceText(text) {
  if (typeof text !== 'string') throw new Error('invalid');
  const clean = text.replace(/\u0000/g, '').replace(/\r\n?/g, '\n').trim();
  if (!clean) throw new Error('empty');
  if (clean.length > 50000) throw new Error('large');
  return clean;
}

export async function extractPdfText(dataBuffer) {
  const dynamicImport = new Function('url', 'return import(url)');
  const isBrowser = typeof window !== 'undefined' && typeof window.document !== 'undefined';
  const pdfjs = await dynamicImport(isBrowser ? '/pdf/pdf.js' : '../../public/pdf/pdf.js');
  if (isBrowser) {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf/pdf.worker.mjs';
  }
  const loadingTask = pdfjs.getDocument({ data: dataBuffer, useSystemFonts: true });
  try {
    const doc = await loadingTask.promise;
    if (doc.numPages > 100) throw new Error('large');
    let text = '';
    for (let pageNum = 1; pageNum <= doc.numPages; pageNum++) {
      const page = await doc.getPage(pageNum);
      const content = await page.getTextContent();
      text += content.items.map(item => 'str' in item ? item.str + (item.hasEOL ? '\n' : ' ') : '').join('') + '\n';
      if (text.length > 50000) throw new Error('large');
    }
    if (text.trim().length < 10) throw new Error('scan');
    return text;
  } finally {
    try {
      await loadingTask.destroy();
    } catch (e) {
      // ignore destruction err
    }
  }
}

export const SOURCE_ERROR_MESSAGES = {
  empty: 'The source is empty. Add some text.',
  large: 'Source too large. Split it into files under 5 MB, 50,000 characters or 100 PDF pages.',
  format: 'Use PDF, TXT or MD, or paste the text from another format.',
  scan: 'No text layer found. Run OCR on a scanned PDF first, or paste its text.',
  facts: 'No extractable facts found. Use “Term: definition”, a definition sentence, or mark an answer with **bold**.',
  select: 'Select at least one source first.',
  bank: 'The bank has empty questions, invalid answers, or over 200 questions. Review it first.',
  invalid: 'Unable to read this content. Check its format and try again.'
};
