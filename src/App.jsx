import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./components/Home";
import Register from "./components/Register"
import Auth from "./components/Auth"
import TestHome from './components/TestHome'
import Create from "./components/Create";
import TestPage from "./components/TestPage";
import UserPage from "./components/UserPage";
import Total from "./components/Total";
import { DataProvider } from './context/DataContext';

axios.defaults.withCredentials = true;

function App() {
  return (
    <DataProvider>
      <Routes>
        <Route path='/' element={<Home />}/>
        <Route path='/register' element={<Register />}/>
        <Route path='/auth' element={<Auth />}/>
        <Route path='/test' element={<TestHome />} />
        <Route path='/test/edit/:id' element={<Create />}/>
        <Route path='/test/create' element={<Create />}/>
        <Route path='/test/:id' element={<TestPage />}/>
        <Route path='/test/user/:name' element={<UserPage />}/>
        <Route path='/test/:id/results' element={<Total />}/>
      </Routes>
    </DataProvider>
  )
}

export default App