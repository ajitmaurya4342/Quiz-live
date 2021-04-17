import React from "react";
import { Container, Content, Text, Card, Header, Body, Button, Icon, Title, CardItem, Footer, FooterTab } from 'native-base';
import About from "./About"

const FooterPage = ({ navigation }) => {
  return (
      <Footer>
          <FooterTab>
                  <Button vertical
                              onPress={() => navigation.navigate("About")}>
                                <Icon name="apps" />
                                <Text>App22</Text>
                            </Button>
                            <Button vertical  onPress={() => navigation.navigate("About")}>
                                <Icon name="camera" />
                                <Text>Camera</Text>
                            </Button>
                            <Button vertical active  onPress={() => navigation.navigate("About")}>
                                <Icon active name="navigate" />
                                <Text>Navigate</Text>
                            </Button>
                            <Button vertical  onPress={() => navigation.navigate("About")}>
                                <Icon name="person" />
                                <Text>Contact</Text>
                            </Button>
                        </FooterTab>
                    </Footer>
  );
};


export default FooterPage;