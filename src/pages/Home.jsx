import React from 'react'
import Header from '../components/Header/Header'
import LoginContextConsumer from '../contexts/LoginContextConsumer'
import MusicList from '../music/MusicList'

const Home = () => {
  return (
    <>
        <Header />
        <div className="container">
            <h2>패트와 매트의 음악 보관함</h2>
            <hr/>
            <LoginContextConsumer />
        </div>
    </>
  )
}

export default Home