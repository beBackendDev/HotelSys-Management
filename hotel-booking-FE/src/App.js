import Routes from "./Routes";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTopButton from "./common/ScrollToTopButton";
function App() {
  return (
    <div className="App">
      <Routes />
      <ToastContainer />
      <ScrollToTopButton />
    </div>
  );
}

export default App;
