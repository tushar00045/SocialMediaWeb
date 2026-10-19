import conf from "../conf/config";
import { Client, Storage, ID, Query, Databases } from "appwrite"

async function generateBookMarkId(userId, postId) {
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

export class AppwriteHistory{
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases=new Databases(this.client)
  }

  async createHistory({ userId, postId }) {
    const documentId = await generateBookMarkId(userId, postId);
    try {
      return await this.databases.createDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId9,
        documentId: documentId,
        data: {
          userId,
          postId
        }
      })
    } catch (error) {
      console.log("Error to Create History",error);
    }
  }

  async deleteHistory({ userId, postId }) {
    const documentId = await generateBookMarkId(userId, postId);
    try {
      return await this.databases.deleteDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId9,
        documentId:documentId
      })
    } catch (error) {
      console.log("Error to delete History", error);
    }
  }

  async getHistoryUsers(userId) {
    try {
      return await this.databases.listDocuments({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId9,
        queries: [
          Query.equal("userId", userId)
        ]
      })
    } catch (error) {
      console.log("Unable to Get the History:", error);
    }
  }
}

const appwriteHistory = new AppwriteHistory();
export default appwriteHistory;