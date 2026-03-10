const dns = require('dns');
const mongoose = require('mongoose');

const ATLAS_DNS_SERVERS = ['8.8.8.8', '1.1.1.1'];

const connectDB = async () => {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error('MONGODB_URI is not set in backend/.env');
  }

  try {
    if (mongoUri.startsWith('mongodb+srv://')) {
      dns.setServers(ATLAS_DNS_SERVERS);
    }

    await mongoose.connect(mongoUri, {
      serverSelectionTimeoutMS: 15000,
    });
    console.log('MongoDB connected successfully');
  } catch (error) {
    const helpText = mongoUri.includes('mongodb+srv://')
      ? `SRV connection failed. The backend is using Atlas DNS servers (${ATLAS_DNS_SERVERS.join(', ')}); if this still fails, verify network access and Atlas IP allowlisting.`
      : 'Ensure your local MongoDB service is running on 127.0.0.1:27017.';

    throw new Error(`MongoDB connection failed: ${error.message}. ${helpText}`);
  }
};

module.exports = connectDB;
