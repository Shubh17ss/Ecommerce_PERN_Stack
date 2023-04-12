import React, {useState} from 'react'
import axios from 'axios';
import {useNavigate} from 'react-router-dom';
import { SmallLoader } from '../Loader/loader';
import './signIn.css'

export const SignIn = () => {

    const navigate=useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const [name, setName] = useState('');
    const [semail, setSemail]=useState('');
    const [spassword, setSpassword]=useState('');
    const [sLoading, setSLoading]=useState(false);


    const notValid=(value)=>{
        if(value==='')
        return true;
        
        return false;
    }

    const handleSignIn=async()=>{
        if(notValid(email) || password.length===0)
        {
            alert('Invalid email or password');
            return;
        }
        else{
            setLoading(true);
            let body={email:email,password:password};
            const config={
                headers:{
                    'Content-Type':'application/json'
                }
            };

            body=JSON.stringify(body);
            await axios.post('/api/v2/loginUser',body,config).then((response)=>{
                localStorage.setItem('Auth Token',response.data.token);
                localStorage.setItem('UserId',response.data.results.rows[0].id);
                setLoading(false);
                navigate('/profile',{state:{comp:'Orders'}});
            }).catch((error)=>{alert('Wrong email or password'); setLoading(false);})
        }
    }

    const handleSignUp=async()=>{
        setSLoading(true);
        console.log(name,semail,spassword);
        const config={
            headers:{
                'Content-Type':'application/json'
            }
        }
        const body={
            name:name,
            email:semail,
            password:spassword,
            image_url:'',
            role:'user'
        }
        await axios.post('/api/v2/createUser',body,config).then((response)=>{
           console.log(response);
           localStorage.setItem('UserId',response.data.results.rows[0].id);
           localStorage.setItem('Auth Token',response.data.token);
           setSLoading(false);
           navigate('/profile',{state:{comp:'Orders'}});
        }).catch((error)=>{
            alert(error.response.data);
            setSLoading(false);
        })
    }

    return (
        <div className='signInPage'>
            <div className='section login'>
                <h3>Login In</h3>
                <div className='input_area' style={{marginBottom:'2rem'}}>
                     <p>Email address</p>
                     <input type="text" placeholder='test@gmail.com' value={email}
                      onChange={(e)=>{setEmail(e.target.value)}}>
                     </input>
                </div>
                <div className='input_area'>
                     <p>Password</p>
                     <input type="password" placeholder='Your password' value={password}
                     onChange={(e)=>{setPassword(e.target.value)}}></input>
                </div>

                <button className='signInButton' onClick={handleSignIn}>{loading?<SmallLoader/>:'Sign In'}</button>
                
            </div>
            <h3>Or</h3>
            <div className='section signup'>
                <h3 style={{marginBottom:'2rem'}}>Sign Up</h3>
                <div className='input_area'>
                     <p>Name</p>
                     <input type="text" placeholder='Your name' value={name} onChange={(e)=>{setName(e.target.value)}}></input>
                </div>
                <div className='input_area' style={{marginTop:'1.5rem'}}>
                     <p>Email address</p>
                     <input type="text" placeholder='test@gmail.com' value={semail} onChange={(e)=>{setSemail(e.target.value)}}></input>
                </div>
                <div className='input_area'style={{marginTop:'1.5rem'}}>
                     <p>Password</p>
                     <input type="password" placeholder='Your password' value={spassword} onChange={(e)=>{setSpassword(e.target.value)}}></input>
                </div>

                <button className='signInButton' onClick={handleSignUp}>{sLoading?<SmallLoader/>:'Sign Up'}</button>
            </div>
        </div>
    )
}

