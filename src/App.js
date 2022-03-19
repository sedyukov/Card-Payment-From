import "antd/dist/antd.css";
import DrawerForm from "./DrawerForm";
import { Layout, Typography } from "antd";
const { Header, Content, Footer } = Layout;
const { Title } = Typography;

function App() {
  return (
    <Layout className="layout">
      <Header>
        <Title
          style={{ color: "white", margin: "10px", minHeight: "20vh" }}
          level={2}
        >
          Payment Form
        </Title>
      </Header>
      <Content style={{ padding: "0 50px" }}>
        <div
          style={{
            background: "#fff",
            minHeight: "80vh",
            textAlign: "center",
            paddingTop: "40px",
          }}
        >
          <DrawerForm />
        </div>
      </Content>
      <Footer style={{ textAlign: "center" }}>
        Test case by Sedyukov Yaroslav
      </Footer>
    </Layout>
  );
}

export default App;
