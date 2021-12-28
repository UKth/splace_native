import React, { useContext, useEffect, useRef, useState } from "react";
import {
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  useWindowDimensions,
  Animated,
  FlatList,
  Alert,
} from "react-native";
import styled, { ThemeContext } from "styled-components/native";
import { ThemeType } from "../types";
import { AlbumTitleKor, pixelScaler } from "../utils";
import { HeaderRightConfirm } from "../components/HeaderRightConfirm";
import { BldText13, BldText16, RegText13, RegText16 } from "../components/Text";
import { ZoomableImage } from "../components/ImagePicker/ZoomableImageComponent";
import ScreenContainer from "../components/ScreenContainer";
import { useNavigation } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
import { ImagePickerContext } from "../contexts/ImagePicker";
import * as MediaLibrary from "expo-media-library";
import { manipulateAsync, SaveFormat } from "expo-image-manipulator";
import { ProgressContext } from "../contexts/Progress";
import { Icon } from "../components/Icon";
import { BLANK_IMAGE } from "../constants";

const PickerContainer = styled.View`
  padding: 0 ${pixelScaler(30)}px;
  padding-top: ${pixelScaler(30)}px;
  height: ${pixelScaler(410)}px;
`;

const ButtonsContainer = styled.View`
  flex-direction: row;
  /* justify-content: space-between; */
  justify-content: center;
  position: absolute;
  bottom: ${pixelScaler(20)}px;
  left: ${pixelScaler(30)}px;
  width: ${pixelScaler(315)}px;
`;

const ImageContainer = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(315)}px;
  border-radius: ${pixelScaler(15)}px;
  border-width: ${pixelScaler(0.4)}px;
  border-color: ${({ theme }: { theme: ThemeType }) => theme.greyTextAlone};
  align-items: center;
  justify-content: center;
`;

const SizeButtonsContainer = styled.View`
  flex-direction: row;
`;

const Button = styled.TouchableOpacity`
  height: ${pixelScaler(25)}px;
  border-width: ${pixelScaler(0.67)}px;
  padding: 0 ${pixelScaler(10)}px;
  justify-content: center;
  border-radius: ${pixelScaler(25)}px;
  padding-top: ${pixelScaler(1.3)}px;
`;

const AlbumContainer = styled.TouchableOpacity`
  height: ${pixelScaler(75)}px;
  padding: 0 ${pixelScaler(30)}px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;

const AlbumThumbnail = styled.Image`
  width: ${pixelScaler(60)}px;
  height: ${pixelScaler(60)}px;
  border-radius: ${pixelScaler(10)}px;
  margin-right: ${pixelScaler(15)}px;
`;

const AlbumInfo = styled.View`
  flex-direction: row;
  align-items: center;
`;

const Seperator = styled.View`
  width: ${pixelScaler(315)}px;
  height: ${pixelScaler(0.67)}px;
  margin-left: ${pixelScaler(30)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.lightSeperator};
`;

const ImageItemContainer = styled.TouchableOpacity`
  width: ${pixelScaler(123)}px;
  height: ${pixelScaler(123)}px;
  margin-right: ${pixelScaler(3)}px;
  margin-bottom: ${pixelScaler(3)}px;
`;

const ImageItem = styled.Image`
  width: ${pixelScaler(123)}px;
  height: ${pixelScaler(123)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.greyBackground};
`;

const ImageItemFocused = styled.View`
  position: absolute;
  width: ${pixelScaler(123)}px;
  height: ${pixelScaler(123)}px;
  background-color: rgba(255, 255, 255, 0.7);
`;

const NumberLabelContainer = styled.View`
  width: ${pixelScaler(20)}px;
  height: ${pixelScaler(20)}px;
  border-radius: ${pixelScaler(20)}px;
  align-items: center;
  justify-content: center;
  position: absolute;
  top: ${pixelScaler(10)}px;
  right: ${pixelScaler(10)}px;
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.themeBackground};
`;

