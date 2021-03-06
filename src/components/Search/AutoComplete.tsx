import React, { useContext } from "react";
import styled, { ThemeContext } from "styled-components/native";
import { ThemeType } from "../../types";
import { pixelScaler } from "../../utils";
import { RegText16 } from "../Text";

const Container = styled.ScrollView``;

const AutoComplete = ({
  text,
  tabViewIndex,
}: {
  text: string;
  tabViewIndex: number;
}) => {
  return <Container></Container>;
};

export default AutoComplete;
