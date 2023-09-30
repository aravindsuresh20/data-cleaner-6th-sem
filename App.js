import {Routes, Route, BrowserRouter } from 'react-router-dom';
import Interface from './Interface';
import Details from './Details';

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
            <Route path="/details" element={<Details/>}/>
            <Route path="/" element={<Interface/>}/>    
        </Routes>
      </BrowserRouter>
        
      
    </div>
  );
}

export default App

