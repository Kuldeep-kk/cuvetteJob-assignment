import { httpAxios } from "../helper/httpHelper";


export const postNewJob=async (_id,formData,mails)=>{

    const result=await httpAxios
        .post('/api/job',{_id,...formData,mails})
        .then((response)=>response.data);
    return result;

}
