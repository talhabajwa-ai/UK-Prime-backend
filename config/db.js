const mongoose = require('mongoose');

/**
 * Connection caching for serverless environments.
 * If mongoose is already connected, return early to avoid opening
 * multiple connections during cold starts / repeated invocations.
 */
const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) {
    // already connected
    return mongoose.connection;
  }

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      // recommended options (mongoose 6+ has sensible defaults)
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    return conn.connection;
  } catch (error) {
    console.error(`Error: ${error.message}`);
    // In serverless functions we should not exit the process; rethrow so
    // the function invocation fails and Vercel shows an error.
    throw error;
  }
};

module.exports = connectDB; 
