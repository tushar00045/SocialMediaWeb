import conf from "../conf/config";
import { Client, Storage, ID, Query, Databases } from "appwrite";

async function generateRepostId(userId, postId) {
  const value = `${userId}_${postId}`;

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

export class AppwriteRepost {
  client = new Client()
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client)
  }

  async createRepost({ userId, postId, posterId }) {
    const documentId = await generateRepostId(userId, postId);
    try {
      return await this.databases.createDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId8,
        documentId: documentId,
        data: {
          userId,
          postId,
          posterId
        }
      })
    } catch (error) {
      console.log("Error to create Repost:", error);
    }
  }

  async deleteRepost({ userId, postId }) {
    const documentId = await generateRepostId(userId, postId);
    try {
      return await this.databases.deleteDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId8,
        documentId: documentId
      });
      return true;
    } catch (error) {
      console.log("Unable to delete the Repost:", error);
    }
  }

  async getRepostsUsers(userId) {
    try {
      return await this.databases.listDocuments({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId8,
        queries: [
          Query.equal("userId", userId)
        ]
      })
    } catch (error) {
      console.log("Unable to Get the repost:", error);
    }
  }
  async getRepostsByPost(postId) {
    try {
      return await this.databases.listDocuments({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId8,
        queries: [
          Query.equal("postId", postId),
          Query.limit(100),
        ],
      });
    } catch (error) {
      console.error("Unable to fetch reposts:", error);
      return null;
    }
  }
}

const appwriteRepost = new AppwriteRepost()
export default appwriteRepost;