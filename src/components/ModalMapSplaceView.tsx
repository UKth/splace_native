import React, { useContext, useState, useEffect, useRef } from "react";
import styled, { ThemeContext } from "styled-components/native";
import MapView, { Marker } from "react-native-maps";
import {
  Alert,
  Animated,
  Dimensions,
  Modal,
  PanResponder,
  TouchableWithoutFeedback,
  useWindowDimensions,
  View,
} from "react-native";
import BottomSheetModal from "./BottomSheetModal";
import { BLANK_IMAGE, coords2address, pixelScaler } from "../utils";
import { BldText16, RegText13, RegText16 } from "./Text";
import { Ionicons } from "@expo/vector-icons";
import { SplaceType, StackGeneratorParamList, ThemeType } from "../types";
import { Image } from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { useNavigation } from "@react-navigation/core";
import { Icon } from "./Icon";

const ModalDragBar = styled.View`
  position: absolute;
  width: ${pixelScaler(100)}px;
  height: ${pixelScaler(4)}px;
  border-radius: ${pixelScaler(2)}px;
  background-color: #d1d1d6;
  top: ${pixelScaler(12)}px;
  z-index: 1;
  /* margin-bottom: ${pixelScaler(30)}px; */
`;

const SplaceContainer = styled.TouchableOpacity`
  position: absolute;
  left: ${pixelScaler(15)}px;
  bottom: ${pixelScaler(45)}px;
  width: ${pixelScaler(345)}px;
  padding: ${pixelScaler(20)}px ${pixelScaler(20)}px;
  border-radius: ${pixelScaler(15)}px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.25);
  background-color: ${({ theme }: { theme: ThemeType }) => theme.background};
`;

const SplaceInfoContainer = styled.View`
  flex-direction: row;
  /* background-color: #1040d0; */
`;

const InfosContainer = styled.View`
  flex: 1;
  /* background-color: #f01030; */
`;

const ConfirmButton = styled.TouchableOpacity`
  position: absolute;
  height: ${pixelScaler(35)}px;
  border-width: ${pixelScaler(1)}px;
  border-radius: ${pixelScaler(10)}px;
  border-color: ${({ theme }: { theme: ThemeType }) => theme.borderHighlight};
  align-items: center;
  justify-content: center;
  width: ${pixelScaler(305)}px;
  bottom: ${pixelScaler(20)}px;
  left: ${pixelScaler(20)}px;
`;

const TagsContainer = styled.View`
  position: absolute;
  bottom: 0;
  /* background-color: #9020d0; */
`;

const TagsRowContainer = styled.View`
  flex-direction: row;
  margin-top: ${pixelScaler(10)}px;
  /* background-color: #9030f0; */
`;

const Tag = styled.View`
  padding: ${pixelScaler(10)}px 0;
  justify-content: center;
  border-width: ${pixelScaler(0.67)}px;
  border-radius: ${pixelScaler(20)}px;
  height: ${pixelScaler(20)}px;
  margin-right: ${pixelScaler(7)}px;
`;

