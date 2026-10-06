import conf from "../conf/config";
import { Client, Databases, Query, Storage,ID } from "appwrite";

export class AppwriteCommentReply{
  client = new Client()
  databases;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId)
    this.databases = new Databases(this.client)
  }

  async createReply({ userId, reply, userName, commentId }) {
    try {
      return await this.databases.createDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId7,
        documentId: ID.unique(),
        data: {
          commentId,
          userId,
          reply,
          userName,
        }
      })
    } catch (error) {
      console.log("Unable to Reply on the comment", error);
    }
  }

  async getReplys(commentId) {
    try {
      const result= await this.databases.listDocuments({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId7,
        queries: [
          Query.equal("commentId", commentId)
        ]
      });
      console.log(result);
      return result;
    } catch (error) {
      console.log("Unable to featch the comment.", error);
    }
  }
  
  async deleteReply(commentId) {
    try {
      return await this.databases.deleteDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId7,
        documentId:ID.unique()
      })
    } catch (error) {
      console.log("Unable to Delete the reply.", error);
    }
  }
}

export const appwriteReply = new AppwriteCommentReply();