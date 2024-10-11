import React from 'react'

const Badge = ({ type }) => {
    const green = 'badge border-green-500 text-green-500 badge-outline ml-2'
    const blue = 'badge badge-primary badge-outline ml-2'
    const red = 'badge badge-outline border-red-500 text-red-500 ml-2'

    const profileData = "badge badge-info gap-2 ml-2 "
    const yellow = "badge badge-warning gap-2 ml-2"

    return (
        <span>
            {type === 'create' && <div className={green}>create</div>}
            {type === 'update' && <div className={blue}>update</div>}
            {type === 'delete' && <div className={blue}>delete</div>}

            {type === 'child' && <div className={profileData}>PROFILE</div>}
            {type === 'document' && <div className={yellow}>DOCUMENT</div>}

            {type === 'admin' && <div className={green}>ADMIN</div>}
            {type === 'staff' && <div className={green}>STAFF</div>}
            {type === 'head' && <div className={green}>HEAD</div>}
            {type === 'social' && <div className={green}>SOCIAL WORKER</div>}
            {type === 'user' && <div className={green}>GENERAL</div>}

        </span>
    )
}

export default Badge