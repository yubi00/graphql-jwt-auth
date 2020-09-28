import React, { useEffect, useState } from 'react'
import { setAccessToken } from './accessToken'
import { Routes } from './Routes'

interface Props {

}

const App: React.FC<Props> = () => {
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetch("http://localhost:4000/refresh_token", { method: "POST", credentials: "include" })
        .then((data) => {
            return data.json()
        }).then(({ accessToken }) => {
            setAccessToken(accessToken)
            setLoading(false)
        }).catch((err) => {
            console.log(err.messsage)
        })
    }, [])

    if(loading) {
        return <div>loading...</div>
    }

    return (
        <div>
            <Routes/>
        </div>
    )
}

export default App
