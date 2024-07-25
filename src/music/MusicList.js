import axios from "axios"
import { useState, useEffect} from "react";
import { Link } from "react-router-dom";

export default function MusicList() {
    
    const [datas, setDatas] = useState([]);

    useEffect(() => {
        axios
            .get('http://localhost:8080/api/music')
            .then(res => {
                console.log(res.data);
                res && res.data && setDatas(res.data);
            })
            .catch(err => console.log(err));
    }, []);

    return (
        <>
            <div className="container">
                <h2>음악 목록</h2>
                <table className="music_list">
                    <colgroup>
                        <col width="15%" />
                        <col width="*" />
                        <col width="20%" />
                        <col width="20%" />
                    </colgroup>
                    <thead>
                        <tr>
                            <th scope="col">번호</th>
                            <th scope="col">제목</th>
                            <th scope="col">가수</th>
                            <th scope="col">작성일</th>
                        </tr>
                    </thead>
                    <tbody>
                        {   
                            datas.length !== 0 && datas.map((music, id) => (
                                <tr key={id}>
                                    <td>{music.musicId}</td>
                                    <td className="title">
                                    <Link to = {`/detail/${music.musicId}`}>{music.title}</Link>
                                    </td>
                                    <td>{music.artist}</td>
                                    <td>{music.createdAt}</td>
                                </tr>
                            ))
                        }   
                        {
                            datas.length === 0 && (
                                <tr>
                                    <td colSpan="4">조회된 결과가 없습니다.</td>
                                </tr>
                            )
                        }
                        
                    </tbody>
                </table>
                <Link to={'/write'} className="btn">등록</Link>
            </div>
        </>
    );
};