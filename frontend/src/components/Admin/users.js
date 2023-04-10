import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './orders.css';
import './users.css';
import { ToastContainer, toast } from 'react-toastify';

export const Users = () => {

    const [users, setUsers] = useState([]);
    const [update, setUpdate] = useState(null);
    const [status, setStatus] = useState(null);

    const successNotification=(username)=>{
        toast.success(`${username}'s status updated to ${status}`,{
            position:toast.POSITION.TOP_RIGHT,
            onClose:()=>{setStatus(null);getAllUsers()}
        })
    }

    const errorNotification=(msg)=>{
        toast.error(msg,{
            position:toast.POSITION.TOP_RIGHT
        })
    }

    const getAllUsers = async () => {
        await axios.get('/api/v2/allUsers').then((response) => {
            console.log(response.data);
            setUsers(response.data);
        }).catch((error) => {
            console.log(error);
        })
    }

    const listClicked=()=>{
        if(update!==null){
            setUpdate(null);
        }
    }

    const updateUserStatus=async()=>{
        if(status===null)
        {
            errorNotification('Please select an option');
        }
        else
        {
            const body={
                name:update.name,
                email:update.email,
                role:status,
            }
            const config={
                headers:{
                    'Content-type':'Application/json'
                }
            }

            await axios.put(`/api/v2/admin/updateuser/${update.id}`,body,config).then((response)=>{
                successNotification(update.name);
                setUpdate(null);
            }).catch((error)=>{
                errorNotification('Something went wrong');
            })
            
        }
    }

    useEffect(() => {
        getAllUsers();
    }, [])

    return (
        <div className='orders_container'>
            <ToastContainer autoClose={2500}/>
            <h3>Users</h3>
            {
                users.length > 0 ?
                    <div className='users_list_container' onClick={listClicked}>
                        {users.map((item, index) => (
                            <div key={index}>
                                <p>User Id: {item.id}</p>
                                <p>Name: {item.name}</p>
                                <p style={{ width: '30%', marginLeft: '4rem' }}>Email: {item.email}</p>
                                <p>Status: {item.role}</p>
                                <button onClick={()=>{setStatus(item.role);setUpdate(item)}}>Update</button>
                            </div>
                        ))}
                    </div>
                    :
                    <></>
            }
            {
                update !== null ?
                    <div className='user_update_status_container'>
                        <h1>Update status</h1>
                        <div>
                        <h3>User Id: {update.id}</h3>
                        <h3>Username: {update.name}</h3>
                        </div>
                        <div>
                            <p onClick={()=>{setStatus('admin')}} style={{backgroundColor:status==='admin'?'rgba(202, 43, 75, 0.783)':''}}>Admin</p>
                            <p onClick={()=>{setStatus('customer')}} style={{backgroundColor:status==='customer'?'rgba(202, 43, 75, 0.783)':''}}>Customer</p>
                            <p onClick={()=>{setStatus('seller')}} style={{backgroundColor:status==='seller'?'rgba(202, 43, 75, 0.783)':''}}>Seller</p>
                        </div>
                        <div>
                            <button onClick={updateUserStatus}>Confirm</button>
                        </div>
                    </div>
                    :
                    <></>
            }


        </div>
    )
}

