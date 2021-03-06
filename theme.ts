import { color } from "react-native-reanimated";

const colors = {
  white: "#ffffff",
  black: "#000000",
  red: "#ff0000",
  grey_76: "#767577",
  grey_8e: "#8e8e93",
  grey_d1: "#d1d1d6",
  grey_e: "#e0e0e0",
  grey_f: "#f0f0f0",
  grey_f8: "#f8f8f8",
  grey_ae: "#aeaeb2",
  grey_a7: "#a7a7a7",
  grey_c7: "#c7c7cc",
  grey_c4: "#c4c4c4",
  grey_e5: "#e5e5ea",
  grey_f2: "#f2f2f7",
  theme: "#00a4b7",
  darkTheme: "#00bcd1",
  apple_grey: "rgba(60, 60, 67, 0.6)",
  grey_border: "rgba(0, 0, 0, 0.6)",
};

export const theme = {
  light: {
    background: colors.white,
    text: colors.black,
    errorText: colors.red,
    greyText: colors.apple_grey,
    tagBorder: colors.black,
    tagGrey: colors.grey_8e,
    tabBarGrey: colors.grey_ae,
    searchBarBackground: colors.grey_f2,
    searchBarPlaceholder: colors.grey_c7,
    dots: colors.black,

    greyBackgroundText: colors.grey_c7,

    imageBorder: colors.grey_e5,

    modalDragBar: colors.grey_c7,
    modalDragBarLight: colors.grey_d1,

    greyTextLight: colors.grey_ae,
    greyTextLighter: colors.grey_d1,
    greyTextAlone: colors.grey_8e,
    cameraButtonOutline: colors.white,

    switchTrackFalse: colors.grey_e5,

    greyBackground: colors.grey_f2,
    imageViewerBackground: colors.black,

    editSplacePlaceholder: colors.grey_ae,
    editSplaceOperationTimeDayIndicator: colors.grey_ae,

    editSplaceBreakDayRedBackground: colors.red,

    seriesHeaderGreyText: colors.grey_8e,

    passwordChangeGreyText: colors.grey_ae,
    editInfoGreyText: colors.grey_ae,

    imageBackground: colors.grey_e5,
    tabActive: colors.black,
    tabInactive: colors.black,
    searchedItemBorder: colors.grey_c4,

    textHighlight: colors.theme,
    borderHighlight: colors.theme,

    chatRoomItemBorder: colors.grey_c4,
    chatPreviewTextRead: colors.grey_ae,
    chatPreviewUnreadMark: colors.darkTheme,
    chatPreviewTimeText: colors.grey_ae,

    chatRoomBackground: colors.white,

    chatDateText: colors.grey_c7,

    myChatBubble: colors.darkTheme,
    otherChatBubble: colors.grey_f2,
    chatTimeText: colors.grey_c7,

    myChatText: colors.white,
    otherChatText: colors.black,

    chatEntryBorderTop: colors.grey_c4,
    chatEntryBackground: colors.white,
    chatEntryInputBackground: colors.grey_f2,
    chatEntryPlaceholder: colors.grey_a7,
    chatSelection: colors.theme,

    chatSendText: colors.theme,

    chatMemberSeperator: colors.grey_e5,
    chatMemberUsername: colors.black,
    chatMemberName: colors.grey_ae,

    searchHistorySeperator: colors.grey_e5,
    lightSeperator: colors.grey_e5,

    followButton: colors.darkTheme,
    followButtonText: colors.white,

    profileTabBarBorderBottom: colors.grey_ae,
    profileFocusedTabBorderBottom: colors.black,

    greyButton: colors.grey_e5,

    greyButtonContext: colors.black,

    entry: colors.grey_f2,
    entryPlaceholder: colors.grey_c7,
    entrySelection: colors.theme,

    chatInviteSelect: colors.grey_f2,
    chatInviteSelected: colors.darkTheme,
    chatInviteConfirmText: colors.theme,

    headerConfirmText: colors.theme,

    folderDeleteButtonBackground: colors.grey_e5,
    folderDeleteMinus: colors.black,
    folderNoticeBadgeBackground: colors.theme,
    blankFolderBackground: colors.grey_d1,

    addSaveSelectMarkBackground: colors.grey_f2,
    addSaveSelectMark: colors.darkTheme,

    folderMemberCount: colors.white,

    profileLink: colors.theme,
    editProfileSeperator: colors.grey_ae,
    editProfileTextGrey: colors.grey_8e,

    notificationSeperator: colors.grey_ae,

    modalHighlight: colors.theme,
    modalInputSubmitButton: colors.theme,
    modalEntry: colors.grey_ae,

    modalButtonRedText: colors.red,

    themeBackground: colors.darkTheme,

    white: colors.white,
    black: colors.black,
  },
  dark: {
    background: colors.white,
    text: colors.black,
    errorText: colors.red,
    theme: colors.theme,
    tabActive: colors.black,
    tabInactive: colors.black,
  },
};
