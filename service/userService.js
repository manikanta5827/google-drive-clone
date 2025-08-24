

export const formatUserResponse = (userData) => {
    return {
        user_id:userData.id,
        username:userData.username,
        email:userData.email,
        profilePic:userData.profilePic,
        emailVerified:userData.emailVerified,
        lastLogin:userData.lastLogin
    }
}