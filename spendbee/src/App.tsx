import { About } from "./frontend/components/about/About";
import { Hero } from "./frontend/components/hero/Hero";
import { Navbar } from "./frontend/components/navbar/Navbar";
import { Upload } from "./frontend/components/upload/Upload";
import "./global.css";

function App() {
  return (
    <div className="AppLayout">
      <Navbar />

      <main className="AppContent">
        <Hero />
        <About />
        <Upload />
      </main>
    </div>
  );
}

export default App;
