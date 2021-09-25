/**
 * Learn more about using TypeScript with React Navigation:
 * https://reactnavigation.org/docs/typescript/
 */

import {
  ApolloCache,
  DefaultContext,
  MutationFunctionOptions,
  OperationVariables,
} from "@apollo/client";
import { Text } from "react-native";

export type AuthStackParamList = {
  LogIn: undefined;
  SignUp: undefined;
};

export type SplaceType = {
  id: number;
  name: string;
  address: string;
  thumbnail?: string;
};

export type UserType = {
  id: number;
  username: string;
  name: string;
  email: string;
  password: string;
  profileMessage: string;
  profileImageUrl: string;
  folders: any[];
  joinedAt: string;
  updatedAt: string;
  followers: UserType[];
  followings: UserType[];
  photologs: PhotologType[];
  likedPhotologs: PhotologType[];
  totalFollowing: number;
  totalFollowers: number;
  isMe: boolean;
  isFollowing: boolean;
  totalLogsNumber: number;
  phone: string;
  url: string;
};

export type SaveType = {
  id: number;
  createdAt: string;
  splace: SplaceType;
};

export type FolderType = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  members: UserType[];
  saves: SaveType[];
};

export type StackGeneratorParamList = {
  Mainfeed: undefined;
  Search: undefined;
  Saved: undefined;
  Market: undefined;
  Moment: undefined;
  MomentView: undefined;
  Splace: {
    splace: {
      id: number;
      name: string; //
      market: boolean; //
    };
  };
  Profile: {
    user: {
      id: number;
    };
  };
  Series: { id: number };
  Payment: undefined;
  Chatroom: {
    room: RoomType;
  };
  Chatrooms: undefined;
  Members: {
    vars: any;
    membersData: any;
    refetchMembers: any;
    inviteMutation: any;
    leaveMutation: any;
  };
  AddMembers: {
    vars: any;
    members: UserType[];
    inviteMutation: any;
    // (
    //   options?:
    //     | MutationFunctionOptions<
    //         {
    //           addChatMembers: { ok: boolean; error: string };
    //         },
    //         OperationVariables,
    //         DefaultContext,
    //         ApolloCache<any>
    //       >
    //     | undefined
    // ) => Promise<any>;
  };
  Folders: undefined;
  Folder: { folder: FolderType };
};

export interface StackGeneratorProps {
  screenName: string;
}

export type HashTagType = {
  id: number;
  name: string;
};

export type RoomType = {
  id: number;
  title: string;
  members: UserType[];
  lastMessage: MessageType;
  updatedAt: string;
  createdAt: string;
  chatroomReaded: {
    id: number;
    user: UserType;
    chatroom: RoomType;
    readedAt: string;
  }[];
};

export type MessageType = {
  author: UserType;
  createdAt: string;
  isMine: boolean;
  id: number;
  text: string;
  unreadCount: number;
};

// export type PhotologThumbnailType = {
//   id: number;
//   splace: {

//   }
// }

export type CardBoxPropType = {
  title: string;
  url: string;
  index: number;
  data: any[];
};

export type PhotologType = {
  id: number;
  photoSize: number;
  imageUrls: string[];
  author: UserType;
  text: string;
  hashtags: HashTagType[];
  splace: {
    id: number;
    name: string;
    address: string;
    hashtags: HashTagType[];
  };
  liked: any[];
  totalLiked: number;
  series: {
    id: number;
    title: string;
  }[];
  isILiked: boolean;
  createdAt: string;
};

export type SeriesType = {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
  author: UserType;
  photologs: PhotologType[];
};

export type BottomTabParamList = {
  Mainfeed: undefined;
  Search: undefined;
  Saved: undefined;
  Market: undefined;
  Moment: undefined;
};

export type themeType = {
  background: string;
  text: string;
  errorText: string;
  greyText: string;
  tagBorder: string;
  tagGreyBorder: string;
  tabBarGrey: string;
  searchBarBackground: string;
  searchBarPlaceholder: string;
  dots: string;

  imageBackground: string;
  tabActive: string;
  tabInactive: string;
  searchedItemBorder: string;

  ratingTag: string;
  textHighlight: string;

  chatRoomItemBorder: string;
  chatPreviewTextRead: string;
  chatPreviewUnreadMark: string;
  chatPreviewTimeText: string;
  searchHistorySeperator: string;

  chatRoomBackground: string;

  chatDateText: string;

  myChatBubble: string;
  otherChatBubble: string;
  chatTimeText: string;

  myChatText: string;
  otherChatText: string;

  chatEntryBorderTop: string;
  chatEntryBackground: string;
  chatEntryInputBackground: string;
  chatEntryPlaceholder: string;
  chatSelection: string;

  chatSendText: string;

  chatMemberSeperator: string;
  chatMemberUsername: string;
  chatMemberName: string;
  followButton: string;
  followButtonText: string;

  greyButton: string;
  greyButtonContext: string;

  entry: string;
  entryPlaceholder: string;

  chatInviteSelect: string;
  chatInviteSelected: string;
  chatInviteConfirmText: string;
  headerConfirmText: string;

  folderDeleteButtonBackground: string;
  folderNoticeBadgeBackground: string;
  folderDeleteMinus: string;

  white: string;
};
