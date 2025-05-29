import { BrowserRouter } from "react-router-dom";
import CustomRouter from "./routers";
import "./styles/index.css";

function App() {
  return (
    <BrowserRouter>
      <CustomRouter />
    </BrowserRouter>
  );
}

export default App;
