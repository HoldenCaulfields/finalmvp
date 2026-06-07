export interface Comment {
  id: number;
  postId?: string;
  author: string;
  avatar: string;
  text: string;
  time: string;
  createdAt?: string;
  userId?: string | null;
}

export interface Post {
  id: number;
  author: string;
  avatar: string;
  faculty: string;
  club?: string;
  image: string;
  caption: string;
  likes: number;
  likedUsers?: string[];
  commentsCount: number;
  comments: Comment[];
  time: string;
  liked?: boolean;
  tags: string[];
  userId?: string;
  createdAt?: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  photoUrl: string;
  faculty: string;
  joinDate: string;
}

export interface ContestEntry {
  id: string;
  contestId: "handsome_talented" | "cheerful_classroom";
  candidateName: string;
  caption: string;
  imageUrl: string;
  votes: number;
  votedUserIds: string[];
  userId: string;
  author: string;
  authorAvatar?: string;
  faculty?: string;
  createdAt?: string;
}

