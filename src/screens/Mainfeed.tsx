// import { feed } from "../../data";

import React, { useEffect, useContext, useMemo } from "react";
import {
  Dimensions,
  View,
  RefreshControl,
  TouchableOpacity,
  Alert,
  FlatList,
} from "react-native";

import { GET_FEED, LIKE_PHOTOLOG, UNLIKE_PHOTOLOG } from "../queries";

import { ScrollView } from "react-native-gesture-handler";
import styled from "styled-components/native";
import { ThemeContext } from "styled-components";
import {
  BldText13,
  BldText20,
  BldText33,
  RegText13,
  RegText20,
} from "../components/Text";
import { convertLike, pixelScaler } from "../utils";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  HashTagType,
  PhotologType,
  SeriesType,
  StackGeneratorParamList,
  themeType,
} from "../types";
import { StackNavigationProp } from "@react-navigation/stack";
import { useMutation, useQuery } from "@apollo/client";
import Image from "../components/Image";
import { useNavigation } from "@react-navigation/native";
import BottomSheetModal from "../components/BottomSheetModal";
import PhotoLog from "../components/Contents/Photolog";
import client, { isLoggedInVar, tokenVar, userIdVar } from "../apollo";
import Series from "../components/Contents/Series";
import useMe from "../hooks/useMe";

const { width } = Dimensions.get("window");

const Container = styled.View`
  background-color: ${({ theme }: { theme: themeType }) => theme.background};
  flex: 1;
`;
// ({ navigation,}: { navigation: StackNavigationProp<StackGeneratorParamList>;}) => {
const Mainfeed = () => {
  const theme = useContext(ThemeContext);
  // const [loading, setLoading] = useState(true);

  const me = useMe();

  const [feed, setFeed] = useState<
    (
      | { type: "log"; data: PhotologType }
      | { type: "series"; data: SeriesType }
    )[]
  >([]);
  const [lastLogId, setLastLogId] = useState(0);
  const [lastSeriesId, setSeriesId] = useState(0);

  const setFeedData = ({
    logs,
    series,
  }: {
    logs: PhotologType[];
    series: SeriesType[];
  }) => {
    const tmp: (
      | { type: "log"; data: PhotologType }
      | { type: "series"; data: SeriesType }
    )[] = [];
    let i = 0;
    let j = 0;
    while (i < logs.length || j < series.length) {
      if (j === series.length) {
        tmp.push({ type: "log", data: logs[i] });
        i++;
      } else if (i === logs.length) {
        tmp.push({ type: "series", data: series[j] });
        j++;
      } else {
        if (logs[i].createdAt > series[j].createdAt) {
          tmp.push({ type: "log", data: logs[i] });
          i++;
        } else {
          tmp.push({ type: "series", data: series[j] });
          j++;
        }
      }
    }

    setFeed(tmp);
  };

  const onCompleted = async (data: {
    getFeed: {
      logs: PhotologType[];
      series: SeriesType[];
    };
  }) => {
    const { getFeed } = data;
    // console.log(getFeed);
    setFeedData({ logs: getFeed.logs ?? [], series: getFeed.series ?? [] });
  };
  // console.log(
  //   "######\n",
  //   tokenVar(),
  //   userIdVar(),
  //   isLoggedInVar(),
  //   "get feed data!"
  // );
  const { loading, error, data, refetch, fetchMore } = useQuery(GET_FEED, {
    onCompleted,
  });

  useEffect(() => {
    if (data?.getFeed?.logs && data?.getFeed?.series) {
      setFeedData({
        logs: data?.getFeed?.logs ?? [],
        series: data?.getFeed?.series ?? [],
      });
    }
  }, [data]);

  const [refreshing, setRefreshing] = useState(false);

  const refresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  return (
    <Container
    // refreshControl={
    //   <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
    // }
    >
      <FlatList
        data={feed}
        refreshing={refreshing}
        keyExtractor={(item) => item.type + item.data.id}
        onEndReached={async () => {
          await fetchMore({
            variables: {
              lastLogId: data?.getFeed?.logs[data?.getFeed?.logs.length - 1].id,
              ...(data?.getFeed?.series &&
                data?.getFeed?.series.length !== 0 && {
                  lastSeriesId:
                    data?.getFeed?.series[data?.getFeed?.series.length - 1].id,
                }),
            },
          });
        }}
        onRefresh={refresh}
        renderItem={({ item, index }) =>
          item.type === "log" ? (
            <PhotoLog item={item.data} key={index} />
          ) : (
            <Series item={item.data} />
          )
        }
        showsVerticalScrollIndicator={false}
      />
    </Container>
  );
};

export default Mainfeed;
