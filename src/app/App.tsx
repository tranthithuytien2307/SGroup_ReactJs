import PATHS from "./routes/route";
import "react-datepicker/dist/react-datepicker.css";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="w-full">
      <PATHS />
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            borderRadius: "10px",
            background: "#333",
            color: "#fff",
          },
        }}
      />
    </div>
  );
}

export default App;
