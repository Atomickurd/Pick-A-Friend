export type PostType = 'photo' | 'text' | 'event' | 'tip' | 'lost_alert' | 'adoption';

export type ReactionType = 'woof' | 'heart' | 'paw' | 'laugh' | 'wow';

export interface Post {
  id: string;
  authorUid: string;
  authorDogId: string;
  type: PostType;
  text: string;
  mediaURLs: string[];
  reactions: Record<ReactionType, number>;
  myReaction: ReactionType | null;
  commentCount: number;
  eventRef: string | null; // Event id if type === 'event'
  lostReportRef: string | null;
  adoptionDogRef: string | null;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Comment {
  id: string;
  postId: string;
  authorUid: string;
  authorDogId: string;
  text: string;
  createdAt: string;
}
