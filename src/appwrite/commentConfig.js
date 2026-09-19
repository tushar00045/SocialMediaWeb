import conf from "../conf/config";

import { Client, ID, Databases, Storage, Query,Permission,Role } from "appwrite";

export class AppwriteComment {
  client = new Client()
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    this.databases = new Databases(this.client)
    this.bucket = new Storage(this.client);
  }

  async createComment({
    userId,
    postId,
    Image,
    reply,
    userName
  }) {
    try {
      return await this.databases.createDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId3,
        documentId: ID.unique(),
        data: {
          userId,
          postId,
          Image,
          reply,
          userName
        },
        permissions:[
          Permission.read(Role.any()),
          Permission.update(Role.user(userId)),
          Permission.delete(Role.user(userId))
        ]
      });
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
      throw error;
    }
  }

  async getComments(postId) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId3,
        [
          Query.equal("postId", postId)
        ]
      );

    } catch (error) {

      console.log(
        "Comment service :: getComments :: error",
        error
      );

      return null;
    }
  }

  async deleteComment(commentId) {
    try {
      return await this.databases.deleteDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId3,
        commentId
      );
    } catch (error) {
      console.log(
        "Comment service :: deleteComment :: error",
        error
      );
      return false;
    }
  }

  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        "unique()",
        file
      );

    } catch (error) {
      console.log(
        "Appwrite service :: uploadFile :: error",
        error
      );
      throw error;
    }
  }

  getFileView(fileId) {
    try {
      return this.bucket.getFileView(
        conf.appwriteBucketId,
        fileId
      )
      return true
    } catch (error) {
      throw error;
      return false;
    }
  }
}

export const appwriteComment = new AppwriteComment()

//export default appwriteComment;