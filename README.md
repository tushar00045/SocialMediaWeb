# MegaBlog 🚀

A full-stack social blogging platform where users can create posts, view posts from other users, manage their profiles, comment on posts, upload images, and interact with content.

The project is inspired by modern social-media platforms and focuses on building a clean, responsive interface with a real backend using Appwrite.

---

## ✨ Features

### 👤 Authentication

- User registration and login
- User session management
- Logout functionality
- Display currently logged-in user
- Protected user actions

### 📝 Posts

- Create new posts
- Edit existing posts
- Delete posts
- View individual posts
- View all posts
- Display:
  - Username
  - User ID
  - Post content
  - Featured image
  - Post status
- Navigate to the author's profile directly from a post

### 👤 User Profiles

- View user profiles
- View profile by user ID
- Profile picture
- Cover image
- Bio
- Address
- User's posts
- Edit profile
- Navigate between different users' profiles

### 💬 Comments

- Add comments to posts
- Display comments under posts
- Comment text support
- Comment image support
- Display comment author's profile
- Navigate from a comment to the author's profile
- Display comment actions such as:
  - Reply
  - Repost
  - Like
  - Views
  - Bookmark
  - Share

### 🖼️ Image Upload

Images are stored using Appwrite Storage.

Used for:

- Profile images
- Cover images
- Post featured images
- Comment images

### 🔄 Redux State Management

Redux Toolkit is used to manage application state.

Current slices include:

- Authentication
- Posts
- Profiles
- Comments

Example state structure:

```text
Redux Store
│
├── auth
│
├── post
│   ├── posts
│   ├── currentPost
│   └── loading
│
├── profile
│   ├── profiles
│   ├── currentProfile
│   └── loading
│
└── comment
    ├── comments
    ├── currentComment
    └── loading