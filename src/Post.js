import { db } from './firebase.js'
import { useEffect, useState } from 'react'
import firebase from 'firebase';


function Post(props) {

    const [comentarios, setComentarios] = useState([]);

    useEffect(() => {
        db.collection('posts').doc(props.id).collection('comentarios').orderBy('uploaded', 'asc').onSnapshot((snapshot) => {
            setComentarios(snapshot.docs.map((document) => {
                return { id: document.id, info: document.data() }
            }))
        })
    }, [])

    function comentar(id, e) {
        e.preventDefault();

        var comentarioAtual = document.querySelector('#comentario-' + id).value;

        db.collection('posts').doc(id).collection('comentarios').add({
            nome: props.user,
            comentario: comentarioAtual,
            uploaded: firebase.firestore.FieldValue.serverTimestamp()
        })

        document.querySelector('#comentario-' + id).value = '';
        alert('Comentário realizado com sucesso!');

    }

    return (
        <div className='postSingle'>
            <img src={props.info.image} />
            <p><b>{props.info.username}</b>: {props.info.titulo}</p>

            <div className='coments'>
                {
                    comentarios.map(function (val) {
                        return (
                            <div className='comentSingle'>
                                <p><b>{val.info.nome}</b>: {val.info.comentario}</p>
                            </div>
                        )
                    })
                }
            </div>
            {
                (props.user)?
                <form onSubmit={(e) => comentar(props.id, e)}>
                    <textarea id={'comentario-' + props.id}></textarea>
                    <input type='submit' value='Comentar' />
                </form>
                :
                <div></div>
            }


        </div>
    )
}

export default Post;