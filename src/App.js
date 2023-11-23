import { ToastContainer } from "react-toastify";
import CustomEditor from "./components/CustomEditor";
import "./App.css";
import "react-toastify/dist/ReactToastify.css";

function App() {
  return (
    <div className="App">
      <ToastContainer theme="dark" position="top-center" />
      <CustomEditor />
    </div>
  );
}

export default App;
