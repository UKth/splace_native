import { gql } from "@apollo/client";

export const REQUEST_CERTIFICATE = gql`
  mutation createCertificate($phone: String!, $isRegister: Boolean!) {
    createCertificate(phone: $phone, isRegister: $isRegister) {
      ok
      error
    }
  }
`;

export const VERIFY_CERTIFICATE = gql`
  mutation checkCertificate($certificate: String!, $phone: String!) {
    checkCertificate(certificate: $certificate, phone: $phone) {
      ok
      error
      token
    }
  }
`;

export const VALIDATE_USERNAME = gql`
  query checkUsername($username: String!) {
    checkUsername(username: $username) {
      ok
      error
    }
  }
`;

export const CREATE_ACCOUNT = gql`
  mutation createAccount(
    $username: String!
    $password: String!
    $phone: String!
    $token: String!
    $marketingAgree: Boolean!
  ) {
    createAccount(
      username: $username
      password: $password
      phone: $phone
      token: $token
      marketingAgree: $marketingAgree
    ) {
      ok
      error
      token
      userId
    }
  }
`;

export const FIND_USERNAME = gql`
  query getUsername($token: String!) {
    getUsername(token: $token) {
      ok
      error
      username
    }
  }
`;

export const EDIT_PASSWORD = gql`
  mutation editPassword($token: String!, $password: String!) {
    editPassword(token: $token, password: $password) {
      ok
      error
    }
  }
`;

export const UPLOAD_PREFERENCE = gql`
  mutation createPreference($preference: [Int]!) {
    createPreference(preference: $preference) {
      ok
      error
    }
  }
`;

export const USER_FRAGMENT = gql`
  fragment UserFragment on User {
    id
    username
    name
    profileImageUrl
    isFollowing
    isMe
    isBlocked
    authority
  }
`;

export const MESSAGE_FRAGMENT = gql`
  fragment MessageFragment on Message {
    id
    text
    createdAt
    # author {
    #   ...UserFragment
    # }
  }
  ${USER_FRAGMENT}
`;

export const ROOM_FRAGMENT = gql`
  fragment RoomFragment on Chatroom {
    id
    title
    updatedAt
    createdAt
    members {
      isFollowing
      ...UserFragment
    }
    lastMessage {
      ...MessageFragment
    }
    chatroomReaded {
      id
      user {
        ...UserFragment
      }
      updatedAt
    }
  }
  ${USER_FRAGMENT}
  ${MESSAGE_FRAGMENT}
`;

export const SPLACE_FRAGMENT = gql`
  fragment SplaceFragment on Splace {
    id
    name
    address
    thumbnail
    lat
    lon
    activate
    detailAddress
    isSaved
    categories {
      id
      name
    }
    bigCategories {
      id
      name
    }
    ratingtags {
      id
      name
    }
  }
`;

export const FOLDER_FRAGMENT = gql`
  fragment FolderFragment on Folder {
    id
    title
    createdAt
    updatedAt
    members {
      ...UserFragment
    }
    saves {
      id
      createdAt
      splace {
        ...SplaceFragment
      }
    }
  }
  ${USER_FRAGMENT}
  ${SPLACE_FRAGMENT}
`;

export const SERIES_FRAGMENT = gql`
  fragment SeriesFragment on Series {
    id
    author {
      ...UserFragment
    }
    title
    seriesElements {
      id
      photolog {
        id
        imageUrls
      }
    }
    createdAt
    isPrivate
    isScraped
  }
  ${USER_FRAGMENT}
`;

export const LOG_FRAGMENT = gql`
  fragment LogFragment on Photolog {
    id
    photoSize
    text
    categories {
      id
      name
    }
    bigCategories {
      id
      name
    }
    totalLiked
    seriesElements {
      id
      series {
        title
        id
      }
    }
    imageUrls
    author {
      ...UserFragment
    }
    splace {
      ...SplaceFragment
    }
    isILiked
    createdAt
    isPrivate
    isScraped
  }
  ${USER_FRAGMENT}
  ${SPLACE_FRAGMENT}
`;

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      ok
      token
      user {
        id
      }
    }
  }
