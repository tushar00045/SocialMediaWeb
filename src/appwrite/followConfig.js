import conf from "../conf/config";

import { Client, ID, Databases, Storage, Query } from "appwrite";

async function generateFollowId(followerId, followingId) {
  const value = `${followerId}_${followingId}`;

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

export class AppwriteFollow{
  client = new Client()
  databases;
  buckets;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async followUser({followerId, followingId}) {
    try {
      const documentId = await generateFollowId(followerId,followingId);
      return await this.databases.createDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId4,
        documentId,
        
        data: {
          followerId,
          followingId
        }
      })
    } catch (error) {
      console.log("Unable to follow.",error)
    }
  }

  async getFollower(userId) {
    try {
      const result = await this.databases.listDocuments({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId4,
        queries:[
          Query.equal("followingId", userId)
        ]
    })

      return result;
    } catch (error) {
      console.log("Unable to get Follower", userId);
    }
  }

  async getFollowing(userId) {
    try {
      console.log("DATABASE:", conf.appwriteDatabaseId);
      console.log("COLLECTION:", conf.appwriteCollectionId4);
      console.log("USER:", userId);

      const result = await this.databases.listDocuments({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId4,
        queries: [
          Query.equal("followerId", userId)
        ]
      });

      console.log("FOLLOWING DOCUMENTS:", result.documents);

      return result;

    } catch (error) {
      console.error("Unable to get following:", error);
      return null;
    }
  }

  async checkFollowing({ followerId, followingId }) {
    try {
      return await this.databases.listDocuments({
        databaseId:conf.appwriteDatabaseId,
        collectionId:conf.appwriteCollectionId4,
        queries:[
          Query.equal("followingId", followingId),
          Query.equal("followerId", followerId)
        ]
      })
    } catch (error) {
      console.log("Unable to check following.", error);
    }
  }

  async UnFolloweUser({ followerId, followingId }) {
    const documentId=await generateFollowId(followerId,followingId)
    try {
      return await this.databases.deleteDocument({
        databaseId:conf.appwriteDatabaseId,
        collectionId:conf.appwriteCollectionId4,
        documentId:documentId
      })
    } catch (error) {
      console.log("Unable to unfollow user", error);
    }
  }
}

const followAppwrite = new AppwriteFollow();
export default followAppwrite;