const HeaderTitleContainer = styled.View`
  flex-direction: row;
  align-items: center;
`;

const NumberLabel = ({ ids, id }: { ids: string[]; id: string }) => {
  const idx = ids.indexOf(id);
  const theme = useContext<ThemeType>(ThemeContext);
  return idx !== -1 ? (
    <NumberLabelContainer>
      <BldText13 style={{ color: theme.background }}>{idx + 1}</BldText13>
    </NumberLabelContainer>
  ) : null;
};

type AlbumType = {
  title: string;
  id: string;
  count: number;
  thumbnail: string;
};

const ModalImagePicker = () => {
  const theme = useContext<ThemeType>(ThemeContext);
  const navigation = useNavigation<StackNavigationProp<any>>();

  const { setShowPicker } = useContext(ImagePickerContext);
  const [album, setAlbum] = useState<AlbumType>();
  const [albums, setAlbums] = useState<AlbumType[]>();
  const [focusedImageIndex, setFocusedImageIndex] = useState(0);

  const [showAlbums, setShowAlbums] = useState(false);
  const screenHeight = useWindowDimensions().height;

  const { images, setImages, setImageSize, imageSize } =
    useContext(ImagePickerContext);

  const [focusedSize, setFocusedSize] = useState<0 | 1 | 2>(imageSize);
  const flatListRef = useRef<any>();

  const [loadedImage, setLoadedImage] = useState<MediaLibrary.Asset[]>([]);

  const [selectedImages, setSelectedImages] = useState<
    (MediaLibrary.Asset & {
      zoom: number;
      offset_x: number;
      offset_y: number;
    })[]
  >([]);

  const [size, setSize] = useState<{ width: number; height: number }>();

  const ZoomableRef = useRef<any>();

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

  const closeModal = () => {
    closeBottomSheet.start(() => {
      setShowAlbums(false);
    });
  };

  const openModal = () => {
    resetBottomSheet.start(() => {
      setShowAlbums(false);
    });
  };

  const { spinner } = useContext(ProgressContext);

  const updateSelectedImage = async () => {
    selectedImages[focusedImageIndex] = {
      ...selectedImages[focusedImageIndex],
      zoom: ZoomableRef?.current?.state.zoom ?? 1,
      offset_x: ZoomableRef?.current?.state.offset_x ?? 0,
      offset_y: ZoomableRef?.current?.state.offset_y ?? 0,
    };
    setImageSize(focusedSize);

    const frameWidth =
      focusedSize === 2 ? pixelScaler(236.25) : pixelScaler(315);
    const frameHeight =
      focusedSize === 0 ? pixelScaler(236.25) : pixelScaler(315);
    let tmp = [];
    spinner.start(false);

    for (let i = 0; i < selectedImages.length; i++) {
      const image = selectedImages[i];
      const r = focusedSize === 0 ? 3 / 4 : focusedSize === 1 ? 1 : 4 / 3;

      var pixR;
      if (frameHeight / frameWidth < image.height / image.width) {
        pixR = image.width / (frameWidth * image.zoom);
      } else {
        pixR = image.height / (frameHeight * image.zoom);
      }

      const manipResult = await manipulateAsync(
        image.uri,
        [
          {
            crop: {
              width: frameWidth * pixR - 2,
              height: frameHeight * pixR - 2,
              originX: -image.offset_x * pixR + 1,
              originY: -image.offset_y * pixR + 1,
            },
          },
          {
            resize: {
              width: 1080,
            },
          },
        ],
        { compress: 0, format: SaveFormat.PNG }
      );
      // console.log(manipResult);
      tmp.push({
        edited: true,
        url: manipResult.uri,
        orgUrl: image.uri,
      });
    }
    spinner.stop();
    setShowPicker(false);
    navigation.pop();

    setImages(tmp);
  };

  useEffect(() => {
    (async () => {
      const { accessPrivileges } = await MediaLibrary.requestPermissionsAsync();
      if (accessPrivileges === "none") {
        alert("편집을 위해선 앨범 권한이 필요합니다.");
        navigation.pop();
      }

      const albumsList = await MediaLibrary.getAlbumsAsync({
        includeSmartAlbums: true,
      });

      if (albumsList) {
        var tmp = [];
        for (let i = 0; i < albumsList.length; i++) {
          const album: MediaLibrary.Album = albumsList[i];
          var recents;
          var favorites;
          // console.log(album);
          const assets = await MediaLibrary.getAssetsAsync({
            album: album.id,
            first: 1,
          });
          var title = album.title;
          if (album.type === "smartAlbum") {
            if (title in AlbumTitleKor) {
              //@ts-ignore
              title = AlbumTitleKor[title];
            }
          }
          if (assets.totalCount > 0 && title) {
            if (album.title === "Recents") {
              recents = {
                title: title,
                id: album.id,
                count: assets.totalCount,
                thumbnail: assets.assets[0]?.uri ?? BLANK_IMAGE,
              };
            } else if (album.title === "Favorites") {
              favorites = {
                title: title,
                id: album.id,
                count: assets.totalCount,
                thumbnail: assets.assets[0]?.uri ?? BLANK_IMAGE,
              };
            } else {
              tmp.push({
                title: title,
                id: album.id,
                count: assets.totalCount,
                thumbnail: assets.assets[0]?.uri ?? BLANK_IMAGE,
              });
            }
          }
          // console.log(assets.totalCount, album.title);
        }

        if (favorites) {
          tmp = [favorites, ...tmp];
        }
        if (recents) {
          tmp = [recents, ...tmp];
        }
        setAlbums(tmp);
        if (recents) {
          setAlbum(recents);
        } else {
          setAlbum(tmp[0]);
        }
      } else {
        Alert.alert("앨범을 불러올 수 없습니다.");
      }

      // albumsList);
      // setAlbums()
    })();
  }, []);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <HeaderRightConfirm
          onPress={async () => {
            await updateSelectedImage();
          }}
        />
      ),
      headerLeft: () => (
        <TouchableOpacity
          style={{
            alignItems: "center",
            justifyContent: "center",
            width: 70,
            height: 70,
          }}
          onPress={() => {
            setShowPicker(false);
            navigation.pop();
          }}
        >
          <Icon
            name="close"
            style={{ width: pixelScaler(11), height: pixelScaler(11) }}
          />
        </TouchableOpacity>
      ),
      headerTitle: () => (
        <HeaderTitleContainer>
          <BldText16 numberOfLines={1} onPress={() => openModal()}>
            {album?.title ?? "사진 선택"}
          </BldText16>
          <Icon
            name="arrow_right"
            style={{
              width: pixelScaler(6),
              height: pixelScaler(12),
              marginLeft: pixelScaler(10),
              transform: [{ rotate: "90deg" }],
            }}
          />
        </HeaderTitleContainer>
      ),
    });
  }, [selectedImages, album]);

  useEffect(() => {
    if (focusedSize === 2 && selectedImages[focusedImageIndex]?.uri) {
      Image.getSize(selectedImages[focusedImageIndex].uri, (img_w, img_h) => {
        if (img_w / 236.25 > img_h / 315) {
          setSize({
            width: (pixelScaler(315) / img_h) * img_w,
            height: pixelScaler(315),
          });
        } else {
          setSize({
            width: pixelScaler(236.25),
            height: (pixelScaler(236.25) / img_w) * img_h,
          });
        }
      });
    } else {
      const height_px = focusedSize === 0 ? 236.25 : 315;
      if (selectedImages[focusedImageIndex]?.uri) {
        Image.getSize(selectedImages[focusedImageIndex].uri, (img_w, img_h) => {
          if (img_w / 315 > img_h / height_px) {
            setSize({
              width: (pixelScaler(height_px) / img_h) * img_w,
              height: pixelScaler(height_px),
            });
          } else {
            setSize({
              width: pixelScaler(315),
              height: (pixelScaler(315) / img_w) * img_h,
            });
          }
        });
      }
    }
  }, [focusedImageIndex, selectedImages, focusedSize, focusedImageIndex]);

  useEffect(() => {
    if (album) {
      (async () => {
        const assets = await MediaLibrary.getAssetsAsync({
          album: album.id,
          first: 30,
        });
        setLoadedImage(assets.assets);
        setFocusedImageIndex(0);
        if (images.length === 0) {
        } else {
          const orgUrls = images.map((image) => image.orgUrl);
          setSelectedImages(
            assets.assets
              .filter((asset) => orgUrls.includes(asset.uri))
              .map((asset) => {
                return {
                  ...asset,
                  offset_x: 0,
                  offset_y: 0,
                  zoom: 1,
                };
              })
          );
        }
      })();
    }
  }, [album]);

  const fetchLoadImage = () => {
    if (album) {
      (async () => {
        const assets = await MediaLibrary.getAssetsAsync({
          album: album.id,
          first: 30,
          after: loadedImage[loadedImage.length - 1].id,
        });
        setLoadedImage([
          ...loadedImage,
          ...assets.assets.map((asset) => {
            return {
              ...asset,
              zoom: 1,
              offset_x: 0,
              offset_y: 0,
            };
          }),
        ]);
      })();
    }
  };

  const handleResize = (n: 0 | 1 | 2) => {
    var tmp = [...selectedImages];
    tmp = tmp.map((image, index) =>
      index === focusedImageIndex
        ? image
        : {
            ...image,
            offset_x: 0,
            offset_y: 0,
            zoom: 1,
          }
    );
    setSelectedImages(tmp);
    setFocusedSize(n);
  };

  return (
    <ScreenContainer>
      <PickerContainer>
        <ImageContainer>
          <View
            style={{
              height: pixelScaler(focusedSize === 0 ? 236.25 : 315),
            }}
          >
            <ScrollView
              style={{
                borderRadius: pixelScaler(15),
                width: pixelScaler(focusedSize === 2 ? 236.25 : 315),
                height: pixelScaler(focusedSize === 0 ? 236.25 : 315),
              }}
              scrollEnabled={false}
            >
              {size &&
                selectedImages.length > 0 &&
                selectedImages[focusedImageIndex] && (
                  <ZoomableImage
                    ref={ZoomableRef}
                    initialData={selectedImages[focusedImageIndex]}
                    imageHeight={size.height}
                    imageWidth={size.width}
                    frameWidth={pixelScaler(focusedSize === 2 ? 236.25 : 315)}
                    frameHeight={pixelScaler(focusedSize === 0 ? 236.25 : 315)}
                  />
                )}
            </ScrollView>
          </View>
        </ImageContainer>
        <ButtonsContainer>
          {/* <Button
            onPress={() => {
              openModal();
            }}
          >
            <RegText16>{album?.title ?? "최근 항목"}</RegText16>
          </Button> */}
          <SizeButtonsContainer>
            <Button
              onPress={() => handleResize(0)}
              style={{
                borderColor:
                  focusedSize === 0 ? theme.borderHighlight : theme.text,
                marginLeft: pixelScaler(10),
                paddingTop: pixelScaler(2),
              }}
            >
              <RegText16
                style={focusedSize === 0 ? { color: theme.textHighlight } : {}}
              >
                4:3
              </RegText16>
            </Button>
            <Button
              onPress={() => handleResize(1)}
              style={{
                borderColor:
                  focusedSize === 1 ? theme.borderHighlight : theme.text,
                marginLeft: pixelScaler(10),
                paddingTop: pixelScaler(2),
              }}
            >
              <RegText16
                style={focusedSize === 1 ? { color: theme.textHighlight } : {}}
              >
                1:1
              </RegText16>
            </Button>
            <Button
              onPress={() => handleResize(2)}
              style={{
                borderColor:
                  focusedSize === 2 ? theme.borderHighlight : theme.text,
                marginLeft: pixelScaler(10),
                paddingTop: pixelScaler(2),
              }}
            >
              <RegText16
                style={focusedSize === 2 ? { color: theme.textHighlight } : {}}
              >
                3:4
              </RegText16>
            </Button>
          </SizeButtonsContainer>
        </ButtonsContainer>
      </PickerContainer>
      <FlatList
        maxToRenderPerBatch={10}
        initialNumToRender={10}
        ref={flatListRef}
        data={loadedImage}
        renderItem={({
          item,
          index,
        }: {
          item: MediaLibrary.Asset;
          index: number;
        }) => (
          <ImageItemContainer
            key={index}
            onPress={() => {
              const imageIds = selectedImages.map((image) => image.id);
              const ind = imageIds.indexOf(item.id);

              var tmp = [...selectedImages];
              if (ZoomableRef?.current?.state) {
                tmp[focusedImageIndex] = {
                  ...tmp[focusedImageIndex],
                  zoom: ZoomableRef?.current?.state.zoom,
                  offset_x: ZoomableRef?.current?.state.offset_x,
                  offset_y: ZoomableRef?.current?.state.offset_y,
                };
                setSelectedImages(tmp);
                // console.log(tmp);
              }

              if (ind === -1 && selectedImages.length < 16) {
                setSelectedImages([
                  ...tmp,
                  { ...item, zoom: 1, offset_x: 0, offset_y: 0 },
                ]);
                setFocusedImageIndex(tmp.length);
              } else {
                if (selectedImages[focusedImageIndex].id === item.id) {
                  setFocusedImageIndex(selectedImages.length - 2);
                  tmp.splice(ind, 1);
                  setSelectedImages(tmp);
                } else if (ind !== -1) {
                  setFocusedImageIndex(imageIds.indexOf(item.id));
                }
              }
            }}
          >
            <ImageItem source={{ uri: item.uri }} />
            {selectedImages[focusedImageIndex]?.id === item.id ? (
              <ImageItemFocused />
            ) : null}
            {
              <NumberLabel
                ids={selectedImages.map((image) => image.id)}
                id={item.id}
              />
            }
          </ImageItemContainer>
        )}
        showsVerticalScrollIndicator={false}
        numColumns={3}
        onEndReached={fetchLoadImage}
        onEndReachedThreshold={2}
      />

      <Animated.View
        style={{
          height: screenHeight,
          backgroundColor: theme.background,
          width: "100%",
          position: "absolute",
          transform: [{ translateY: translateY }],
        }}
      >
        <FlatList
          data={albums}
          renderItem={({ item, index }: { item: AlbumType; index: number }) => (
            <AlbumContainer
              key={index}
              onPress={() => {
                flatListRef.current.scrollToIndex({
                  animated: false,
                  index: 0,
                });
                closeModal();
                setAlbum(item);
              }}
            >
              <AlbumInfo>
                <AlbumThumbnail source={{ uri: item.thumbnail }} />
                <BldText16
                  style={{ width: pixelScaler(200) }}
                  numberOfLines={1}
                >
                  {item.title}
                </BldText16>
              </AlbumInfo>
              <RegText13 style={{ color: theme.greyTextLight }}>
                {item.count}
              </RegText13>
            </AlbumContainer>
          )}
          ListFooterComponent={<View style={{ height: pixelScaler(100) }} />}
          ItemSeparatorComponent={Seperator}
          showsVerticalScrollIndicator={false}
        />
      </Animated.View>
    </ScreenContainer>
  );
};

export default ModalImagePicker;