`;

export const GET_ME = gql`
  query getMe {
    getMe {
      ok
      error
      me {
        ...UserFragment
        email
        phone
        birthDay
        authority
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_FEED = gql`
  query getFeed($lastLogId: Int, $lastSeriesId: Int) {
    getFeed(lastLogId: $lastLogId, lastSeriesId: $lastSeriesId) {
      ok
      error
      logs {
        ...LogFragment
      }
      series {
        ...SeriesFragment
      }
    }
  }
  ${LOG_FRAGMENT}
  ${SERIES_FRAGMENT}
`;

export const GET_SERIES = gql`
  query getLogsBySeries($seriesId: Int!, $lastId: Int) {
    getLogsBySeries(seriesId: $seriesId, lastId: $lastId) {
      ok
      error
      seriesElements {
        id
        photolog {
          ...LogFragment
        }
      }
    }
  }
  ${LOG_FRAGMENT}
`;

export const GET_SERIES_INFO = gql`
  query seeSeries($seriesId: Int!) {
    seeSeries(seriesId: $seriesId) {
      ok
      error
      series {
        id
        title
        author {
          ...UserFragment
        }
        isPrivate
        createdAt
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const LIKE_PHOTOLOG = gql`
  mutation likePhotolog($photologId: Int!) {
    likePhotolog(photologId: $photologId) {
      ok
      error
    }
  }
`;

export const UNLIKE_PHOTOLOG = gql`
  mutation unlikePhotolog($photologId: Int!) {
    unlikePhotolog(photologId: $photologId) {
      ok
      error
    }
  }
`;

export const GET_PROFILE = gql`
  query seeProfile($userId: Int!) {
    seeProfile(userId: $userId) {
      ok
      error
      profile {
        url
        profileMessage
        totalFollowers
        totalFollowing
        totalLogsNumber
        unreadChatExist
        authority
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_NOTIFICATIONS = gql`
  query getMyActivityLogs {
    getMyActivityLogs {
      ok
      error
      followLogs {
        id
        requestUser {
          id
          username
          profileImageUrl
          isFollowing
        }
        createdAt
        updatedAt
      }
      editFolderLogs {
        id
        target {
          id
          title
        }
        requestUser {
          id
          username
          profileImageUrl
        }
        createdAt
        updatedAt
      }
      likeLogs {
        id
        requestUser {
          id
          username
          profileImageUrl
        }
        target {
          id
          imageUrls
        }
        createdAt
        updatedAt
      }
    }
  }
`;

export const GET_FOLLOWERS = gql`
  query seeFollowers($userId: Int!, $keyword: String, $lastId: Int) {
    seeFollowers(userId: $userId, keyword: $keyword, lastId: $lastId) {
      ok
      error
      followers {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const GET_FOLLOWINGS = gql`
  query seeFollowings($userId: Int!, $keyword: String, $lastId: Int) {
    seeFollowings(userId: $userId, keyword: $keyword, lastId: $lastId) {
      ok
      error
      followings {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const FOLLOW = gql`
  mutation followUser($targetId: Int!) {
    followUser(targetId: $targetId) {
      ok
      error
    }
  }
`;

export const UNFOLLOW = gql`
  mutation unfollowUser($targetId: Int!) {
    unfollowUser(targetId: $targetId) {
      ok
      error
    }
  }
`;

export const GET_ROOMS = gql`
  query getMyRooms($lastId: Int) {
    getMyRooms(lastId: $lastId) {
      ok
      error
      myRooms {
        ...RoomFragment
      }
    }
  }
  ${USER_FRAGMENT}
  ${ROOM_FRAGMENT}
`;

export const GET_MESSAGES = gql`
  query getRoomMessages($chatroomId: Int!) {
    getRoomMessages(chatroomId: $chatroomId) {
      id
      ok
      error
      messages {
        id
        text
        author {
          id
          username
          name
        }
        createdAt
        isMine
      }
    }
  }
`;

export const SEND_MESSAGE = gql`
  mutation sendMessage($text: String!, $chatroomId: Int!) {
    sendMessage(text: $text, chatroomId: $chatroomId) {
      ok
      error
      message {
        id
        text
        author {
          ...UserFragment
        }
        createdAt
        isMine
      }
      readedRecord {
        id
        updatedAt
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const CREATE_ROOM = gql`
  mutation createChatroom(
    $title: String!
    $memberIds: [Int]!
    $isPersonal: Boolean!
  ) {
    createChatroom(
      title: $title
      memberIds: $memberIds
      isPersonal: $isPersonal
    ) {
      ok
      error
      chatroom {
        ...RoomFragment
      }
    }
  }
  ${ROOM_FRAGMENT}
`;

export const READ_ROOM = gql`
  mutation readChatroom($chatroomId: Int!) {
    readChatroom(chatroomId: $chatroomId) {
      ok
      error
    }
  }
`;

export const GET_ROOM_INFO = gql`
  query getRoomInfo($chatroomId: Int!) {
    getRoomInfo(chatroomId: $chatroomId) {
      ok
      error
      room {
        id
        title
        members {
          ...UserFragment
        }
        createdAt
        updatedAt
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const NEW_MESSAGE = gql`
  subscription newMessage($chatroomId: Int!) {
    newMessage(chatroomId: $chatroomId) {
      id
      text
      author {
        ...UserFragment
      }
      createdAt
      isMine
    }
  }
  ${USER_FRAGMENT}
`;

export const ROOM_UPDATE = gql`
  subscription chatroomUpdated {
    chatroomUpdated {
      id
      title
      members {
        ...UserFragment
      }
      lastMessage {
        id
        text
        createdAt
      }
      updatedAt
    }
  }
  ${USER_FRAGMENT}
`;

export const EDIT_ROOM_TITLE = gql`
  mutation editChatroom($title: String!, $chatroomId: Int!) {
    editChatroom(title: $title, chatroomId: $chatroomId) {
      ok
      error
    }
  }
`;

export const LEAVE_ROOM = gql`
  mutation quitChatroom($chatroomId: Int!) {
    quitChatroom(chatroomId: $chatroomId) {
      ok
      error
    }
  }
`;

export const ADD_ROOM_MEMBERS = gql`
  mutation addChatMembers($chatroomId: Int!, $memberIds: [Int]!) {
    addChatMembers(chatroomId: $chatroomId, memberIds: $memberIds) {
      ok
      error
    }
  }
`;

export const GET_PERSONAL_CHATROOM = gql`
  mutation getPersonalChatroom($targetId: Int!) {
    getPersonalChatroom(targetId: $targetId) {
      ok
      error
      chatroom {
        ...RoomFragment
      }
    }
  }
  ${ROOM_FRAGMENT}
`;

export const GET_OWNER_CHATROOM = gql`
  mutation getOwnerChatroom($splaceId: Int!) {
    getOwnerChatroom(splaceId: $splaceId) {
      ok
      error
      chatroom {
        ...RoomFragment
      }
    }
  }
  ${ROOM_FRAGMENT}
`;

export const CREATE_FOLDER = gql`
  mutation createFolder($title: String!) {
    createFolder(title: $title) {
      ok
      error
    }
  }
`;

export const DELETE_FOLDER = gql`
  mutation deleteFolder($folderId: Int!) {
    deleteFolder(folderId: $folderId) {
      ok
      error
    }
  }
`;

export const LEAVE_FOLDER = gql`
  mutation quitFolder($folderId: Int!) {
    quitFolder(folderId: $folderId) {
      ok
      error
    }
  }
`;

export const ADD_FOLDER_MEMBERS = gql`
  mutation addFolderMembers($folderId: Int!, $memberIds: [Int]!) {
    addFolderMembers(folderId: $folderId, memberIds: $memberIds) {
      ok
      error
    }
  }
`;

export const GET_FOLDERS = gql`
  query getFolders($lastId: Int, $orderBy: String!) {
    getFolders(lastId: $lastId, orderBy: $orderBy) {
      ok
      error
      folders {
        ...FolderFragment
      }
    }
  }
  ${FOLDER_FRAGMENT}
`;

export const GET_FOLDER_INFO = gql`
  query seeFolder($folderId: Int!) {
    seeFolder(folderId: $folderId) {
      ok
      error
      folder {
        ...FolderFragment
      }
    }
  }
  ${FOLDER_FRAGMENT}
`;

export const REMOVE_SAVE = gql`
  mutation removeSave($saveId: Int!, $folderId: Int!) {
    removeSave(saveId: $saveId, folderId: $folderId) {
      ok
      error
    }
  }
`;

export const CREATE_LOG = gql`
  mutation uploadLog(
    $imageUrls: [String]!
    $photoSize: Int!
    $text: String
    $splaceId: Int
    $seriesIds: [Int]!
    $categories: [String]!
    $bigCategoryIds: [Int]!
    $isPrivate: Boolean!
    $splaceThumbnail: String
  ) {
    uploadLog(
      imageUrls: $imageUrls
      photoSize: $photoSize
      text: $text
      splaceId: $splaceId
      seriesIds: $seriesIds
      categories: $categories
      bigCategoryIds: $bigCategoryIds
      isPrivate: $isPrivate
      splaceThumbnail: $splaceThumbnail
    ) {
      ok
      error
    }
  }
`;

export const REMOVE_LOG = gql`
  mutation deletePhotolog($photologId: Int!) {
    deletePhotolog(photologId: $photologId) {
      ok
      error
    }
  }
`;

export const HIDE_LOG = gql`
  mutation hidePhotologs($targetId: Int!) {
    hidePhotologs(targetId: $targetId) {
      ok
      error
    }
  }
`;

export const SCRAP_LOG = gql`
  mutation scrapLog($photologId: Int!) {
    scrapLog(photologId: $photologId) {
      ok
      error
    }
  }
`;
export const UNSCRAP_LOG = gql`
  mutation unscrapLog($scrapedLogId: Int!) {
    unscrapLog(scrapedLogId: $scrapedLogId) {
      ok
      error
    }
  }
`;

export const EDIT_LOG = gql`
  mutation editPhotolog($photologId: Int!, $text: String, $isPrivate: Boolean) {
    editPhotolog(photologId: $photologId, text: $text, isPrivate: $isPrivate) {
      ok
      error
    }
  }
`;

export const GET_USER_LOGS = gql`
  query getUserLogs($userId: Int!, $lastId: Int) {
    getUserLogs(userId: $userId, lastId: $lastId) {
      ok
      error
      logs {
        ...LogFragment
      }
    }
  }
  ${LOG_FRAGMENT}
`;

export const GET_LOG = gql`
  query seePhotolog($photologId: Int!) {
    seePhotolog(photologId: $photologId) {
      ok
      error
      log {
        ...LogFragment
      }
    }
  }
  ${LOG_FRAGMENT}
`;

export const GET_RECOMMENDED_LOG = gql`
  query getSuggestLogs {
    getSuggestLogs {
      ok
      error
      logs {
        ...LogFragment
      }
    }
  }
  ${LOG_FRAGMENT}
`;

export const GET_SCRAPPED_LOGS = gql`
  query getMyScrapedLog {
    getMyScrapedLog {
      ok
      error
      logs {
        ...LogFragment
      }
    }
  }
  ${LOG_FRAGMENT}
`;

export const SCRAP_SERIES = gql`
  mutation scrapSeries($seriesId: Int!) {
    scrapSeries(seriesId: $seriesId) {
      ok
      error
    }
  }
`;
export const UNSCRAP_SERIES = gql`
  mutation unscrapSeries($scrapedSeriesId: Int!) {
    unscrapSeries(scrapedSeriesId: $scrapedSeriesId) {
      ok
      error
    }
  }
`;

export const GET_SCRAPPED_SERIES = gql`
  query getMyScrapedSeries {
    getMyScrapedSeries {
      ok
      error
      series {
        ...SeriesFragment
      }
    }
  }
  ${SERIES_FRAGMENT}
`;

export const GET_LOGS_BY_BIGCATEGORY = gql`
  query getLogsByBigCategory($tagId: Int!, $lastId: Int) {
    getLogsByBigCategory(tagId: $tagId, lastId: $lastId) {
      ok
      error
      logs {
        ...LogFragment
      }
    }
  }
  ${LOG_FRAGMENT}
`;

export const GET_LOGS_BY_CATEGORY = gql`
  query getLogsByCategory($tagId: Int!, $lastId: Int) {
    getLogsByCategory(tagId: $tagId, lastId: $lastId) {
      ok
      error
      logs {
        ...LogFragment
      }
    }
  }
  ${LOG_FRAGMENT}
`;

export const GET_RECOMMENDED_CATEGORIES = gql`
  query suggestTags {
    suggestTags {
      ok
      error
      ratingtags {
        id
        name
      }
      bigCategories {
        id
        name
      }
    }
  }
`;

export const GET_USER_SERIES = gql`
  query getUserSeries($userId: Int!, $lastId: Int) {
    getUserSeries(userId: $userId, lastId: $lastId) {
      ok
      error
      series {
        ...SeriesFragment
      }
    }
  }
  ${SERIES_FRAGMENT}
`;

export const CREATE_SERIES = gql`
  mutation createSeries(
    $title: String!
    $isPrivate: Boolean!
    $photologIds: [Int]!
  ) {
    createSeries(
      title: $title
      isPrivate: $isPrivate
      photologIds: $photologIds
    ) {
      ok
      error
    }
  }
`;

export const EDIT_SERIES = gql`
  mutation editSeries($seriesId: Int!, $title: String!, $photologIds: [Int]!) {
    editSeries(seriesId: $seriesId, title: $title, photologIds: $photologIds) {
      ok
      error
    }
  }
`;

export const REMOVE_SERIES = gql`
  mutation deleteSeries($seriesId: Int!) {
    deleteSeries(seriesId: $seriesId) {
      ok
      error
    }
  }
`;

export const HIDE_SERIES = gql`
  mutation hideSeries($targetId: Int!) {
    hideSeries(targetId: $targetId) {
      ok
      error
    }
  }
`;

export const GET_MY_SPLACE = gql`
  query getMySplace {
    getMySplace {
      ok
      error
      splaces {
        ...SplaceFragment
      }
    }
  }
  ${SPLACE_FRAGMENT}
`;

export const QUIT_SPLACE_OWNER = gql`
  mutation quitOwner($splaceId: Int!) {
    quitOwner(splaceId: $splaceId) {
      ok
      error
    }
  }
`;

export const EDIT_PROFILE = gql`
  mutation editProfile(
    $name: String
    $username: String
    $profileMessage: String
    $profileImageUrl: String
    $url: String
  ) {
    editProfile(
      name: $name
      username: $username
      profileMessage: $profileMessage
      profileImageUrl: $profileImageUrl
      url: $url
    ) {
      ok
      error
    }
  }
`;

export const EDIT_MY_INFO = gql`
  mutation editProfile($email: String, $birthDay: String) {
    editProfile(email: $email, birthDay: $birthDay) {
      ok
      error
    }
  }
`;

export const EDIT_FOLDER = gql`
  mutation editFolder($folderId: Int!, $title: String!) {
    editFolder(folderId: $folderId, title: $title) {
      ok
      error
    }
  }
`;

export const CHANGE_PASSWORD = gql`
  mutation editPasswordWithLogin($password: String!, $newPassword: String!) {
    editPasswordWithLogin(password: $password, newPassword: $newPassword) {
      ok
      error
    }
  }
`;

export const ADD_SAVES = gql`
  mutation addSaves($splaceIds: [Int]!, $folderId: Int!) {
    addSaves(splaceIds: $splaceIds, folderId: $folderId) {
      ok
      error
    }
  }
`;

export const BLOCK = gql`
  mutation blockUser($targetId: Int!) {
    blockUser(targetId: $targetId) {
      ok
      error
    }
  }
`;

export const UNBLOCK = gql`
  mutation unblockUser($targetId: Int!) {
    unblockUser(targetId: $targetId) {
      ok
      error
    }
  }
`;

export const GET_BLOCKED_USER = gql`
  query getMyBlockedUser {
    getMyBlockedUser {
      ok
      error
      users {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

export const REPORT = gql`
  mutation reportResources(
    $sourceType: String!
    $sourceId: Int
    $reason: String
  ) {
    reportResources(
      sourceType: $sourceType
      sourceId: $sourceId
      reason: $reason
    ) {
      ok
      error
    }
  }
`;

export const DELETE_ACCOUNT = gql`
  mutation deleteAccount {
    deleteAccount {
      ok
      error
    }
  }
`;

export const UPLOAD_MOMENT = gql`
  mutation uploadMoment(
    $splaceId: Int
    $videoUrl: String!
    $text: String!
    $title: String!
    $thumbnail: String!
  ) {
    uploadMoment(
      splaceId: $splaceId
      videoUrl: $videoUrl
      text: $text
      title: $title
      thumbnail: $thumbnail
    ) {
      ok
      error
    }
  }
`;

export const GET_MOMENTS = gql`
  query getMyMoments($lastId: Int) {
    getMyMoments(lastId: $lastId) {
      ok
      error
      moments {
        id
        text
        title
        author {
          ...UserFragment
        }
        videoUrl
        createdAt
        updatedAt
        splace {
          ...SplaceFragment
        }
        thumbnail
      }
    }
  }
  ${USER_FRAGMENT}
  ${SPLACE_FRAGMENT}
`;

export const GET_SPLACE_INFO = gql`
  query seeSplace($splaceId: Int!) {
    seeSplace(splaceId: $splaceId) {
      ok
      error
      splace {
        ...SplaceFragment
        owner {
          ...UserFragment
        }
        parking
        pets
        noKids
        intro
        url
        phone
        breakDays
        holidayBreak
        timeSets {
          id
          day
          open
          close
          breakOpen
          breakClose
          createdAt
          updatedAt
        }
        itemName
        itemPrice
        menuUrls
        totalPhotologs
        fixedContents {
          id
          title
          imageUrls
          createdAt
          updatedAt
          photoSize
          text
        }
      }
    }
  }
  ${SPLACE_FRAGMENT}
  ${USER_FRAGMENT}
`;

export const GET_SPLACE_BY_KAKAOID = gql`
  mutation getSplaceByKakao(
    $kakaoId: Int!
    $keyword: String!
    $x: Float
    $y: Float
  ) {
    getSplaceByKakao(kakaoId: $kakaoId, keyword: $keyword, x: $x, y: $y) {
      ok
      error
      splace {
        id
        name
        address
        thumbnail
        lat
        lon
        bigCategories {
          id
          name
        }
        ratingtags {
          id
          name
        }
        activate
      }
    }
  }
`;

export const GET_LOGS_BY_SPLACE = gql`
  query getLogsBySplace($splaceId: Int!, $orderBy: String!, $lastId: Int) {
    getLogsBySplace(splaceId: $splaceId, orderBy: $orderBy, lastId: $lastId) {
      ok
      error
      logs {
        ...LogFragment
      }
    }
  }
  ${LOG_FRAGMENT}
`;

export const CREATE_SPLACE = gql`
  mutation createSplaces(
    $name: String!
    $lat: Float!
    $lon: Float!
    $detailAddress: String
  ) {
    createSplaces(
      name: $name
      lat: $lat
      lon: $lon
      detailAddress: $detailAddress
    ) {
      ok
      error
      splace {
        id
        name
        address
        thumbnail
        lat
        lon
        activate
        detailAddress
      }
    }
  }
`;

export const EDIT_SPLACE = gql`
  mutation editSplaces(
    $splaceId: Int!
    $name: String
    $phone: String
    $url: String
    $itemName: String
    $itemPrice: Int
    $menuUrls: [String]
    $intro: String
    $detailAddress: String
    $parking: Boolean
    $pets: Boolean
    $noKids: Boolean
    $thumbnail: String
    $categories: [String]
    $bigCategoryIds: [Int]
  ) {
    editSplaces(
      splaceId: $splaceId
      name: $name
      phone: $phone
      url: $url
      itemName: $itemName
      itemPrice: $itemPrice
      menuUrls: $menuUrls
      intro: $intro
      detailAddress: $detailAddress
      parking: $parking
      pets: $pets
      noKids: $noKids
      thumbnail: $thumbnail
      categories: $categories
      bigCategoryIds: $bigCategoryIds
    ) {
      ok
      error
    }
  }
`;

export const EDIT_SPLACE_TIMESETS = gql`
  mutation editTimeSets(
    $splaceId: Int!
    $breakDays: [Int]!
    $sun: [Int]!
    $mon: [Int]!
    $tue: [Int]!
    $wed: [Int]!
    $thr: [Int]!
    $fri: [Int]!
    $sat: [Int]!
    $holidayBreak: Boolean!
  ) {
    editTimeSets(
      splaceId: $splaceId
      breakDays: $breakDays
      sun: $sun
      mon: $mon
      tue: $tue
      wed: $wed
      thr: $thr
      fri: $fri
      sat: $sat
      holidayBreak: $holidayBreak
    ) {
      ok
      error
    }
  }
`;

export const SEARCH_SPLACE = gql`
  query searchSplaces(
    $lastId: Int
    $type: String!
    $keyword: String!
    $lat: Float
    $lon: Float
    $distance: Int
    $bigCategoryIds: [Int]
    $ratingtagIds: [Int]
    $exceptNoKids: Boolean
    $parking: Boolean
    $pets: Boolean
  ) {
    searchSplaces(
      lastId: $lastId
      type: $type
      keyword: $keyword
      lat: $lat
      lon: $lon
      distance: $distance
      bigCategoryIds: $bigCategoryIds
      ratingtagIds: $ratingtagIds
      exceptNoKids: $exceptNoKids
      parking: $parking
      pets: $pets
    ) {
      ok
      error
      searchedSplaces {
        id
        address
        bigCategories
        stringBC
        location
        name
        thumbnail
        isSaved
      }
    }
  }
`;

export const GET_SPLACES_BY_RATINGTAG = gql`
  query getSplacesByRatingtag($tagId: Int!, $lastId: Int) {
    getSplacesByRatingtag(tagId: $tagId, lastId: $lastId) {
      ok
      error
      splaces {
        ...SplaceFragment
      }
    }
  }
  ${SPLACE_FRAGMENT}
`;

export const CREATE_CONTENT = gql`
  mutation createContents(
    $splaceId: Int!
    $title: String!
    $text: String
    $imageUrls: [String] # $photoSize: Int
    $photoSize: Int!
  ) {
    createContents(
      splaceId: $splaceId
      title: $title
      text: $text
      imageUrls: $imageUrls # photoSize: $photoSize
      photoSize: $photoSize
    ) {
      ok
      error
    }
  }
`;

export const EDIT_CONTENT = gql`
  mutation editContents(
    $title: String!
    $text: String
    $fixedContentId: Int!
    $splaceId: Int!
  ) {
    editContents(
      title: $title
      text: $text
      fixedContentId: $fixedContentId
      splaceId: $splaceId
    ) {
      ok
      error
    }
  }
`;

export const REGISTER_OWNER = gql`
  mutation getOwnerAuthority(
    $splaceId: Int!
    $birthDay: String!
    $name: String!
    $corpNum: String!
    $imageUrls: [String]
  ) {
    getOwnerAuthority(
      splaceId: $splaceId
      birthDay: $birthDay
      name: $name
      corpNum: $corpNum
      imageUrls: $imageUrls
    ) {
      ok
      error
    }
  }
`;

export const GET_BIGCATEGORIES = gql`
  query getBigCategories {
    getBigCategories {
      ok
      error
      bigCategories {
        id
        name
      }
    }
  }
`;

export const RATE_SPLACE = gql`
  mutation createSplaceRating($splaceId: Int!, $rating: Int!) {
    createSplaceRating(splaceId: $splaceId, rating: $rating) {
      ok
      error
    }
  }
`;

export const SEARCH_CATEGORY = gql`
  query searchCategories($keyword: String!, $lastId: Int) {
    searchCategories(keyword: $keyword, lastId: $lastId) {
      ok
      error
      categories {
        id
        name
        totalPhotologs
      }
      bigCategories {
        id
        name
        totalPhotologs
      }
    }
  }
`;

export const SEARCH_USER = gql`
  query searchUsers($keyword: String!) {
    searchUsers(keyword: $keyword) {
      ok
      error
      users {
        ...UserFragment
      }
    }
  }
  ${USER_FRAGMENT}
`;

////////

export const LOG_GETSERIES = gql`
  mutation logSeeSeries($seriesId: Int!) {
    logSeeSeries(seriesId: $seriesId) {
      ok
      error
    }
  }
`;

export const LOG_GETLOGSBYSERIES = gql`
  mutation logGetLogsBySeries($seriesId: Int!) {
    logGetLogsBySeries(seriesId: $seriesId) {
      ok
      error
    }
  }
`;
export const LOG_GETLOGSBYSPLACE = gql`
  mutation logGetLogsBySplace($splaceId: Int!) {
    logGetLogsBySplace(splaceId: $splaceId) {
      ok
      error
    }
  }
`;

export const LOG_GETSPLACEINFO = gql`
  mutation logSeeSplace($splaceId: Int!) {
    logSeeSplace(splaceId: $splaceId) {
      ok
      error
    }
  }
`;

export const LOG_GETPHOTOLOG = gql`
  mutation logSeePhotolog($photologId: Int) {
    logSeePhotolog(photologId: $photologId) {
      ok
      error
    }
  }
`;

/////

export const LOG_GETLOGSBYBIGCATEGORIES = gql`
  mutation logGetLogsByBigCategory($tagId: Int!) {
    logGetLogsByBigCategory(tagId: $tagId) {
      ok
      error
    }
  }
`;

export const LOG_GETLOGSBYCATEGORIES = gql`
  mutation logGetLogsByCategory($tagId: Int!) {
    logGetLogsByCategory(tagId: $tagId) {
      ok
      error
    }
  }
`;

export const LOG_GETSPLACESBYRATINGTAG = gql`
  mutation logGetSplacesByRatingtag($tagId: Int!) {
    logGetSplacesByRatingtag(tagId: $tagId) {
      ok
      error
    }
  }
`;
//
export const LOG_SEARCHCATEORIES = gql`
  mutation logSearchCategories($keyword: String!) {
    logSearchCategories(keyword: $keyword) {
      ok
      error
    }
  }
`;

export const LOG_SEARCHSPLACES = gql`
  mutation logSearchSplaces($keyword: String!) {
    logSearchSplaces(keyword: $keyword) {
      ok
      error
    }
  }
`;
