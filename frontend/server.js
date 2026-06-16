const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 5001;

// Phục vụ tĩnh toàn bộ thư mục frontend
app.use(express.static(__dirname));

app.listen(PORT, () => {
  console.log(`\n🚀 Doraemon Wiki Frontend running at http://localhost:${PORT}`);
  console.log(`   Direct access: http://localhost:${PORT}/index.html\n`);
});
