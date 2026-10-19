const fs = require('fs');

const js = fs.readFileSync('analysis/assets/index-CxKV-nwI.js', 'utf8');

function inspectView(name, needle, length = 1500) {
  console.log(`\n=== VIEW: ${name} ===`);
  const idx = js.indexOf(needle);
  if (idx !== -1) {
    console.log(js.slice(idx - 100, idx + length));
  } else {
    console.log(`Needle "${needle}" not found`);
  }
}

// 1. Import Modal (sy component)
inspectView('Import Modal (sy)', 'function sy(', 1500);

// 2. Share Modal
inspectView('Share Modal', 'V==="share"', 1500);

// 3. Poster Modal
inspectView('Poster Modal', 'V==="poster"', 1500);

// 4. Mistake Notebook (wrong mode)
inspectView('Mistake Notebook (wrong)', '==="wrong"', 1500);

// 5. Notes view (note mode)
inspectView('Notes View (note)', '==="note"', 1500);

// 6. Data Table view (table mode)
inspectView('Data Table (table)', '==="table"', 1500);

// 7. Search view (search mode)
inspectView('Search View (search)', '==="search"', 1500);

// 8. Edit Question Bank view (edit mode)
inspectView('Edit View (edit)', '==="edit"', 1500);
