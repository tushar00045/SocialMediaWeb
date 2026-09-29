import conf from "../conf/config";

import { Client, Databases, Storage,Query } from "appwrite";

async function generateLikeId(postId, userId) {
  const value = `${postId}_${userId}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(value);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hash = hashArray
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");

  // SHA-256 = 64 characters
  // Appwrite allows max 36
  return hash.substring(0, 36);
}
export class LikeAppwrite{
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId)
    
    this.databases = new Databases(this.client);
  }

  async createLike({ postId, userId }) {
    try {
      const documentId = await generateLikeId(postId, userId);
      return await this.databases.createDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId5,
        documentId,

        data: {
          postId,
          userId
        }
      })
    } catch (error) {
      console.log("Unable Create like Request.", error);
    }
  }

  async deleteLike({ postId, userId }) {
    const documentId = await generateLikeId(postId, userId)
    try {
      return await this.databases.deleteDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId5,
        documentId
      })
    } catch (error) {
      console.log("Unable to dislike the Post.", error);
    }
  }

  async getLikeUsers(postId) {
    try {
      return await this.databases.listDocuments({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId5,
        queries: [
          Query.equal("postId", postId)
        ]
      });
    } catch (error) {
      console.log("Unable to get Users who like this post.",error)
    }
  }
}