import { FC } from "react";
import { Layout, Typography } from "antd";
import { useAuth } from "../../context/authProvider";

const { Text } = Typography;

interface IHeaderProps {}

const Header: FC<IHeaderProps> = () => {
  const { userName } = useAuth();

  return (
    <>
      <Layout.Header>
        <Text style={{ color: "white" }}>{userName}</Text>
      </Layout.Header>
    </>
  );
};

export default Header;
