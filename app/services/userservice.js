import { httpAxios } from "../helper/httpHelper";


export const signup=async (user,isEmailVerified,isPhoneVerified)=>{

    const result=await httpAxios
        .post('/api/users',{...user,isEmailVerified,isPhoneVerified})
        .then((response)=>response.data);
    return result;

}
export const signin=async (email)=>{

    const result=await httpAxios
        .post('/api/signin',{email})
        .then((response)=>response.data);
    return result;

}

export const logout=async ()=>{

    const result=await httpAxios
        .post('/api/users/logout')
        .then((response)=>response.data);
    return result;

}


export async function currentUser(){

    const result=await httpAxios
        .get("/api/current")
        .then((response)=> response.data);
    return result;
}