const ModalMapSplaceView = ({
  showMap,
  setShowMap,
  splace,
}: {
  showMap: boolean;
  setShowMap: (_: boolean) => void;
  splace: SplaceType;
}) => {
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const { width } = useWindowDimensions();
  const height = pixelScaler(760);
  const theme = useContext<ThemeType>(ThemeContext);

  const screenHeight = Dimensions.get("screen").height;
  const panY = useRef(new Animated.Value(screenHeight)).current;
  const translateY = panY.interpolate({
    inputRange: [-1, 0, 1],
    outputRange: [0, 0, 1],
  });

  const resetBottomSheet = Animated.timing(panY, {
    toValue: 0,
    duration: 300,
    useNativeDriver: true,
  });

  const closeBottomSheet = Animated.timing(panY, {
    toValue: screenHeight,
    duration: 300,
    useNativeDriver: true,
  });

  const panResponders = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => false,
      onPanResponderMove: (event, gestureState) => {
        panY.setValue(gestureState.dy);
      },
      onPanResponderRelease: (event, gestureState) => {
        if (gestureState.dy > 0 && gestureState.vy > 1.5) {
          closeModal();
        } else {
          resetBottomSheet.start();
        }
      },
    })
  ).current;

  useEffect(() => {
    if (showMap) {
      resetBottomSheet.start();
    }
  }, [showMap]);

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setShowMap(false);
    });
  };

  const mapViewRef = useRef<any>();

  return (
    <Modal
      visible={showMap}
      animationType={"fade"}
      transparent
      statusBarTranslucent
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
          backgroundColor: "rgba(0, 0, 0, 0.4)",
        }}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={{ flex: 1 }} />
        </TouchableWithoutFeedback>
        <Animated.View
          style={{
            width,
            height,
            borderRadius: 100,
            alignItems: "center",
            borderTopLeftRadius: pixelScaler(100),
            borderTopRightRadius: pixelScaler(100),
            transform: [{ translateY: translateY }],
          }}
        >
          <View
            style={{
              position: "absolute",
              top: 0,
              height: 40,
              width: "100%",
              zIndex: 2,
            }}
            {...panResponders.panHandlers}
          ></View>
          <ModalDragBar />
          <MapView
            ref={mapViewRef}
            showsUserLocation={true}
            showsMyLocationButton={false}
            provider="google"
            style={{
              width,
              height,
              borderRadius: pixelScaler(15),
            }}
            initialRegion={{
              latitude: splace?.lat ?? 37.4996187,
              longitude: splace?.lon ?? 127.0296435,
              latitudeDelta: 0.03,
              longitudeDelta: 0.008,
            }}
          >
            {splace && (
              <Marker
                coordinate={{
                  latitude: splace?.lat,
                  longitude: splace?.lon,
                }}
                anchor={{
                  x: 0.5,
                  y: 1,
                }}
              >
                <Icon
                  name="positionpin"
                  style={{
                    width: pixelScaler(23),
                    height: pixelScaler(33),
                  }}
                />
              </Marker>
            )}
          </MapView>
          <SplaceContainer
            onPress={() => {
              setShowMap(false);
              navigation.push("Splace", { splace });
            }}
            style={{
              height: pixelScaler(splace?.thumbnail?.length ? 185 : 125),
            }}
          >
            <SplaceInfoContainer>
              {splace?.thumbnail?.length && (
                <Image
                  style={{
                    width: pixelScaler(110),
                    height: pixelScaler(110),
                    borderRadius: pixelScaler(10),
                    marginRight: pixelScaler(10),
                  }}
                  source={{
                    uri: splace?.thumbnail,
                  }}
                />
              )}
              <InfosContainer>
                <BldText16 style={{ marginBottom: pixelScaler(10) }}>
                  {splace?.name}
                </BldText16>
                <RegText13>{splace?.address}</RegText13>
                {splace?.thumbnail?.length && (
                  <TagsContainer>
                    {splace?.ratingtags?.length !== 0 && (
                      <TagsRowContainer>
                        {splace?.ratingtags?.map((tag) => (
                          <Tag
                            key={tag.id}
                            style={{ borderColor: theme.borderHighlight }}
                          >
                            <RegText13 style={{ color: theme.borderHighlight }}>
                              {tag.name}
                            </RegText13>
                          </Tag>
                        ))}
                      </TagsRowContainer>
                    )}
                    {splace?.bigCategories?.length !== 0 && (
                      <TagsRowContainer>
                        {splace?.bigCategories?.map((tag) => (
                          <Tag key={tag.id}>
                            <RegText13>{tag.name}</RegText13>
                          </Tag>
                        ))}
                      </TagsRowContainer>
                    )}
                  </TagsContainer>
                )}
              </InfosContainer>
            </SplaceInfoContainer>
          </SplaceContainer>
        </Animated.View>
      </View>
    </Modal>
  );
};

export default ModalMapSplaceView;