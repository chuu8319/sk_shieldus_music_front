import axios, { formToJSON } from "axios";
import { useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function MusicWrite() {
    const [title, setTitle] = useState('');
    const [artist, setArtist] = useState('');
    const [lyrics, setLyrics] = useState('');
    const [releaseDate, setReleaseDate] = useState('');

    const changeTitle = e => setTitle(e.target.value);
    const changeArtist = e => setArtist(e.target.value);
    const changeLyrics = e => setLyrics(e.target.value);
    const changeReleaseDate = e => setReleaseDate(e.target.value);

    const refFiles = useRef();

    const [files, setFiles] = useState([]);
    const handlerChangeFiles = e => {
        const files = e.target.files;

        if(files.length > 3) {
            alert('이미지는 최대 3개 가능');
            refFiles.current.value='';
            setFiles([]);
            return;
        }
        setFiles([...files]);
    };

    const navigate = useNavigate();

    // 서버로 전달할 입력창 내용을 객체로 정의 (단축 속성명)
    let datas = { 
        title, 
        artist, 
        lyrics, 
        releaseDate
    };

    const formData = new formData();
    formData.append('data', new Blob([JSON.stringify(datas)], {type: 'application/json'}));
    Object.values(files).forEach(file => formData.append('files', file));

    // 설정한 데이터를 JSON 형식으로 서버로 전달
    const handlerSubmit = e => {
        e.preventDefault();
        axios({
            method: 'POST', 
            url: 'http://localhost:8080/api/music/write', 
            data: formData,
            headers: { 'Content-Type': 'multipart/form-data' },
            data: JSON.stringify(datas)
        })
        .then(res => {
            res && res.status === 200 && navigate('/');
        })
        .catch(err => console.log(err));
    };

    return (
        <>
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
                                    name="ltrics" 
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
        </>
    );
};