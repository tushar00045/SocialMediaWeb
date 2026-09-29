import conf from "../conf/config";

import { Client, ID,Databases,Storage,Query } from "appwrite";

export class Service{
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

  async createPost({
    title,
    slug,
    content,
    featuredImage,
    status,
    userId,
    userName,
    likes=1
  }) {
    try {
      return await this.databases.createDocument({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId,
        documentId: slug,
        data: {
          title,
          content,
          featuredImage,
          status,
          userid: userId,
          userName,
          likes
        }
      });
    } catch (error) {
      console.log("Appwrite service :: createPost :: error", error);
      throw error;
    }
  }

  async updatePost(slug,{ title, content, featuredImage, status}){
    try {
      return await this.databases.updateDocument({
        databaseId:conf.appwriteDatabaseId,
        collectionId:conf.appwriteCollectionId,
        documentId:slug,
        data:{
          title,
          content,
          featuredImage,
          status
        }
    })
    } catch (error) {
      console.log("Appwrite serive :: updatePost :: error", error);
    }
  }

  async incrementPostLikes(slug) {
    try {
      const result= await this.databases.incrementDocumentAttribute({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId,
        documentId: slug,
        attribute: "likes",
        value: 1
      });
      return result;
      
    } catch (error) {
      console.log("Appwrite service :: incrementPostLikes :: error", error);
      return null;
    }
  }
  async decrementPostLikes(slug) {
    try {
      return await this.databases.decrementDocumentAttribute({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId,
        documentId: slug,
        attribute: "likes",
        value: 1
      });
    } catch (error) {
      console.log("Appwrite service :: decrementPostLikes :: error", error);
      return null;
    }
  }
  
  async deletePost(slug) {
    try {
      await this.databases.deleteDocument({
        databaseId:conf.appwriteDatabaseId,
        collectionId:conf.appwriteCollectionId,
        documentId:slug
      })
      return true;
    } catch (error) {
      console.log("Appwrite serive :: deletePost :: error", error);
      return false;
    }
  }

  async getPost(slug) {
    try {
      return await this.databases.getDocument({
        databaseId:conf.appwriteDatabaseId,
        collectionId:conf.appwriteCollectionId,
        documentId:slug
      })
    } catch (error) {
      console.log("Appwrite serive :: getPost :: error", error);
      return false;
    }
  }

  async getPosts(queries=[Query.equal("status","active")]){
    try {
      return await this.databases.listDocuments({
        databaseId: conf.appwriteDatabaseId,
        collectionId: conf.appwriteCollectionId,
        queries
      })
    } catch (error) {
      console.log("Appwrite serive :: getPosts :: error", error);
      return false;
    }
  }

  //file upload service
  async uploadFile(file) {
    try {
      return await this.bucket.createFile(
        conf.appwriteBucketId,
        ID.unique(),
        file
      )
    } catch (error) {
      console.log("Appwrite serive :: uploadFile :: error", error);
      return false;
    }
  }

  async deleteFile(fileId) {
    try {
      await this.databases.deleteFile(
        conf.appwriteBucketId,
        fileId
      )
      return true
    } catch (error) {
      throw error;
      return false
    }
  }

  getFilePreview(fileId) {
    try {
      return this.bucket.getFilePreview(
        conf.appwriteBucketId,
        fileId
      )
      return true
    } catch (error) {
      throw error;
      return false;
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

const service = new Service()

export default service