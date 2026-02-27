export type MessageType = 'text' | 'image' | 'event_invite' | 'playdate_request';

export interface MessageChannel {
  id: string;
  participantUids: string[];
  participantDogIds: string[];
  lastMessage: string;
  lastMessageAt: string;
  unreadCounts: Record<string, number>; // uid → unread count
  isPremiumRequired: boolean;
  createdAt: string;
}

export interface Message {
  id: string;
  channelId: string;
  senderUid: string;
  type: MessageType;
  text: string;
  imageURL: string | null;
  eventRef: string | null;
  isRead: boolean;
  createdAt: string;
}
