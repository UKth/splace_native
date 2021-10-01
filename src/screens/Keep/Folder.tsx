import React, { useContext, useEffect, useState } from "react";
import { Alert, FlatList, Text, View } from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import ScreenContainer from "../../components/ScreenContainer";

import Image from "../../components/Image";
import {
  FolderType,
  SaveType,
  StackGeneratorParamList,
  themeType,
} from "../../types";
import { RouteProp, useNavigation } from "@react-navigation/core";
import { HeaderBackButton, StackNavigationProp } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import {
  DeleteButton,
  EditButtonsContainer,
  Item,
  Minus,
  NewFolderButton,
  SortButton,
} from "../../components/Folder";
import {
  BldText13,
  BldText20,
  RegText13,
  RegText20,
} from "../../components/Text";
import { pixelScaler, strCmpFunc } from "../../utils";
import { HeaderRightMenu } from "../../components/HeaderRightMenu";
import BottomSheetModal from "../../components/BottomSheetModal";
import ModalButtonBox from "../../components/ModalButtonBox";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import { Splace } from "..";
import {
  ADD_FOLDER_MEMBERS,
  GET_FOLDER_INFO,
  LEAVE_FOLDER,
  REMOVE_SAVE,
} from "../../queries";
import { useMutation, useQuery } from "@apollo/client";

const SaveItemContainer = styled.View`
  width: ${pixelScaler(170)}px;
  height: ${pixelScaler(225)}px;
  align-items: center;
`;

const InfoContainer = styled.View`
  width: ${pixelScaler(145)}px;
  margin-top: ${pixelScaler(15)}px;
`;

const BadgesContainer = styled.View`
  flex-direction: row;
  margin-top: ${pixelScaler(12)}px;
`;

const AddressBadge = styled.TouchableOpacity`
  border-width: ${pixelScaler(0.7)}px;
  height: ${pixelScaler(20)}px;
  width: ${pixelScaler(74)}px;
  align-items: center;
  justify-content: center;
  margin-right: ${pixelScaler(10)}px;
`;

const Category = styled.TouchableOpacity`
  border-width: ${pixelScaler(0.7)}px;
  height: ${pixelScaler(20)}px;
  padding: 0 ${pixelScaler(10)}px;
  border-radius: ${pixelScaler(20)}px;
  justify-content: center;
`;

const FloatingMapButton = styled.TouchableOpacity`
  position: absolute;
  right: ${pixelScaler(15)}px;
  bottom: ${pixelScaler(15)}px;
  width: ${pixelScaler(60)}px;
  height: ${pixelScaler(60)}px;
  border-radius: ${pixelScaler(60)}px;
  background-color: ${({ theme }: { theme: themeType }) => theme.background};
  box-shadow: 0 4px 4px rgba(0, 0, 0, 0.25);
  align-items: center;
  justify-content: center;
  z-index: 0;
`;

