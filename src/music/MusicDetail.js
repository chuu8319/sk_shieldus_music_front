import axios from "axios";
import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

export default function MusicDetail() {
    const [music, setMusic] = useState({});
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    
    const { musicId } = useParams();
    const navigate = useNavigate();

    const listButtonClick = e => { 
        e.preventDefault();
        navigate('/');  // 또는 navigate('/list') 또는 navigate(-1)
    };

    const updateButtonClick = e => { 
        e.preventDefault();

        axios
            .put(`http://localhost:8080/api/music/${musicId}`, { title, artist, releaseDate, lyrics })
            .then(res => {
                res && res.status === 200 && navigate('/')
            })
            .catch(err => console.log(err));
    };

    const deleteButtonClick = e => { 
        e.preventDefault();

        axios
            .delete(`http://localhost:8080/api/music/${musicId}`)
            .then(res => {
                res && res.status === 200 && navigate('/')
            })
            .catch(err => console.log(err));        
    };

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/music/${musicId}`)
            .then(res => {
                if (res && res.data) {
                    setTitle(res.data.title);
                    setArtist(res.data.artist);
                    setLyrics(res.data.lyrics);
                    setReleaseDate(res.data.releaseDate);
                }
            })
            .catch(err => console.log(err));
    }, [musicId]);

    return (
        <>
            <div className="container">
                <h2>음악 정보</h2>
                <form id="form" method="post">
                    <input type="hidden" id="musicId" name="musicId" />
                
                    <table className="music_detail">
                        <colgroup>
                            <col width="15%" />
                            <col width="*"   />
                            <col width="15%" />
                            <col width="35%" />
                        </colgroup>
                        <tbody>
                        <tr>
                            <th scope="row">번호</th>
                            <td colSpan="3">{musicId}</td>
                        </tr>
                        <tr>
                            <th scope="row">제목</th>
                            <td><input type="text" id="title" name="title" value={title} onChange={e => setTitle(e.target.value)}/></td>
                            <th scope="row">가수</th>
                            <td><input type="text" id="artist" name="artist" value={artist} onChange={e => setArtist(e.target.value)}/></td>
                        </tr>
                        <tr>
                            <th scope="row">발매일</th>
                            <td colSpan="3"><input type="text" id="releaseDate" name="releaseDate" value={releaseDate} onChange={e => setReleaseDate(e.target.value)}/></td>
                        </tr>
                        <tr>
                            <td colSpan="4">
                                <textarea 
                                    id="lyrics" 
                                    name="ltrics" 
                                    value={lyrics} 
                                    onChange={e => setLyrics(e.target.value)}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
                
                <input type="button" id="update" className="btn" value="수정" onClick={updateButtonClick} />
                <input type="button" id="list" className="btn" value="목록" onClick={listButtonClick} />
                <input type="button" id="delete" className="btn" value="삭제" onClick={deleteButtonClick} />
            </div>    
        </>
    );
};