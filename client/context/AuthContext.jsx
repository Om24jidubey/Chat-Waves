// import { children, createContext, useEffect, useState } from "react";
import { createContext, useEffect, useState } from "react"; // children will automatically pass as a prop by react
import axios from 'axios';
import toast from "react-hot-toast";
import {io} from "socket.io-client";


const backenedUrl=import.meta.env.VITE_BACKENED_URL
axios.defaults.baseURL=backenedUrl;
axios.defaults.withCredentials = true;

export const AuthContext=createContext();

export const AuthProvider=({children})=>{
        const [token,setToken]=useState(localStorage.getItem("token"));
        const [authUser,setAuthUser]=useState(null);
        const [onlineUsers,setOnlineUsers]=useState([]);
        const [socket,setSocket]=useState(null);

// Check if user is authenticated and if so,set user data and connect the socket
const checkAuth=async()=>{
    try {
        const {data} =await axios.get("/api/auth/check");
        if(data.success){
            setAuthUser(data.user);
            connectSocket(data.user)
        }
    } catch (error) {
        // toast.error(error.message)
        toast.error(error.response?.data?.message || error.message);
    }
}

//Login function to handle user authentication and socket connection
const login=async(state,credentials)=>{
    try {
        const {data}=await axios.post(`/api/auth/${state}`,credentials);
        if(data.success){
            setAuthUser(data.userData);
            connectSocket(data.userData);
            axios.defaults.headers.common["token"]=data.token;
            setToken(data.token);
            localStorage.setItem("token",data.token);
            toast.success(data.message)
        }else{
            toast.error(data.message)
        }
    } catch (error) {
        // toast.error(error.message)
        toast.error(error.response?.data?.message || error.message);
    }

    
}

//Logout function to handle user logout and socket disconnection
const logout=async()=>{
    localStorage.removeItem("token");
    setToken(null);
    setAuthUser(null);
    setOnlineUsers([]);
    // axios.defaults.headers.common["token"]=null;
   delete axios.defaults.headers.common["token"];
    toast.success("Logged out successfully");
    if(socket) socket.disconnect();
}

//Update profile function to handle user profile updates
const updateProfile=async(body)=>{
    try {
        const{data}=await axios.put("/api/auth/update-profile",body);
        if(data.success){
            setAuthUser(data.user);
            toast.success("Profile updated successfully")
        }
    } catch (error) {
        // toast.error(error.message);
         toast.error(error.response?.data?.message || error.message);
    }
}





//connect socket function to handle socket connection and online users updates
const connectSocket=(userData)=>{
        if(!userData || socket?.connected)return;
        const newSocket=io(backenedUrl,{
            query:{
                userId:userData._id,
            }
        });
        newSocket.connect();
        setSocket(newSocket)

        newSocket.on("getOnlineUsers",(userIds)=>{
            setOnlineUsers(userIds);
        })
}


useEffect(()=>{
    if(token){
        axios.defaults.headers.common["token"]=token;
        checkAuth();
    }
},[])

    const value={
        axios,
        authUser,
        onlineUsers,
        socket,
        login,
        logout,
        updateProfile
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}