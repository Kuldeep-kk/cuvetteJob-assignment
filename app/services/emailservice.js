import { httpAxios } from "../helper/httpHelper";


export const sendjobmails=async (emails, jobTitle, experience)=>{

    const result=await httpAxios
        .post('/api/mailopp',{emails, jobTitle, experience})
        .then((response)=>response.data);
    return result;

}
