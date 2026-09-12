import dotenv from 'dotenv';
dotenv.config();

import app, { attachErrorHandlers } from './src/app.js';
import { connectDB } from './src/dbConfig/db.js';

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  // Connect to MongoDB
  await connectDB();

  // Attach final error handlers after all routes are registered
  attachErrorHandlers();

  // Start HTTP listener
  app.listen(PORT, () => {
    console.log(`==================================================`);
    console.log(` StatIQ Backend Server Running on Port: ${PORT}`);
    console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(` Health Check: http://localhost:${PORT}/api/health`);
    console.log(` Run Command:  nodemon index.js`);
    console.log(`==================================================`);
  });
};

startServer();

export default app;
