import { Database, Hexagon } from "lucide-react";
import "./App.css";

function App() {
  return (
    <div className="w-full h-full flex items-center justify-center text-6xl text-primary">
      <div className="flex  items-center">
        <div className="flex">
          <div>
            <Hexagon className="text-secondary rotate-90" />
            <Hexagon className="text-secondary rotate-90" />
          </div>
          <Hexagon className="self-center rotate-90 text-secondary" />
        </div>
        Hive
      </div>
      <span className="text-lg">0.1</span>
    </div>
  );
}

export default App;