const SaveItem = ({
  save,
  folderId,
  index,
  editing,
  refetch,
}: {
  save: any;
  folderId: number;
  index: number;
  editing: boolean;
  refetch: () => void;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const onDeleteCompleted = (data: {
    removeSave: {
      ok: boolean;
      error: string;
    };
  }) => {
    const {
      removeSave: { ok, error },
    } = data;
    if (ok) {
      Alert.alert("삭제되었습니다.\n", error);
      refetch();
    } else {
      Alert.alert("삭제에 실패했습니다.\n", error);
    }
  };

  const [deleteMutation, { loading: deleteMutationLoading }] = useMutation(
    REMOVE_SAVE,
    {
      onCompleted: onDeleteCompleted,
    }
  );

  return (
    <SaveItemContainer>
      {editing ? (
        <DeleteButton
          onPress={() => {
            deleteMutation({
              variables: {
                saveId: save.id,
                folderId,
              },
            });
          }}
        >
          <Minus />
        </DeleteButton>
      ) : null}
      <Item
        onPress={() => {
          navigation.push("Splace", {
            splace: save.splace,
          });
        }}
      >
        <Image
          source={{
            uri: save.splace.thumbnail,
          }}
          style={{
            width: pixelScaler(145),
            height: pixelScaler(145),
            borderRadius: pixelScaler(10),
          }}
        />
      </Item>
      <InfoContainer>
        <BldText13>{save.splace.name}</BldText13>
        <BadgesContainer>
          <AddressBadge>
            <RegText13>{save.splace.address}</RegText13>
          </AddressBadge>
          <Category>
            <RegText13>{"카테고리"}</RegText13>
          </Category>
        </BadgesContainer>
      </InfoContainer>
    </SaveItemContainer>
  );
};

const Folder = ({
  route,
}: {
  route: RouteProp<StackGeneratorParamList, "Folder">;
}) => {
  const [editing, setEditing] = useState<boolean>(false);
  const [sortMode, setSortMode] = useState<"generated" | "name">("generated");
  const theme = useContext<themeType>(ThemeContext);
  const [folder, setFolder] = useState<FolderType>(route.params.folder);
  const [modalVisible, setModalVisible] = useState<boolean>(false);

  const [saves, setSaves] = useState<SaveType[]>([]);

  useEffect(() => {
    if (sortMode === "generated") {
      setSaves(
        [...folder.saves].sort(
          (a: SaveType, b: SaveType) =>
            Number(b.createdAt) - Number(a.createdAt)
        )
      );
    } else {
      setSaves(
        [...folder.saves].sort((a: SaveType, b: SaveType) =>
          strCmpFunc(a.splace.name, b.splace.name)
        )
      );
    }
  }, [sortMode, folder]);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();
  useEffect(() => {
    navigation.setOptions({
      title: folder.title,
      headerRight: () =>
        editing ? (
          <HeaderRightConfirm
            onPress={() => {
              setEditing(false);
            }}
          />
        ) : (
          <HeaderRightMenu
            onPress={() => {
              setModalVisible(true);
            }}
          />
        ),
    });
  }, [editing]);

  const [refreshing, setRefreshing] = useState<boolean>(false);

  const onInviteCompleted = (data: {
    addFolderMembers: {
      ok: boolean;
      error: string;
    };
  }) => {
    const {
      addFolderMembers: { ok, error },
    } = data;
    if (ok) {
      navigation.pop();
    } else {
      // console.log(data);
      Alert.alert("초대에 실패하였습니다.\n", error);
    }
  };

  const [inviteMutation, { loading: inviteMutationLoading }] = useMutation(
    ADD_FOLDER_MEMBERS,
    {
      onCompleted: onInviteCompleted,
    }
  );

  const onLeaveCompleted = (data: any) => {
    const {
      quitFolder: { ok, error },
    } = data;
    if (ok) {
      navigation.navigate("Folders");
    } else {
      Alert.alert("폴더를 나갈 수 없습니다.\n", error);
    }
  };

  const [leaveMutation, { loading: leaveMutationLoading }] = useMutation(
    LEAVE_FOLDER,
    {
      onCompleted: onLeaveCompleted,
    }
  );

  const {
    data: folderInfo,
    loading: folderInfoLoading,
    refetch,
  } = useQuery(GET_FOLDER_INFO, {
    variables: {
      folderId: folder.id,
    },
  });

  navigation.addListener("focus", async () => {
    await refetch();
  });

  const refresh = async () => {
    setRefreshing(true);
    const timer = setTimeout(() => {
      Alert.alert("요청시간 초과");
      setRefreshing(false);
    }, 10000);
    await refetch();
    clearTimeout(timer);
    setRefreshing(false);
  };

  useEffect(() => {
    if (folderInfo?.seeFolder?.ok) {
      setFolder(folderInfo?.seeFolder?.folder);
    }
  }, [folderInfo]);

  return (
    <ScreenContainer>
      {saves.length > 0 ? (
        <FlatList
          style={{ left: pixelScaler(17.5) }}
          refreshing={refreshing}
          onRefresh={refresh}
          ListHeaderComponent={() => (
            <EditButtonsContainer>
              {editing ? (
                <NewFolderButton
                  onPress={() => {
                    navigation.push("AddSaveFolders", { folder });
                  }}
                >
                  <RegText13>+ 추가하기</RegText13>
                </NewFolderButton>
              ) : (
                <SortButton
                  onPress={() => {
                    if (sortMode === "generated") {
                      setSortMode("name");
                    } else {
                      setSortMode("generated");
                    }
                  }}
                >
                  <RegText13>
                    {sortMode === "generated" ? "최근 생성 순" : "가나다 순"}
                  </RegText13>
                  <Ionicons name="chevron-down" />
                </SortButton>
              )}
            </EditButtonsContainer>
          )}
          data={saves}
          renderItem={({ item, index }) => (
            <SaveItem
              folderId={folder.id}
              save={item}
              index={index}
              editing={editing}
              refetch={refetch}
            />
          )}
          keyExtractor={(item, index) => "" + index}
          numColumns={2}
        />
      ) : (
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <BldText20>해당 폴더는 비어있습니다</BldText20>
        </View>
      )}
      <BottomSheetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        style={{
          borderTopLeftRadius: pixelScaler(20),
          borderTopRightRadius: pixelScaler(20),
          paddingBottom: pixelScaler(44),
        }}
      >
        <ModalButtonBox
          onPress={() => {
            setModalVisible(false);
            navigation.push("Members", {
              vars: {
                folderId: folder.id,
              },
              membersData: folderInfo?.seeFolder?.folder?.members,
              refetchMembers: refetch,
              inviteMutation,
              leaveMutation,
            });
          }}
        >
          <RegText20>멤버 관리</RegText20>
        </ModalButtonBox>
        <ModalButtonBox
          onPress={() => {
            setEditing(true);
            setModalVisible(false);
          }}
        >
          <RegText20>편집</RegText20>
        </ModalButtonBox>
      </BottomSheetModal>
      {editing ? null : (
        <FloatingMapButton>
          <Ionicons name="map-outline" size={30} />
        </FloatingMapButton>
      )}
    </ScreenContainer>
  );
};

export default Folder;
