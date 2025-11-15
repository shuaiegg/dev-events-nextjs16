/**
 * lib/mongodb.ts
 *
 * Typed Mongoose connection helper for Next.js (TypeScript).
 * - Caches connection on the global object during development to avoid
 *   repeated connections caused by HMR / module reloads.
 * - Exports `connectToDatabase` which returns the mongoose instance.
 * - Avoids `any` by using Mongoose's own types.
 */

import mongoose from "mongoose";

// Read MongoDB connection string from environment. Throw early if missing.
const MONGODB_URI = process.env.MONGODB_URI ?? "";

if (!MONGODB_URI) {
  throw new Error(
    "Please define the MONGODB_URI environment variable inside .env.local"
  );
}

// Define a small cache structure to store the connection and promise.
type MongooseCache = {
  conn?: typeof mongoose; // cached mongoose instance
  promise?: Promise<typeof mongoose>; // pending connect() promise
  isConnected?: number; // readyState snapshot
};

// Extend the global type to store the cache. This keeps multiple hot reloads
// from creating new connections during development.
declare global {
  // eslint-disable-next-line no-var
  var mongooseCache: MongooseCache | undefined;
}

// Initialize or reuse the global cache object.
const cached: MongooseCache = global.mongooseCache ?? (global.mongooseCache = {});

/**
 * Connect to MongoDB using Mongoose and cache the connection.
 * Returns the mongoose module so callers can access `mongoose.model` etc.
 */
export async function connectToDatabase(): Promise<typeof mongoose> {
  // If we already have a connected client, reuse it.
  if (cached.conn && cached.isConnected) {
    return cached.conn;
  }

  // If a connection is in progress, reuse the same promise.
  if (!cached.promise) {
    const connectOptions: mongoose.ConnectOptions = {
      // Keep sensible defaults; disable buffering so errors surface fast.
      bufferCommands: false,
    };

    // Store the promise so concurrent calls reuse the same connection attempt.
    cached.promise = mongoose.connect(MONGODB_URI, connectOptions).then(() => {
      cached.conn = mongoose;
      // readyState: 1 = connected
      cached.isConnected = mongoose.connections[0]?.readyState ?? 1;
      return mongoose;
    });
  }

  // Await the (cached) connection promise and return the mongoose instance.
  cached.conn = await cached.promise;
  cached.isConnected = mongoose.connections[0]?.readyState ?? 1;
  return cached.conn;
}

/**
 * Disconnect the database. In production, it is safe to fully disconnect.
 * During development we usually keep the connection alive between HMR reloads.
 */
export async function disconnectDatabase(): Promise<void> {
  if (process.env.NODE_ENV === "production") {
    await mongoose.disconnect();
    global.mongooseCache = undefined;
  }
  // In development we intentionally don't disconnect to avoid reconnect storms.
}

export default connectToDatabase;
