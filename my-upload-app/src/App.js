import logo from './logo.svg';
import './App.css';
import UploadForm from './UploadForm';

function App() {
  return (
    <div className="App">
      <h1>Form to Upload file to S3</h1>
      <UploadForm/>
    </div>
  );
}

export default App;
