import React from 'react'
import { useUsersQuery } from '../generated/graphql'

interface Props {

}

export const Home: React.FC<Props> = () => {
    const {data} = useUsersQuery({ fetchPolicy: 'network-only'})

    if(!data) return <div>loading...</div>
    return (
        <div>
           <div>users: </div>
           <ul>
               {data.users.map((user) => <li key={user.id}>{user.id} {user.email}</li>)}
           </ul>
        </div>
    )
}