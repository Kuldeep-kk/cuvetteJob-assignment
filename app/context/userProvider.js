"use client";
import {useEffect, useState} from "react";
import UserContext from "@/app/context/userContext";
import { currentUser } from "../services/userservice";
import {LoadingTImeFn} from "@/app/components/LoadingTImeFn";



const UserProvider=({children})=>{

    const [user,setUser]=useState(undefined);
   
    useEffect(()=>{
        async function load(){
            try{
                console.log("Getting User Data");

                const logUser=await currentUser();
                setUser({...logUser});
                if(logUser){
                    LoadingTImeFn();
                }
                else{
                    console.log('');
                }
            }
            catch (e) {
                console.log(e);
            }
        }
        load();


    },[]);


    return(
        <UserContext.Provider value={{user,setUser
        }}>
            {children}
        </UserContext.Provider>
    );


}
export default UserProvider;
