import conf from "../conf/config";
import { Client, Databases, Storage, Query, ID} from "appwrite";

async function generateCommentLikeId(commentId, userId) {
  const value = `${commentId}_${userId}`;

  const encoder = new TextEncoder();
  const data = encoder.encode(value);

  const hashBuffer = await crypto.subtle.digest("SHA-256", data);

  const hashArray = Array.from(new Uint8Array(hashBuffer));

  const hash = hashArray
    .map(byte => byte.toString(16).padStart(2, "0"))
    .join("");

  const documentId = hash.substring(0, 36);

  console.log("commentId:", commentId);
  console.log("userId:", userId);
  console.log("FULL HASH:", hash);
  console.log("DOCUMENT ID:", documentId);
  console.log("DOCUMENT ID LENGTH:", documentId.length);

  return documentId;
}

export class AppwriteCommentLike{
  client = new Client();
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId)
    
    this.databases = new Databases(this.client);
  }

  async createLike({ commentId, userId }) {
    const documentId = await generateCommentLikeId(commentId, userId);
    console.log("FINAL ID SENT TO APPWRITE:", documentId);
    console.log("FINAL ID LENGTH:", documentId.length);
    try {
      return await this.databases.createDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId6,
        documentId: documentId,
        data: {
          commentId,
          userId
        }
      })
    } catch (error) {
      console.log("Unable to do the like On the Comment.",error)
    }
  }

  async deleteLike({ commentId, userId }) {
    const documentId = await generateCommentLikeId(commentId, userId);
    try {
      return await this.databases.deleteDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId6,
        documentId:documentId
      })
    } catch (error) {
      console.log("Unable to delete the commentLike", error);
    }
  }

  async getLikeUsers(commentId) {
    try {
      return await this.databases.listDocuments({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId6,
        queries: [
          Query.equal("commentId", commentId)
        ]
      });
    } catch (error) {
      console.log("Unable to get Like Users.",error)
    }
  }
}
export const appwriteCommentLike = new AppwriteCommentLike();
