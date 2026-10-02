import conf from "../conf/config";
import { Client, Databases, Storage, Query, ID} from "appwrite";

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
    try {
      return await this.databases.createDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId6,
        documentId: ID.unique(),
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
    try {
      return await this.databases.deleteDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId6,
        documentId:ID.unique()
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
