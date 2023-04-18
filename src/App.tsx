import Editor from "./Editor";
import "./index.css";

function App() {
  return (
    <div className="App">
      <h1>Rich Text Example</h1>
      <p>Note: this is an experimental build of Lexical</p>

      <Editor />
      <div className="other"></div>
    </div>
  );
}

export default App;
