import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import { Ionicons } from "@expo/vector-icons";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/core";
import { StackNavigationProp } from "@react-navigation/stack";
// import { RouteProp } from "@react-navigation/native";
import React, { useContext, useEffect, useState } from "react";
import {
  Image as DefaultImage,
  Alert,
  FlatList,
  ScrollView,
  Share,
  Text,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import styled, { ThemeContext } from "styled-components/native";
import { HeaderRightConfirm } from "../../components/HeaderRightConfirm";
import Image from "../../components/Image";
import ScreenContainer from "../../components/ScreenContainer";
import { BldTextInput16, RegTextInput16 } from "../../components/TextInput";
import { StackGeneratorParamList, ThemeType } from "../../types";
import { pixelScaler } from "../../utils";
import * as ImagePicker from "expo-image-picker";
import { EDIT_PROFILE, VALIDATE_USERNAME } from "../../queries";
import axios from "axios";
import { API_URL, tokenVar } from "../../apollo";
import { ProgressContext } from "../../contexts/Progress";
import { HeaderBackButton } from "../../components/HeaderBackButton";
import { Icon } from "../../components/Icon";
import { BldText16, RegText13 } from "../../components/Text";
import { BLANK_PROFILE_IMAGE } from "../../constants";

const ProfileImageContainer = styled.TouchableOpacity`
  height: ${pixelScaler(195)}px;
  align-items: center;
  justify-content: center;
`;

const EntriesContainer = styled.View`
  padding: 0 ${pixelScaler(30)}px;
`;

const EntryContainer = styled.View`
  height: ${pixelScaler(75)}px;
  /* justify-content: center; */
  align-items: center;
  flex-direction: row;
`;

const Seperator = styled.View`
  background-color: ${({ theme }: { theme: ThemeType }) =>
    theme.editProfileSeperator};
  height: ${pixelScaler(0.67)}px;
  width: ${pixelScaler(315)}px;
`;

const EditProfile = () => {
  const route = useRoute<RouteProp<StackGeneratorParamList, "EditProfile">>();
  const navigation =
    useNavigation<StackNavigationProp<StackGeneratorParamList>>();

  const { me } = route.params;

  const theme = useContext<ThemeType>(ThemeContext);

  const {
    username: old_username,
    name: old_name,
    url: old_url,
    profileMessage: old_profileMessage,
  } = me;

  const [username, setUsername] = useState(old_username);
  const [name, setName] = useState(old_name);
  const [url, setUrl] = useState(old_url);
  const [profileMessage, setProfileMessage] = useState(old_profileMessage);
  const [localUri, setLocalUri] = useState<string>("");
  const { spinner } = useContext(ProgressContext);
  const [valueChanged, setValueChanged] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(true);

  const onValidateCompleted = (data: any) => {
    if (data?.checkUsername?.ok) {
      setIsUsernameValid(true);
    } else {
      setIsUsernameValid(false);
    }
  };

  const [validateUsernameQuery, { loading: validateLoading }] = useLazyQuery(
    VALIDATE_USERNAME,
    {
      onCompleted: onValidateCompleted,
    }
  );

  useEffect(() => {
    if (username) {
      if (username === old_username) {
        setIsUsernameValid(true);
      } else {
        if (username.length >= 4) {
          if (!validateLoading) {
            validateUsernameQuery({ variables: { username } });
          }
        } else if (username !== "") {
          setIsUsernameValid(false);
        }
      }
    }
  }, [username]);

  const validateUsername = (text: string) => {
    const exp = /^[0-9a-z._]*$/;
    return exp.test(String(text).toLowerCase());
  };

  const validateUrl = (text: string) => {
    const exp = /^[0-9a-z_\-.&?=:\/]*$/;
    return exp.test(String(text).toLowerCase());
  };

  const onCompleted = ({
    editProfile: { ok, error },
  }: {
    editProfile: {
      ok: boolean;
      error: string;
    };
  }) => {
    spinner.stop();
    if (ok) {
      Alert.alert("프로필이 수정되었습니다.");
      navigation.pop();
    } else {
      Alert.alert("프로필 수정에 실패했습니다.\n" + error);
    }
  };

  const [mutation, { loading }] = useMutation(EDIT_PROFILE, { onCompleted });

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => <BldText16>프로필 편집</BldText16>,
      headerRight: () => {
        return valueChanged ? (
          <HeaderRightConfirm
            onPress={async () => {
              if (isUsernameValid) {
                let variables: {
                  name?: string;
                  username?: string;
                  profileMessage?: string;
                  profileImageUrl?: string;
                  url?: string;
                } = {};
                if (localUri !== "") {
                  // console.log("local in");

                  const formData = new FormData();

                  formData.append("photos", {
                    // @ts-ignore
                    uri: localUri,
                    name: localUri.substr(localUri.length - 10),
                    type: "image/jpeg",
                  });

                  const res = await axios.post(
                    "http://" + API_URL + "/uploadphoto",
                    formData,
                    {
                      headers: {
                        "content-type": "multipart/form-data",
                        // token: tokenVar(),
                        token: tokenVar() ?? "",
                      },
                    }
                  );

                  if (Object.keys(res.data).length !== 1) {
                    Alert.alert(
                      "프로필 편집에 실패했습니다.\n(사진 업로드 실패)"
                    );
                  } else {
                    // @ts-ignore
                    const awsURL = res.data[0].location;
                    variables.profileImageUrl = awsURL;
                  }
                }

                if (url && url.trim() !== old_url) {
                  variables.url = url.trim();
                }
                if (username && username.trim() !== old_username) {
                  variables.username = username.trim();
                }
                if (name && name !== old_name) {
                  variables.name = name;
                }
                if (profileMessage && profileMessage !== old_profileMessage) {
                  variables.profileMessage = profileMessage;
                }

                if (Object.keys(variables).length !== 0) {
                  if ("username" in variables) {
                    if (!validateUsername(variables.username ?? "")) {
                      Alert.alert("적절하지 않은 아이디입니다.");
                      return;
                    }
                  }
                  if ("url" in variables) {
                    if (!validateUrl(variables.url ?? "")) {
                      Alert.alert("적절하지 않은 링크입니다.");
                      return;
                    }
                  }
                  spinner.start();
                  mutation({ variables });
                }
              } else {
                Alert.alert("유효하지 않은 아이디입니다.");
              }
            }}
          />
        ) : (
          <></>
        );
      },
      headerLeft: () => <HeaderBackButton onPress={() => navigation.pop()} />,
    });

    (async () => {
      const { status } =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== "granted") {
        alert("편집을 위해선 카메라 권한이 필요합니다.");
        navigation.pop();
      }
    })();
    // console.log("localuri:", localUri, name, valueChanged);
    if (
      localUri !== "" ||
      username !== old_username ||
      name !== old_name ||
      url !== old_url ||
      profileMessage !== old_profileMessage
    ) {
      setValueChanged(true);
    } else {
      setValueChanged(false);
    }
  }, [
    username,
    name,
    url,
    profileMessage,
    localUri,
    valueChanged,
    isUsernameValid,
  ]);

  return (
    <ScreenContainer>
      <KeyboardAwareScrollView extraScrollHeight={40}>
        <ProfileImageContainer
          onPress={() => {
            (async () => {
              let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.All,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 1,
              });

              if (!result.cancelled) {
                setLocalUri(result.uri);
              }
            })();
          }}
        >
          <Icon
            name="gallery_black"
            style={{
              zIndex: 2,
              width: pixelScaler(25),
              height: pixelScaler(20),
            }}
          />
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              width: pixelScaler(105),
              height: pixelScaler(105),
              borderRadius: pixelScaler(105),
              backgroundColor: "rgba(255,255,255,0.5)",
            }}
          />
          {localUri === "" ? (
            <Image
              source={{
                uri: me.profileImageUrl ?? BLANK_PROFILE_IMAGE,
              }}
              style={{
                position: "absolute",
                width: pixelScaler(105),
                height: pixelScaler(105),
                borderRadius: pixelScaler(105),
              }}
            />
          ) : (
            <DefaultImage
              source={{ uri: localUri }}
              style={{
                position: "absolute",
                width: pixelScaler(105),
                height: pixelScaler(105),
                borderRadius: pixelScaler(105),
              }}
            />
          )}
          {!isUsernameValid ? (
            <RegText13
              style={{
                color: theme.errorText,
                position: "absolute",
                right: pixelScaler(30),
                bottom: pixelScaler(5),
              }}
            >
              유효하지 않은 아이디입니다.
            </RegText13>
          ) : null}
        </ProfileImageContainer>
        <EntriesContainer>
          <Seperator />
          <EntryContainer>
            <BldTextInput16
              value={username}
              style={{
                color: theme.text,
                flex: 1,
              }}
              onChangeText={(text) => {
                if (validateUsername(text)) {
                  setUsername(text.trim().toLowerCase());
                }
              }}
              placeholder="사용자 이름"
              placeholderTextColor={theme.editProfileTextGrey}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={30}
            />
          </EntryContainer>
          <Seperator />
          <EntryContainer>
            <BldTextInput16
              value={name}
              style={{
                color: theme.text,
                flex: 1,
              }}
              onChangeText={(text) => setName(text)}
              placeholder="이름"
              placeholderTextColor={theme.editProfileTextGrey}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={10}
            />
          </EntryContainer>
          <Seperator />
          <EntryContainer>
            <RegTextInput16
              value={url}
              style={{
                color: theme.profileLink,
                flex: 1,
              }}
              onChangeText={(text) => {
                if (validateUrl(text)) {
                  setUrl(text.trim().toLowerCase());
                }
              }}
              placeholder="링크"
              placeholderTextColor={theme.profileLink}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={150}
            />
          </EntryContainer>
          <Seperator />
          <EntryContainer
            style={{
              height: pixelScaler(200),
              alignItems: "flex-start",
              paddingTop: pixelScaler(25),
            }}
          >
            <RegTextInput16
              value={profileMessage}
              style={{
                color: theme.text,
                flex: 1,
                lineHeight: pixelScaler(20),
              }}
              onChangeText={(text) => setProfileMessage(text)}
              placeholder="소개글"
              placeholderTextColor={theme.editProfileTextGrey}
              autoCapitalize="none"
              autoCorrect={false}
              maxLength={200}
              multiline={true}
            />
          </EntryContainer>
        </EntriesContainer>
      </KeyboardAwareScrollView>
    </ScreenContainer>
  );
};

export default EditProfile;
