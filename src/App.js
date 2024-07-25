import './App.css';
import {Route, Routes} from 'react-router-dom';
import MusicList from './music/MusicList';
import MusicWrite from './music/MusicWrite';
import MusicDetail from './music/MusicDetail';

function App() {

  return (
    <>
      <Routes>
        <Route path="/" element={<MusicList />} />
        <Route path="/list" element={<MusicList />} />
        <Route path="/write" element={<MusicWrite />} />
        <Route path="/detail/:musicId" element={<MusicDetail />} />  
      </Routes>
    </>
  )
}

export default App;
