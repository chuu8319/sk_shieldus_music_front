import './App.css';
import {Route, Routes} from 'react-router-dom';
import MusicList from './music/MusicList';
import MusicWrite from './music/MusicWrite';
import MusicDetail from './music/MusicDetail';
import Home from './pages/Home';
import Login from './pages/Login';
import Join from './pages/Join';
import User from './pages/User';
import LoginContextProvider from './contexts/LoginContextProvider';
import Admin from './pages/Admin';

function App() {

  return (
    <>
    <LoginContextProvider>
      <Routes>
        <Route path="/list" element={<MusicList />} />
        <Route path="/write" element={<MusicWrite />} />
        <Route path="/detail/:musicId" element={<MusicDetail />} />
        
        <Route path="/" element={ <Home /> }></Route>
        <Route path="/login" element={ <Login /> }></Route>
        <Route path="/join" element={ <Join /> }></Route>
        <Route path="/user" element={ <User /> }></Route>
        <Route path="/admin" element={ <Admin /> }></Route>
      </Routes>
      </LoginContextProvider>
    </>
  )
}

export default App;
