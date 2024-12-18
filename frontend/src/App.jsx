import "./App.css";
import Santa from "./components/event/Santa";
import Footer from "./components/footer/Footer";
import Navbar from "./components/navbar/Navbar";
import AllRoutes from "./routes/AllRoutes";

function App() {
  return (
    <div className="app">
      <Navbar />
      <AllRoutes />
      <Santa />
      <Footer />
    </div>
  );
}

export default App;
