import React from 'react'
import { Link } from 'react-router-dom'
import { setAccessToken } from '../accessToken'
import { useLogoutMutation, useMeQuery } from '../generated/graphql'

interface Props {
    
}
const Header: React.FC<Props> = () => {
    const { data} = useMeQuery()
    const [logout, { client }] = useLogoutMutation()
    return (
        <header>
          <div>
                <Link to="/">home</Link>
         </div>
          <div>
                <Link to="/register">register</Link>
          </div>
          <div>
              <Link to="/login">login</Link>
          </div>
          <div>
              <Link to="/bye">bye</Link>
          </div>
          { data && data.me && <div> 
              <div>You are logged in as {data.me.email}</div>
                <div><button onClick={async () => {
                    await logout()
                    setAccessToken("")
                    await client!.resetStore()
                }}>logout</button></div>
               </div> 
            }
      </header>
    )
}

export default Header
