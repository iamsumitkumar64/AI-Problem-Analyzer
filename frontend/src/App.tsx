import AllRoutes from "./router";
import { ConfigProvider, theme } from "antd";

function App() {
  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorPrimary: '#3B82F6',        // Color 3: Accent Action
          colorBgBase: '#090D16',         // Color 1: Primary Surface
          colorBgContainer: '#131B2E',    // Color 2: Card / Sider Surface
          colorBgElevated: '#131B2E',     // Color 2: Modals, Drawers, Menus
          colorText: '#F8FAFC',           // Color 4: Text Light
          colorTextHeading: '#F8FAFC',
          colorTextSecondary: 'rgba(248, 250, 252, 0.65)',
          colorBorder: 'rgba(59, 130, 246, 0.25)',
          colorBorderSecondary: 'rgba(248, 250, 252, 0.1)',
          borderRadius: 8,
          fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        },
        components: {
          Button: {
            colorPrimary: '#3B82F6',
            colorPrimaryHover: '#2563EB',
            borderRadius: 6,
          },
          Table: {
            colorBgContainer: '#131B2E',
            borderColor: 'rgba(248, 250, 252, 0.08)',
          },
          Modal: {
            contentBg: '#131B2E',
            headerBg: '#131B2E',
          },
          Drawer: {
            colorBgElevated: '#131B2E',
          },
          Input: {
            colorBgContainer: '#090D16',
            colorBorder: 'rgba(59, 130, 246, 0.3)',
            colorTextPlaceholder: 'rgba(248, 250, 252, 0.4)',
          }
        }
      }}
    >
      <AllRoutes />
    </ConfigProvider>
  );
}

export default App;