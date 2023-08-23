import { Routes, Route } from "react-router-dom";
import ShowLayout from "./pages/ShowLayout";
import DesignLayout from "./pages/DesignLayout";
import "flexlayout-react/style/gray.css";
import Header from "./components/Header";
import { DynamicProvider } from "./context/dynamicProviders";
import 'leaflet/dist/leaflet.css';

declare global {
  interface Window {
    CESIUM_BASE_URL: string;
  }
}
function App() {
  window.CESIUM_BASE_URL = 'http://localhost:3000/';
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/"
          element={
            <DynamicProvider>
              <ShowLayout />
            </DynamicProvider>
          }
        ></Route>
        <Route path="/design" element={<DesignLayout />}></Route>
      </Routes>
    </>
  );
}

export default App;
