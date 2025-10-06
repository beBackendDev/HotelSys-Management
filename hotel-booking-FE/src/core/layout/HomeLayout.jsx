import { Layout } from "antd";
import Navbar from "../../components/Navbar/Navbar";
import Footer_Content from "../../components/Footer/Footer";

const { Content, Footer } = Layout;

const HomeLayout = ({ children }) => {
  return (
    <Layout className="min-h-screen">
      {/* Navbar riêng, không đặt trong Header của AntD */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Push content xuống để tránh bị che bởi navbar */}
      <Content className="site-layout">
        {children}
      </Content>


    </Layout>
  );
};

export default HomeLayout;
