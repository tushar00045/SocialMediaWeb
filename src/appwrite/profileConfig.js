import conf from "../conf/config";

import {Client,Databases,Storage} from "appwrite";

export class ProfileAppwrite {

  client = new Client();
  databases;
  bucket;

  constructor() {
    this.client
      .setEndpoint(conf.appwriteUrl)
      .setProject(conf.appwriteProjectId);
    
    console.log("APPWRITE URL:", conf.appwriteUrl);
    console.log("APPWRITE PROJECT:", conf.appwriteProjectId);
    console.log("APPWRITE DATABASE:", conf.appwriteDatabaseId);
    console.log("APPWRITE PROFILE COLLECTION:", conf.appwriteCollectionId2);

    this.databases = new Databases(this.client);

    this.bucket = new Storage(this.client);
  }

  // Create profile
  async createProfile({
    userId,
    bio = "",
    address = "",
    profileImage = "",
    coverImage = "",
    profileName="",
  }) {

    try {
      return await this.databases.createDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId2,
        // IMPORTANT
        // Profile document ID = Appwrite user ID
        userId,
        {
          bio,
          address,
          profileImage,
          coverImage,
          profileName,
        }
      );

    } catch (error) {

      console.log(
        "Appwrite service :: createProfile :: error",
        error
      );

      throw error;
    }
  }

  // Get profile
  async getProfile(userId) {
    try {
      return await this.databases.getDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId2,
        userId
      );

    } catch (error) {
      console.log(
        "Appwrite service :: getProfile :: error",
        error
      );
      return null;
    }
  }

  async getProfiles(queries = []) {
    try {
      return await this.databases.listDocuments(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId2,
        queries
      )
    } catch (error) {
      console.log(
        "Appwrite service :: getProfile :: error",
        error
      );
      return null;
    }
  }

  // Update profile
  async updateProfile(
    userId,
    {
      profileImage,
      coverImage,
      bio,
      address
    }
  ) {
    try {
      return await this.databases.updateDocument(
        conf.appwriteDatabaseId,
        conf.appwriteCollectionId2,
        // IMPORTANT
        userId,
        {
          profileImage,
          coverImage,
          bio,
          address
        }
      );

    } catch (error) {
      console.log(
        "Appwrite service :: updateProfile :: error",
        error
      );
      throw error;
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

  // Get image URL
  getFileView(fileId) {
    if (!fileId) {
      return null;
    }
    return this.bucket.getFileView(
      conf.appwriteBucketId,
      fileId
    );
  }
}

const profileAppwrite = new ProfileAppwrite();

export default profileAppwrite;