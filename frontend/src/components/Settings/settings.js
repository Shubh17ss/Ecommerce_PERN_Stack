import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios';
import './settings.css'
import { FaUserAlt } from 'react-icons/fa';
import { GrMail } from 'react-icons/gr';
import { AiTwotoneDelete, AiTwotoneLock, AiOutlineClose } from 'react-icons/ai';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';





export const Settings = ({ user }) => {

    const navigate = useNavigate();

    const [update, setUpdate] = useState(null);
    const [name, setName] = useState(user.name);
    const [email, setEmail] = useState(user.email);

    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");

    const successToast = (msg) => {
        if (msg === 'Password changed') {
            toast.success(msg, {
                position: toast.POSITION.TOP_RIGHT
            })
        }
        else {
            toast.success(msg, {
                position: toast.POSITION.TOP_RIGHT,
                onClose: () => { window.location.reload() }
            })
        }
    }

    const errorToast=(msg)=>{
        toast.error(msg,{
            position:toast.POSITION.TOP_RIGHT,
        })
    }

    const handleUpdate = async () => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = {
            name: name,
            email: email
        };

        axios.put('/api/v2/profile/updateProfile', body, config).then((response) => {
            setUpdate(null);
            successToast('Profile updated');
        }).catch((error) => {
            console.log(error);
        })
    }

    const handlePasswordChange = async () => {

        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = {
            oldPassword: oldPassword,
            newPassword: newPassword,
        }

        console.log(oldPassword, newPassword);
        axios.put('/api/v2/profile/changepassword', body, config).then((response) => {
            setUpdate(null);
            successToast('Password changed');
        }).catch((error) => {
            errorToast(error.response.data);
        })
    }

    const handleDeleteAccount = async () => {
        console.log(oldPassword);
        const config = {
            headers: {
                'Content-Type': 'application/json'
            }
        }

        const body = {
            password: oldPassword
        }

        await axios.post('/api/v2/profile/delete', body, config).then((response) => {
            console.log(response);
            handleLogOut();
        }).catch((error) => {
            errorToast(error.response.data);
        })
    }

    const handleLogOut = async () => {
        localStorage.removeItem('UserId');
        localStorage.removeItem('Auth Token');
        await axios.get('/api/v2/logoutUser').then((response) => {
            console.log(response);
            navigate('/signIn');
        }).then((error) => {
            console.log(error);
        })
    }


    return (
        <>
            <ToastContainer />
            <div className='settings_page'>
                <div className='header'>
                    <p>Settings</p>
                    <p style={{ fontSize: '1.2rem', marginTop: '1rem', color: 'rgba(255,255,255,0.7)' }}>Here you can change your profile</p>
                </div>

                <div className='personal_info_section'>
                    <div className='card'>
                        <FaUserAlt style={{ fontSize: '1.2rem' }} />
                        <p>{user.name}</p>
                        <button className='edit_button' onClick={() => setUpdate('name')}>Update</button>
                    </div>
                    <div className='card'>
                        <GrMail style={{ fontSize: '1.2rem' }} />
                        <p>{user.email}</p>
                        <button className='edit_button' onClick={() => setUpdate('email')}>Update</button>
                    </div>
                    <div className='card'>
                        <AiTwotoneLock style={{ fontSize: '1.4rem' }} />
                        <p>***********</p>
                        <button className='edit_button' onClick={() => setUpdate('password')}>Update</button>
                    </div>
                    <div className='card'>
                        <AiTwotoneDelete style={{ fontSize: '1.4rem' }} />
                        <p>By deleting your profile, you will permanently loose access.</p>
                        <button className='edit_button delete' onClick={() => setUpdate('delete')}>Delete</button>
                    </div>
                </div>
                {
                    update !== null ?
                        <div className='update_area'>
                            <AiOutlineClose style={{ color: 'rgba(202, 43, 75, 0.783)', fontSize: '1.2rem', alignSelf: 'flex-end' }} onClick={() => { setUpdate(null); setName(user.name) }} />
                            {
                                update === 'name' ?
                                    <div>
                                        <h3>Update username</h3>
                                        <input type="text" value={name} onChange={(e) => { setName(e.target.value) }}></input>
                                        <button className='confirm_update_button' onClick={handleUpdate}>Confirm</button>
                                    </div>
                                    :
                                    update === 'email' ?
                                        <div>
                                            <h3>Update email</h3>
                                            <input type="email" value={email} onChange={(e) => { setEmail(e.target.value) }}></input>
                                            <button className='confirm_update_button' onClick={handleUpdate}>Confirm</button>
                                        </div>
                                        :
                                        update === 'password' ?
                                            <div>
                                                <h3>Update Password</h3>
                                                <input type="password" value={oldPassword} onChange={(e) => { setOldPassword(e.target.value) }} placeholder='old password'></input>
                                                <input type="password" value={newPassword} onChange={(e) => { setNewPassword(e.target.value) }} placeholder='new password'></input>
                                                <button className='confirm_update_button' onClick={handlePasswordChange}>Confirm</button>
                                            </div>
                                            :
                                            update === 'delete' ?
                                                <div>
                                                    <h3>Delete account</h3>
                                                    <input type="password" value={oldPassword} onChange={(e) => { setOldPassword(e.target.value) }} placeholder='Please enter your password'></input>
                                                    <button className='confirm_update_button' onClick={handleDeleteAccount}>Delete</button>
                                                </div>
                                                :
                                                <></>
                            }
                        </div>
                        :
                        <></>
                }

            </div>
        </>

    )
}

