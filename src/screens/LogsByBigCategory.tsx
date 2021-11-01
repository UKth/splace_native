import React, { useState, useEffect, useRef } from "react";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import ScreenContainer from "../components/ScreenContainer";
import { useQuery } from "@apollo/client";
import { StackNavigationProp } from "@react-navigation/stack";
import { PhotologType, StackGeneratorParamList } from "../types";
import styled from "styled-components/native";
import { GET_LOGS_BY_BIGCATEGORY } from "../queries";
import { FlatList } from "react-native";
import { pixelScaler } from "../utils";
import Image from "../components/Image";

const LogContainer = styled.TouchableOpacity`
  margin-right: ${pixelScaler(3)}px;
  margin-bottom: ${pixelScaler(3)}px;
`;

const LogsByBigCategory = () => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const { data } = useQuery(GET_LOGS_BY_BIGCATEGORY);

  return (
    <ScreenContainer>
      <FlatList
        data={data?.getLogsByBigCategory?.logs}
        // ListHeaderComponent={
        //   <HeaderContainer>
        //     <TouchableOpacity></TouchableOpacity>
        //   </HeaderContainer>
        // }
        numColumns={2}
        renderItem={({ item }: { item: PhotologType }) => (
          <LogContainer onPress={() => navigation.push("Log", { id: item.id })}>
            <Image
              source={{ uri: item.imageUrls[0] }}
              style={{
                width: pixelScaler(186),
                height: pixelScaler(186),
              }}
            />
          </LogContainer>
        )}
      />
    </ScreenContainer>
  );
};

export default LogsByBigCategory;
