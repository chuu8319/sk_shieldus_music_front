import axios from "axios";
import { useState, useEffect, useContext} from "react";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContextProvider";
import * as Swal from '../apis/alert';

export default function MusicDetail() {
    const [music, setMusic] = useState({});
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [releaseDate, setReleaseDate] = useState('');

    const { musicId } = useParams();
    const navigate = useNavigate();

    const { isLogin, userInfo, roles } = useContext(LoginContext);
    useEffect(() => {
        if( !isLogin || !userInfo ) {
            // alert(`로그인이 필요합니다.`)
            // navigate("/login")
            Swal.alert("로그인이 필요합니다.", "로그인 화면으로 이동합니다.", "warning", () => { navigate("/login") })
            return
          }
    }, [userInfo]);

    const listButtonClick = e => { 
        e.preventDefault();
        navigate('/'); 
    };

    const updateButtonClick = e => { 
        e.preventDefault();

        axios
            .put(`http://localhost:8080/api/music/${musicId}`, { title, artist, releaseDate, lyrics })
            .then(res => {
                if (res.status === 200) {
                    navigate('/');
                }
            })
            .catch(err => console.error("Failed to update music:", err));
    };

    const deleteButtonClick = e => { 
        e.preventDefault();

        axios
            .delete(`http://localhost:8080/api/music/${musicId}`)
            .then(res => {
                if (res.status === 200) {
                    navigate('/');
                }
            })
            .catch(err => console.error("Failed to delete music:", err));
    };

    useEffect(() => {
        axios
            .get(`http://localhost:8080/api/music/${musicId}`)
            .then(res => {
                if (res.data) {
                    setMusic(res.data);
                    setTitle(res.data.title);
                    setArtist(res.data.artist);
                    setLyrics(res.data.lyrics);
                    setReleaseDate(res.data.releaseDate);
                }
            },[])
            .catch(err => console.log(err));
    }, [musicId]);

    const handlerDownload = (e, fileInfo) => {
        e.preventDefault();

        const { musicId, id, originalFileName } = fileInfo;

        axios({
            url: `http://localhost:8080/api/music/file/${musicId}/${id}`,
            method: 'GET',
            responseType: 'blob'
        })
        .then(res => {
            const href = URL.createObjectURL(res.data);

            const link = document.createElement('a');
            link.href = href;
            link.setAttribute('download', originalFileName);
            document.body.appendChild(link);
            link.click();

            document.body.removeChild(link);
            URL.revokeObjectURL(href);
        })
    }


    return (
        <>
            <div className="container">
                <h2>음악 정보</h2>
                <form id="form" method="post">
                    <input type="hidden" id="musicId" name="musicId" />
                
                    <table className="music_detail">
                        <colgroup>
                            <col width="15%" />
                            <col width="*" />
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
                                    name="lyrics" 
                                    value={lyrics} 
                                    onChange={e => setLyrics(e.target.value)}
                                />
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </form>
                <div className="file_list">
                    {
                        music.fileInfoList && music.fileInfoList.map((fileInfo, idx) => (
                            <div key={idx}><a onClick={e => handlerDownload(e, fileInfo)} style={{ cursor: 'pointer' }}>{fileInfo.originalFileName} ({fileInfo.fileSize}kb)</a></div>
                        ))
                    }
                </div>
                <input type="button" id="update" className="btn" value="수정" onClick={updateButtonClick} />
                <input type="button" id="list" className="btn" value="목록" onClick={listButtonClick} />
                <input type="button" id="delete" className="btn" value="삭제" onClick={deleteButtonClick} />
            </div>    
        </>
    );
}