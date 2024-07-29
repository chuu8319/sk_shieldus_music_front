import axios from "axios";
import { useState, useRef,useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import * as Swal from '../apis/alert';
import { LoginContext } from "../contexts/LoginContextProvider";

export default function MusicWrite() {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [releaseDate, setReleaseDate] = useState('');
    const { isLogin, userInfo, roles } = useContext(LoginContext);

    useEffect(() => {
        if( !isLogin || !userInfo ) {
            // alert(`로그인이 필요합니다.`)
            // navigate("/login")
            Swal.alert("로그인이 필요합니다.", "로그인 화면으로 이동합니다.", "warning", () => { navigate("/login") })
            return
          }
    }, [userInfo]);

    const changeTitle = e => setTitle(e.target.value);
    const changeArtist = e => setArtist(e.target.value);
    const changeLyrics = e => setLyrics(e.target.value);
    const changeReleaseDate = e => setReleaseDate(e.target.value);

    const refFiles = useRef();

    const [files, setFiles] = useState([]);
    const handlerChangeFiles = e => {
        const selectedFiles = e.target.files;

        if (selectedFiles.length > 3) {
            Swal.alert('이미지는 최대 3개 가능');
            refFiles.current.value = '';
            setFiles([]);
            return;
        }
        setFiles([...selectedFiles]);
    };

    const navigate = useNavigate();

    const handlerSubmit = e => {
        e.preventDefault();
        
        // 서버로 전달할 입력창 내용을 객체로 정의
        let datas = { 
            title, 
            artist, 
            lyrics, 
            releaseDate
        };

        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(datas)], { type: 'application/json' }));
        Object.values(files).forEach(file => formData.append('files', file));

        // 설정한 데이터를 JSON 형식으로 서버로 전달
        axios({
            method: 'POST', 
            url: 'http://localhost:8080/api/music/write', 
            data: formData,
            headers: {
                'Content-Type': 'multipart/form-data',
                'Authorization': `Bearer YOUR_ACCESS_TOKEN` // 필요시 인증 토큰 추가
            }
        })
        .then(res => {
            if (res && res.status === 200) navigate('/');
        })
        .catch(err => {
            if (err.response && err.response.status === 403) {
                Swal.alert('접근 권한이 없습니다.');
            } else {
                console.error(err);
            }
        });
    };

    return (
        <div className="container">
            <h2>노래 등록</h2>
            <form id="form" onSubmit={handlerSubmit}>
                <table className="music_detail">
                    <tbody>
                        <tr>
                            <td>제목</td>
                            <td><input type="text" id="title" name="title" onChange={changeTitle} /></td>
                            <td>가수명</td>
                            <td><input type="text" id="artist" name="artist" onChange={changeArtist} /></td>
                        </tr>
                        <tr>
                            <td>발매일</td>
                            <td colSpan="3"><input type="text" id="releaseDate" name="releaseDate" onChange={changeReleaseDate} placeholder="YYYY.MM.DD" /></td>
                        </tr>
                        <tr>
                            <td colSpan="4">
                                <textarea 
                                    id="lyrics" 
                                    name="lyrics" 
                                    value={lyrics} 
                                    onChange={changeLyrics} 
                                />
                            </td>
                        </tr>
                    </tbody>
                </table>
                <input ref={refFiles} onChange={handlerChangeFiles} type="file" id="files" name="files" multiple="multiple" />
                <input type="submit" id="submit" value="저장" className="btn" />
            </form>
        </div>
    );
}