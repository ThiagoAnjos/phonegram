import { useEffect, useState } from 'react';
import { auth, storage, db } from './firebase.js';
import  firebase from 'firebase';



function Header(props) {

    const [progress, setProgress] = useState(0);
    const [file, setFile] = useState();

    useEffect(() => {


    }, [])

    function createAccountModal(e) {
        e.preventDefault();
        let modalCreateAccount = document.querySelector('.modalCreateAccount');
        modalCreateAccount.style.display = 'block';
    }

    function fecharModalCreateAccount() {
        let modalCreateAccount = document.querySelector('.modalCreateAccount');
        modalCreateAccount.style.display = 'none';
    }

    function createAccount(e) {
        e.preventDefault();
        let email = document.getElementById('email-cadastro').value;
        let username = document.getElementById('username-cadastro').value;
        let password = document.getElementById('password-cadastro').value;
        //Criar conta no firebase

        auth.createUserWithEmailAndPassword(email, password)
            .then((authUser) => {
                authUser.user.updateProfile({
                    displayName: username
                })
                alert('Conta criada com sucesso')
                let modalCreateAccount = document.querySelector('.modalCreateAccount');
                modalCreateAccount.style.display = 'none';
            }).catch((error) => {
                alert(error.message)
            })
    }

    function login(e) {
        e.preventDefault();
        let email = document.getElementById('loginEmail').value;
        let password = document.getElementById('loginPassword').value;

        auth.signInWithEmailAndPassword(email, password)
            .then((auth) => {
                props.setUser(auth.user.displayName);
                alert('Logado com sucesso')
                window.location.href = '/';
            }).catch((error) => {
                alert(error.message);
            })
    }

    function openUploadModal(e) {
        let modalCreateAccount = document.querySelector('.modalUpload');
        modalCreateAccount.style.display = 'block';

    }
    function fecharUploadModal() {
        let modalCreateAccount = document.querySelector('.modalUpload');
        modalCreateAccount.style.display = 'none';
    }

    function uploadPost(e) {
        e.preventDefault();
        let tituloPost = document.getElementById('tituloUpload').value;        

        const uploadTask = storage.ref(`images/${file.name}`).put(file);

        uploadTask.on('state_changed', (snapshot) =>{
            const progress = Math.round(snapshot.bytesTransferred/snapshot.totalBytes) * 100;
            setProgress(progress);
        }, (error) =>{
            alert(error.message);
        }, () =>{
            storage.ref('images').child(file.name).getDownloadURL()
            .then((url)=>{
                db.collection('posts').add({
                    titulo: tituloPost,
                    image: url,
                    username: props.user,
                    uploaded: firebase.firestore.FieldValue.serverTimestamp()
                })

                setProgress(0);
                setFile(null);

                alert('Upload realizado com sucesso');
                document.getElementById('form_upload').reset();
                fecharUploadModal();
            })
        })

    }

    function logout(e) {
        e.preventDefault();
        auth.signOut().then(function(val) {
            props.setUser(null);
            window.location.href = '/';
        })
    }

    return (<div className='header'>

        <div className='modalCreateAccount'>
            <div className='formCreateAccount'>
                <div onClick={() => fecharModalCreateAccount()} className='closeModalCreateAccount'>X</div>
                <form onSubmit={(e) => createAccount(e)}>
                    <h2>Criar conta</h2>
                    <input id='email-cadastro' type='text' placeholder='E-mail' />
                    <input id='username-cadastro' type='text' placeholder='Username' />
                    <input id='password-cadastro' type='password' placeholder='Senha' />
                    <input type='submit' value='Criar conta' />
                </form>
            </div>
        </div>


        <div className='modalUpload'>
            <div className='formUpload'>
                <div onClick={() => fecharUploadModal()} className='closeModalCreateAccount'>X</div>
                <form id='form_upload' onSubmit={(e) => uploadPost(e)}>
                    <h2>Enviar foto</h2>
                    <progress id='progressUpload' value={progress}></progress>
                    <input id='tituloUpload' type='text' placeholder='Título' />
                    <input onChange={(e) => setFile(e.target.files[0])} type='file' name='file' />
                    <input type='submit' value='Enviar foto' />
                </form>
            </div>
        </div>


        <div className='center'>
            <div className='header__logo'>
                <a href=''><img src='https://firebasestorage.googleapis.com/v0/b/instagramclone-31223.appspot.com/o/Outros%2Fphotogram.png?alt=media&token=5e264a27-28c9-474b-a961-abcfd1f52b33'></img></a>
            </div>
            {
                (props.user) ?
                    <div className='header_userInfo'>
                        <span>Olá, <b>{props.user}</b></span>
                        <a onClick={(e) => openUploadModal(e)} href='#'>Postar</a>
                        <a onClick={(e) => logout(e)} href='#'>Logout</a>
                    </div>

                    :

                    <div className='header__loginForm'>
                        <form onSubmit={(e) => login(e)}>
                            <input id='loginEmail' type='text' placeholder='Login..' />
                            <input id='loginPassword' type='password' placeholder='Senha...' />
                            <input type='submit' name='acao' value='logar' />
                        </form>
                        <div className='btn__criarConta'>
                            <a onClick={(e) => createAccountModal(e)} href='#'>Criar Conta</a>
                        </div>
                    </div>
            }

        </div>
    </div>)
}

export default Header;