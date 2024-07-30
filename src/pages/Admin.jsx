import React, { useContext, useEffect, useState } from 'react';
import Header from '../components/Header/Header';
import { LoginContext } from '../contexts/LoginContextProvider';
import { useNavigate } from 'react-router-dom';
import * as Swal from '../apis/alert';
import axios from 'axios';
import Cookies from 'js-cookie';

const Admin = () => {
  const [datas, setDatas] = useState([]);  // 초기 상태를 빈 배열로 설정
  const { isLogin, userInfo, roles } = useContext(LoginContext);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);  // 로딩 상태 추가

  useEffect(() => {
    if (!isLogin || !userInfo) {
      Swal.alert("로그인이 필요합니다.", "로그인 화면으로 이동합니다.", "warning", () => { navigate("/login") });
      return;
    }
    if (!roles.isAdmin) {
      Swal.alert("권한이 없습니다.", "이전 화면으로 이동합니다.", "warning", () => { navigate(-1) });
      return;
    }

    // 인증 토큰이 있다면 헤더에 추가
    const token = Cookies.get("accessToken");
    console.log(token);

    axios
      .get('/users/admin', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      .then(res => {
        console.log(res.data);
        if (res && res.data) {
          setDatas(res.data);
        }
      })
      .catch(err => {
        if (err.response && err.response.status === 403) {
          Swal.alert("접근 권한이 없습니다.", "이전 화면으로 이동합니다.", "warning", () => { navigate(-1) });
        } else {
          console.log(err);
        }
      })
      .finally(() => setLoading(false));  // 로딩 상태 업데이트
  }, [isLogin, userInfo, roles, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      {isLogin && roles.isAdmin && (
        <>
          <Header />
          <div className="container">
            <h1>Admin</h1>
            <hr />
            <table className="user_list">
              <colgroup>
                <col width="10%" />
                <col width="15%" />
                <col width="20%" />
                <col width="20%" />
                <col width="20%" />
              </colgroup>
              <thead>
                <tr>
                  <th scope="col">번호</th>
                  <th scope="col">아이디</th>
                  <th scope="col">이름</th>
                  <th scope="col">이메일</th>
                  <th scope="col">생성일</th>
                </tr>
              </thead>
              <tbody>
                {datas.length > 0 ? (
                  datas.map((user, id) => (
                    <tr key={id}>
                      <td>{user.no}</td>
                      <td>{user.userId}</td>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.regDate}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">조회된 결과가 없습니다.</td>  {/* colSpan 수정 */}
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </>
      )}
    </>
  );
};

export default Admin;