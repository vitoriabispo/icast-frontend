import Head from 'next/head'
import styles from './styles.module.css'

import { api } from '../../../../service/api'
import { useRouter } from 'next/router'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../../../contexts/Authentication'

import Navbar from '../../../../components/Navbar'
import PodcastList from '../../components/PodcastList'
import UserProfile from '../../components/UserPerfil'
import Link from 'next/link'
import { toast } from 'react-toastify'

export default function Home() {
  const router = useRouter('');
  const { isAuthenticated } = useContext(AuthContext);
  const [ podcasts, setPodcasts ] = useState([])
  const [ alterPodcasts, setAlterPodcasts ] = useState(0)
  const [ roleChanged, setRoleChanged ] = useState(false) 

  const { role, setRole } = useContext(AuthContext);

  function handleUpgrade() {
    api.patch('user/role/upgrade').then(() => {
      toast('Upgrade feito com sucesso');
      setRole('PODCASTER');
      setRoleChanged(true);
    }).catch(() => {
      toast.error('Ops! Alguma coisa deu errado. Tente novamente.')
      setRole('DEFAULT_USER');
    })
  }

  function handleDowngrade() {
    api.patch('user/role/downgrade').then(() => {
      toast('Downgrade feito com sucesso');
      setRole('DEFAULT_USER');
      setRoleChanged(true);
    }).catch(() => {
      toast.error('Ops! Alguma coisa deu errado. Tente novamente.')
      setRole('PODCASTER');
    })
  }

  useEffect(() => {
    if(roleChanged)
      router.reload();
  }, [role, roleChanged, router]);

  useEffect(() => { 
    if(isAuthenticated) {
      api.get('podcast/me').then(response => {
        setPodcasts(response.data)
      })
    }
  }, [isAuthenticated, alterPodcasts])

  return (
    <div className={styles.container}>
      <Head>
        <title>iCast</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.grid}>
        <Navbar/>
      </div>
          <UserProfile/>
          {role === 'PODCASTER' ? (
            <div style={{marginLeft:'110px'}}>
              <h2 className={styles.pageTitle} style={{fontSize:'19px', marginTop:'40px', marginBottom:'20px'}}>Publique</h2>
              <div style={{display:'flex'}}>
                <Link href="/cadastrar/podcast">
                  <button style={{border:'1px solid #473080', color: '#473080', fontWeight:'200', cursor:'pointer',
                    fontFamily:'Montserrat, sans-serif', background:'none', width:'110px', height:'80px', display:'flex', 
                    flexDirection:'column', alignItems:'center', borderRadius:'4px' }}>
                    <p style={{fontSize:'45px', marginTop:'-6px'}}>+</p>
                    <p style={{fontSize:'10px', marginTop:'-40px'}}>Criar podcast</p>
                  </button>
                </Link>
                <Link href="/cadastrar/episodio">
                  <button style={{border:'1px solid #473080', color: '#473080', fontWeight:'200', marginLeft:'30px', cursor:'pointer',
                  fontFamily:'Montserrat, sans-serif', background:'none', width:'110px', height:'80px', display:'flex', 
                  flexDirection:'column', alignItems:'center', borderRadius:'4px' }}>
                  <p style={{fontSize:'45px', marginTop:'-6px'}}>+</p>
                  <p style={{fontSize:'10px', marginTop:'-40px'}}>Adicionar episodio</p>
                  </button>  
                </Link>
                <div>
                  <button style={{border:'1px solid #473080', color: '#473080', fontWeight:'200', marginLeft:'30px', cursor:'pointer',
                  fontFamily:'Montserrat, sans-serif', background:'none', width:'180px', height:'80px', display:'flex', 
                  flexDirection:'column', alignItems:'center', borderRadius:'4px' }}
                  onClick={handleDowngrade}>
                  <p style={{fontSize:'45px', marginTop:'-6px'}}>-</p>
                  <p style={{fontSize:'10px', marginTop:'-40px'}}>Fazer downgrade da conta</p>
                  </button>  
                </div>
              </div>
              <h2 className={styles.pageTitle}>Seus Podcasts</h2>
              {podcasts.length ? (
              <div className={styles.feed}>
                {podcasts?.map((podcast) => (
                  <PodcastList 
                    key={podcast.id} 
                    id={podcast.id}
                    title={podcast.title}
                    author={`${podcast.author.firstName} ${podcast.author.lastName}`}
                    url={podcast.coverUrl} 
                    description={podcast.description}
                    countEpisodes={podcast.Episode.length}
                    isDelete={true}
                    setAlterPodcasts={setAlterPodcasts}
                  />
                ))}
              </div>
              ) : (
                <div className={styles.feed}>
                  <p>Você não possui podcasts cadastrados</p>
                </div>
              )}

            </div>    
          ) :
          (
            <div style={{marginLeft:'130px'}}>
              <h2 className={styles.pageTitle} style={{fontSize:'19px', marginTop:'40px', marginBottom:'20px'}}>Minha conta</h2>
              <p style={{width:'380px'}}>Faça o upgrade da sua conta de ouvinte para podcaster e publique seus podcaster  de forma gratuita.</p>
              <button style={{width:'300px', height:'35px', background:'#473080', 
              borderRadius:'5px', color:'white', fontSize: '10px', border: 'none',
              cursor:'pointer'}} onClick={handleUpgrade}>SOLICITAR UPGRADE DE CONTA PODCASTER</button>
            </div>
          )
        }
      </div>             
  );
}
