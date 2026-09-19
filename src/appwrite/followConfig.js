import conf from "../conf/config";

import { Client, ID, Databases, Storage, Query, Permission, Role } from "appwrite";

export class AppwriteFollow{
  client = new Client()
  databases;
  buckets;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setEndpoint(conf.appwriteProjectId);
    this.databases = new Databases(this.client);
    this.bucket = new Storage(this.client);
  }

  async followUser({followerId, followingId}) {
    try {
      return await this.databases.createDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId4,
        documentId: ID.unique(),
        
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
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId4,

        [
          Query.equal("following Id", userId)
        ]
      )
    } catch (error) {
      console.log("Unable to get Follower", userId);
    }
  }

  async getFollowing(userId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId4
        [
        Query.equal("followerId", userId)
        ]
      )
    } catch (error) {
      console.log("Unable to get following", userId);
    }
  }

  async checkFollowing({ followerId, followingId }) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId4,
        [
          Query.equal("following Id", followerId),
          Query.equal("followerId", followingId)
        ]
      )
    } catch (error) {
      console.log("Unable to check following.", error);
    }
  }

  async UnFolloweUser(documentId) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId4,
        documentId
      )
    } catch (error) {
      console.log("Unable to unfollow user", error);
    }
  }
}

const followAppwrite = new AppwriteFollow();
export default followAppwrite;