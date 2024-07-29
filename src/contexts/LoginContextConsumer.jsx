import React, { useContext } from 'react'
import { LoginContext } from './LoginContextProvider'
import MusicList from '../music/MusicList'
import { RiFolderMusicLine } from "react-icons/ri";

const LoginContextConsumer = () => {
    const { isLogin } = useContext(LoginContext)

  return (
    <div>
        {
            isLogin  ? <MusicList /> :  <RiFolderMusicLine size="200"/>
        }
        <p>로그인 여부 : {isLogin ? '로그인' : '로그아웃'} </p>
    </div>
  )
}

export default LoginContextConsumer