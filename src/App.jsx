import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import axios from "axios";
import Home from "./components/Home";
import Register from "./components/Register"
import Auth from "./components/Auth"
import TestHome from './components/TestHome'
import Create from "./components/Create";
import TestPage from "./components/TestPage";
import Total from "./components/Total";

axios.defaults.withCredentials = true;

function App() {
  return (
    <Routes>
      <Route path='/' element={<Home />}/>
      <Route path='/register' element={<Register />}/>
      <Route path='/auth' element={<Auth />}/>
      <Route path='/test' element={<TestHome />} />
      <Route path='/test/create' element={<Create />}/>
      <Route path='/test/:id' element={<TestPage />}/>
      <Route path='/test/:id/total' element={<Total />}/>
    </Routes>
  )
}

export default App