import axios from "axios"
import { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { LoginContext } from "../contexts/LoginContextProvider";
import * as Swal from '../apis/alert';
import { useRef } from "react";

export default function MusicList() {
    
    const [search, setSearch] = useState('');
    const [datas, setDatas] = useState([]);
    const { isLogin, userInfo, roles } = useContext(LoginContext);
    const navigate = useNavigate();

    const refSearch = useRef();
    
    const searchMusics = e => {
        e.preventDefault();

        if(search === "") {
            axios
            .get('http://localhost:8080/api/music')
            .then(res => {
                console.log(res.data);
                res && res.data && setDatas(res.data);
            })
            .catch(err => console.log(err));
        } else {
            axios
            .get(`http://localhost:8080/api/music/lyrics/${search}`)
            .then(res => {
                console.log(res.data);
                res && res.data && setDatas(res.data);
            })
            .catch(err => console.log(err));

            refSearch.current.focus();
            setSearch('');
        }
    }

    useEffect(() => {
        if( !isLogin || !userInfo ) {
            // alert(`로그인이 필요합니다.`)
            // navigate("/login")
            Swal.alert("로그인이 필요합니다.", "로그인 화면으로 이동합니다.", "warning", () => { navigate("/login") })
            return
          }
          
        axios
            .get('http://localhost:8080/api/music')
            .then(res => {
                console.log(res.data);
                res && res.data && setDatas(res.data);
            })
            .catch(err => console.log(err));

        refSearch.current.focus();
    }, []);

    return (
        <>
            <div className="container">
                <h2>음악 목록</h2>
                <form onSubmit={searchMusics}>
                    <input type="text" placeholder="가사를 입력하세요." value={search} ref={refSearch} onChange={e => setSearch(e.target.value)} style={{height: "30px", width: "300px"}}></input>
                    <button type="submit" style={{height: "30px", width: "50px", margin: "15px"}}>검색</button>
                </form>
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