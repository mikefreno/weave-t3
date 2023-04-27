import InfoIcon from "@/src/icons/InfoIcon";
import { api } from "@/src/utils/api";
import { Card, Col, Row, Button, Text, Avatar, Tooltip, Loading } from "@nextui-org/react";
import { useState } from "react";
import ServerTooltip from "./ServerTooltip";

const ServerCard = (props: {
  logo: string;
  banner: string;
  name: string;
  blurb: string;
  members: number;
  membersOnline: number;
  serverID: number;
  refreshUserServers: () => void;
}) => {
  const { logo, banner, name, blurb, members, membersOnline, serverID, refreshUserServers } = props;

  const [joinButtonLoading, setJoinButtonLoading] = useState(false);

  const serverJoinMutation = api.server.joinPublicServer.useMutation();

  const joinPublicServer = async () => {
    setJoinButtonLoading(true);
    await serverJoinMutation.mutateAsync(serverID);
    refreshUserServers();
    setJoinButtonLoading(false);
  };

  return (
    <Card css={{ w: "12rem", h: "400px" }}>
      <Card.Header css={{ position: "absolute", zIndex: 1, top: 5 }}>
        <Col>
          <Row>
            <Avatar src={logo} />
            <div className="absolute right-0">
              <Tooltip content={<ServerTooltip serverName={name} serverBlurb={blurb} />} placement="rightStart">
                <InfoIcon height={20} width={20} fill={"#9333ea"} />
              </Tooltip>
            </div>
          </Row>
          <Text h3 color="black">
            {name}
          </Text>
        </Col>
      </Card.Header>
      <Card.Body css={{ p: 0 }}>
        <Card.Image src={banner} width="100%" height="100%" objectFit="cover" alt={`${name} banner`} />
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
              {joinButtonLoading ? (
                <Button disabled auto bordered color="gradient">
                  <Loading type="points" size="sm" />
                </Button>
              ) : (
                <Button flat auto rounded color="secondary" onClick={joinPublicServer}>
                  <Text css={{ color: "inherit" }} size={12} weight="bold" transform="uppercase">
                    Join
                  </Text>
                </Button>
              )}
            </Row>
          </Col>
        </Row>
      </Card.Footer>
    </Card>
  );
};

export default ServerCard;
