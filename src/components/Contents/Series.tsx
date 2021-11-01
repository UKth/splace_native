import React, { useState } from "react";
import {
  Alert,
  FlatList,
  Share,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import styled from "styled-components/native";
import { SeriesType, StackGeneratorParamList } from "../../types";
import { pixelScaler, showFlashMessage } from "../../utils";
import BottomSheetModal from "../BottomSheetModal";
import Image from "../Image";
import { BldText20, RegText20 } from "../Text";
import Header from "./Header";
import ModalButtonBox from "../ModalButtonBox";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMutation, useQuery } from "@apollo/client";
import { BLOCK, GET_FEED, HIDE_SERIES, REMOVE_SERIES } from "../../queries";

const Container = styled.View`
  margin-bottom: ${pixelScaler(30)}px;
`;

const TitleContianer = styled.TouchableOpacity`
  padding: 0 ${pixelScaler(30)}px;
  margin-bottom: ${pixelScaler(20)}px;
`;

const Series = ({ item }: { item: SeriesType }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const onShare = async (id: number) => {
    try {
      const result = await Share.share({
        url: "https://splace.co.kr/share.php?type=Log&id=" + id,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          setModalVisible(false);
        } else {
          Alert.alert("공유에 실패했습니다.");
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error);
    }
  };

  const onDeleteCompleted = (data: any) => {
    if (data?.deleteSeries?.ok) {
      showFlashMessage({ message: "시리즈가 삭제되었습니다." });
      refetch();
    } else {
      Alert.alert("시리즈를 삭제할 수 없습니다.");
    }
  };

  const { refetch } = useQuery(GET_FEED);

  const [deleteMutation, { loading: deleteMutationLoading }] = useMutation(
    REMOVE_SERIES,
    { onCompleted: onDeleteCompleted }
  );

  const onHideCompleted = (data: any) => {
    if (data?.hideSeries?.ok) {
      showFlashMessage({ message: "시리즈가 되었습니다." });
      refetch();
    } else {
      Alert.alert("게시물을 삭제할 수 없습니다.");
    }
  };

  const [hideMutation, { loading: hideMutationLoading }] = useMutation(
    HIDE_SERIES,
    { onCompleted: onHideCompleted }
  );

  const onBlockCompleted = (data: any) => {
    if (data?.scrapLog?.ok) {
      showFlashMessage({ message: "사용자가 차단되었습니다." });
    } else {
      Alert.alert("사용자를 차단할 수 없습니다.");
    }
  };

  const [blockMutation, { loading: blockMutationLoading }] = useMutation(
    BLOCK,
    { onCompleted: onBlockCompleted }
  );

  return (
    <Container>
      <Header
        user={item.author}
        pressThreeDots={() => {
          setModalVisible(true);
        }}
      />

      <TitleContianer
        onPress={() => {
          console.log("hello");
          navigation.push("Series", {
            id: item.id,
          });
        }}
      >
        <BldText20>{item.title}</BldText20>
      </TitleContianer>

      <FlatList
        data={item.seriesElements}
        horizontal={true}
        ListHeaderComponent={() => <View style={{ width: pixelScaler(30) }} />}
        ListFooterComponent={() => <View style={{ width: pixelScaler(20) }} />}
        keyExtractor={(item) => "" + item.id}
        renderItem={({ item, index }) => {
          return (
            <Image
              source={{ uri: item.photolog.imageUrls[0] }}
              style={{
                width: pixelScaler(100),
                height: pixelScaler(100),
                marginRight: pixelScaler(10),
                borderRadius: pixelScaler(10),
              }}
            />
          );
        }}
        showsHorizontalScrollIndicator={false}
        bounces={false}
      />

      <BottomSheetModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        style={{
          borderTopLeftRadius: pixelScaler(20),
          borderTopRightRadius: pixelScaler(20),
          paddingBottom: pixelScaler(44),
        }}
      >
        {/* <ModalButtonBox>
          <RegText20>링크 복사</RegText20>
        </ModalButtonBox> */}
        {item.author.isMe ? (
          <>
            {/* <ModalButtonBox>
              <RegText20>공유</RegText20>
            </ModalButtonBox> */}
            <ModalButtonBox
              onPress={() => {
                setModalVisible(false);
                navigation.push("EditSeries", { series: item });
              }}
            >
              <RegText20>{"시리즈 수정"}</RegText20>
            </ModalButtonBox>
            <ModalButtonBox
              onPress={() => {
                if (!deleteMutationLoading) {
                  setModalVisible(false);
                  deleteMutation({
                    variables: {
                      sereisId: item.id,
                    },
                  });
                }
              }}
            >
              <RegText20 style={{ color: "#FF0000" }}>
                {"시리즈 삭제"}
              </RegText20>
            </ModalButtonBox>
          </>
        ) : (
          <>
            {/* <ModalButtonBox>
              <RegText20>공유</RegText20>
            </ModalButtonBox> */}
            <ModalButtonBox
              onPress={() => {
                if (!hideMutationLoading) {
                  setModalVisible(false);
                  hideMutation({ variables: { targetId: item.id } });
                }
              }}
            >
              <RegText20>{"숨기기"}</RegText20>
            </ModalButtonBox>
            <ModalButtonBox
              onPress={() => {
                if (!blockMutationLoading) {
                  blockMutation({ variables: { targetId: item.author.id } });
                }
              }}
            >
              <RegText20 style={{ color: "#FF0000" }}>{"차단"}</RegText20>
            </ModalButtonBox>
          </>
        )}
      </BottomSheetModal>
    </Container>
  );
};

export default Series;
