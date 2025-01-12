// exportPosts.js
import Post from "./models/postModel.js";
import mongoose from "mongoose";
import fs from 'fs'
 // Adjust the path to your Post model

// Replace the following with your MongoDB connection string
const mongoURI = 'mongodb+srv://afroz:123@talklifecluster.j2ztt.mongodb.net/';

mongoose.connect(mongoURI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once('open', async () => {
  console.log('Connected to MongoDB');

  try {
    // Read posts from JSON file
    const posts = JSON.parse(fs.readFileSync('posts.json', 'utf-8'));

    // Remove _id from each post
    const postsToInsert = posts.map(({ _id, ...post }) => post); // Destructure to exclude _id

    // Insert posts into the collection
    await Post.insertMany(postsToInsert);

    console.log('Posts have been inserted.');
  } catch (err) {
    console.error('Error inserting posts:', err);
  } finally {
    // Close the MongoDB connection
    mongoose.connection.close();
  }
});