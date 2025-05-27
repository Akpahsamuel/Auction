import { BrowserRouter } from "react-router-dom";
import CustomRouter from "./routers";

function App() {
  return (
    <BrowserRouter>
      <CustomRouter />
    </BrowserRouter>
  );
}

export default App;
