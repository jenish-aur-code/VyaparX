import { apiApp } from './app.js';

const PORT = Number(process.env.PORT || 5000);

apiApp.listen(PORT, () => {
  console.log(`[SERVER] VyaparX Authentication & API Server running on port ${PORT}`);
});
