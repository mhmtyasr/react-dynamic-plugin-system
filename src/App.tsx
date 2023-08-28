import { Routes, Route } from "react-router-dom";
import ShowLayout from "./pages/ShowLayout";
import DesignLayout from "./pages/DesignLayout";
import "flexlayout-react/style/gray.css";
import Header from "./components/Header";
import { DynamicProvider } from "./context/dynamicProviders";
import 'leaflet/dist/leaflet.css';


function App() {
  return (
    <>
      <Header />
      <Routes>
        <Route
          path="/show"
          element={
            <DynamicProvider>
              <ShowLayout />
            </DynamicProvider>
          }
        ></Route>
        <Route path="/" element={<DesignLayout />}></Route>
      </Routes>
    </>
  );
}

export default App;
