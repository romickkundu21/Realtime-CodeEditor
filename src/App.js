import './App.css';
import {BrowserRouter, Routes, Route} from 'react-router-dom';
import Home from './pages/Home';
import EditorPage from './pages/EditorPage';
import { Toaster } from 'react-hot-toast';

function App() {
  return (
    <>
    <Toaster position="top-right" toastOptions={{
      success:{
        theme:{
          primary:'#5daa2c',
        },
      },
    }}>

    </Toaster>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home/>}></Route>
        <Route path="/editor/:roomID" element={<EditorPage/>}></Route>
      </Routes>
    </BrowserRouter>
    </>
  );
}

export default App;
