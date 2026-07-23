import Header from "./components/Header";
import Editor from "./Editor";
import "./index.css";

function App() {
  return (
    <div className="App">
      <Header />

      <Editor />
      <div className="other"></div>
    </div>
  );
}

export default App;
