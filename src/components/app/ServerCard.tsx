import { Card, Col, Row, Button, Text, Avatar } from "@nextui-org/react";
import React from "react";

const ServerCard = (props: {
  logo: string;
  banner: string;
  name: string;
  blurb: string;
  members: number;
  membersOnline: number;
}) => {
  const { logo, banner, name, blurb, members, membersOnline } = props;
  return (
    <Card css={{ w: "12rem", h: "400px" }}>
      <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
          <Avatar />
          <Text h3 color="black">
            {name}
          </Text>
        </Col>
      </Card.Header>
      <Card.Body css={{ p: 0 }}>
        <Card.Image
          src={banner}
          width="100%"
          height="100%"
          objectFit="cover"
          alt={`${name} banner`}
        />
      </Card.Body>
      <Card.Footer
        isBlurred
        css={{
          position: "absolute",
          bgBlur: "#ffffff66",
          borderTop: "$borderWeights$light solid rgba(255, 255, 255, 0.2)",
          bottom: 0,
          zIndex: 1,
        }}
      >
        <Row>
          <Text color="#000" size={12}>
            {" "}
            {blurb}
          </Text>
        </Row>
        <Row>
          <Col>
            <Text color="#000" size={12}>
              {membersOnline} online.
            </Text>
            <Text color="#000" size={12}>
              {members} members.
            </Text>
          </Col>
          <Col>
            <Row justify="flex-end">
              <Button flat auto rounded color="secondary">
                <Text
                  css={{ color: "inherit" }}
                  size={12}
                  weight="bold"
                  transform="uppercase"
                >
                  Join
                </Text>
              </Button>
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default ServerCard;
