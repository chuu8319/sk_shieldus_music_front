import React, { useContext } from 'react'
import './Header.css'
import { Link } from 'react-router-dom'
import { LoginContext } from '../../contexts/LoginContextProvider'
import { HiOutlineHome } from "react-icons/hi2";

const Header = () => {
    const { isLogin, login, logout } = useContext(LoginContext);
    
    return (
        <header>
            <div className="logo">
                <Link to="/">
                    <HiOutlineHome size="50"/>
                </Link>
            </div>

            <div className="util">
                {
                    !isLogin 
                    ? 
                    /* 비로그인 시 */
                    <ul>
                        <li><Link to="/login">로그인</Link></li>
                        <li><Link to="/join">회원가입</Link></li>
                        <li><Link to="/admin">관리자</Link></li>
                    </ul>
                    :
                    /* 로그인 시 */
                    <ul>
                        <li><Link to="/user">마이페이지</Link></li>
                        <li><Link to="/admin">관리자</Link></li>
                        <li><button style={{fontSize: "14px", color: "gray"}} className='link' onClick={ () => logout()}>로그아웃</button></li>
                    </ul>
                }
            </div>
        </header>
    )
}

export default Header