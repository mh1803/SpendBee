import { About } from "./frontend/components/about/About";
import { Hero } from "./frontend/components/hero/Hero";
import { Navbar } from "./frontend/components/navbar/Navbar";
import { Upload } from "./frontend/components/upload/Upload";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <About />
      <Upload />
    </>
  );
}

export default App;
