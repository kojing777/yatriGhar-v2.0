import mongoose from "mongoose";

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => {
      console.log("MongoDB connected successfully!");
    });

    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err && err.message ? err.message : err);
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('MongoDB disconnected.');
    });

    // Recommended options for more stable connections (tweak values as needed)
    const mongooseOptions = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      // Wait up to 30s for server selection before erroring
      serverSelectionTimeoutMS: 30000,
      // How long a socket can be idle before timing out
      socketTimeoutMS: 45000,
      // Limit connection pool size
      maxPoolSize: 10,
      // Force IPv4 (useful if IPv6 causes routing issues)
      family: 4
    };

    await mongoose.connect(`${process.env.MONGODB_URI}/yatrighar`, mongooseOptions);
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error && error.stack ? error.stack : error);
  }
}

export default connectDB;
