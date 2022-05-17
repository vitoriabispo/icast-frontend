import Head from 'next/head'
import styles from './styles.module.css'
import { api } from "../../../../service/api";
import { toast } from 'react-toastify';
import Navbar from '../../../../components/Navbar'
import React, { useState } from "react"
import {useRef, useEffect} from "react"
import UserProfile from "../../components/UserPerfil"

export default function CadastroPodcast() {
  const [image, setImage] = useState();
  const [preview, setPreview] = useState();
  const fileInputRef = useRef();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  function handleSignup(event) {
    event.preventDefault();
    setLoading(true);
    const data = new FormData();
    data.append('title', title);
    data.append('description', description);
    data.append('cover', image);
    api.post("podcast/create", data).then((response) => {
        response.data && setLoading(false);
        toast("Cadastro realizado com sucesso!");
      
    }).catch((error) => {
      setLoading(false);
      toast.error("Ops! Algo deu errado, tente novamente.");
    })
      
  }

  useEffect(() => {
    if(image){
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(image);
    }else{
      setPreview(null);
    }
  }, [image]);

  return (
    <div className={styles.container}>
      <Head>
        <title>iCast</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.grid}>
        <Navbar/>
        <main className={styles.main}>
          <UserProfile />
          <div className={styles.criarPodcast}>
              <p className={styles.titleCriarPodcast}>Criar Podcast</p>
              <p className={styles.subtitleCriarPodcast}>Crie um novo podcast</p>
              <div className={styles.organizaFormulario}>
                <label className={styles.label}>Nome do podcast</label>
                <input className={styles.input } onChange={(e) => {setTitle(e.target.value)}}></input>
                <label className={styles.label}>Descrição do podcast</label>
                <textarea className={styles.textarea} onChange={(e) => {setDescription(e.target.value)}}></textarea>
                <label className={styles.label}>Capa do podcast</label>
                {preview ? (
                  <img style={{height:'120px', objectFit: 'cover',
                   cursor: 'pointer', borderRadius:'4px'}}
                    src={preview} 
                    alt={preview}
                    onClick={() => {
                      setImage(null);
                    }}></img>
                ) : (
                  <button 
                    style={{height:'100%', objectFit: 'cover', 
                    background:'white', border: '1px solid #98AFCA', 
                    borderRadius: '4px', cursor: 'pointer'}}
                    onClick={(event) => {
                    event.preventDefault();
                    fileInputRef.current.click();
                  }}>
                    <p style={{color: '#6F7782', fontWeight: '200', fontSize:'40px'}}>+</p></button>
                )}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  style={{display: "none"}}
                  accept="image/*"
                  onChange={(event) => {
                    const file = event.target.files[0];
                    if(file && file.type.substr(0, 5) === "image"){
                      setImage(file);
                    }else{
                      setImage(null);
                    }
                  }}
                  >
                  </input>
                  <button className={styles.buttonEnviar} onClick={handleSignup} disabled={loading}>
                    {!loading ? "Enviar" : "Carregando..."}
                  </button>
              </div>
            </div>
        </main>
      </div>
     
    </div>
  )
}