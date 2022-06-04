import Head from 'next/head'
import styles from './styles.module.css'

import Slider from "react-slick"
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

import { GrClose } from 'react-icons/gr'
import { FiSearch } from 'react-icons/fi'
import { TiMediaPlayReverse, TiMediaPlay } from 'react-icons/ti'

import { toast } from 'react-toastify';
import { api } from '../../../../service/api'
import { useState, useContext, useEffect } from 'react'
import { AuthContext } from '../../../../contexts/Authentication'

import Navbar from '../../../../components/Navbar'
import Player from '../../components/PodcastPlayer'
import PodcastList from '../../components/PodcastList'
import CardPodcastCarousel from '../../components/CardPodcastCarousel'

const SlickArrowLeft = ({ currentSlide, slideCount, ...props }) => (
  <TiMediaPlayReverse {...props} style={{backgroundColor:'#fafafa', width: '35px',
  height:'35px', borderRadius: '100%', display: 'flex',  fontSize:'30px',
  alignItems:'center', justifyContent: 'center', cursor: 'pointer', color:'black', zIndex:'99'
}}/>
);

const SlickArrowRight = ({ currentSlide, slideCount, ...props }) => (
  <TiMediaPlay {...props} style={{backgroundColor:'#fafafa', width: '35px',
  height:'35px', borderRadius: '100%', display: 'flex',  fontSize:'30px',
  alignItems:'center', justifyContent: 'center', cursor: 'pointer', color:'black', zIndex:'99'
}}/>
);

const settings = {
  dots: false,
  infinite: false,
  speed: 500,
  slidesToShow: 2.2,
  slidesToScroll: 1,
  prevArrow: <SlickArrowLeft />,
  nextArrow: <SlickArrowRight />
};

export default function Home() {
  const { isAuthenticated } = useContext(AuthContext);
  const [ podcasts, setPodcasts ] = useState([]) 
  const [ spotlights, setSpotlights ] = useState([]) 
  const [ keyword, setKeyword ] = useState("");
  const [ searchResult, setSearchResult] = useState([])

  useEffect(() => { 
    if(isAuthenticated) {
      api.get('podcast').then(response => {
        setPodcasts(response.data)
      })
    }
  }, [isAuthenticated])
  
  useEffect(() => { 
    if(isAuthenticated) {
      api.get('podcasts/spotlights').then(response => {
        setSpotlights(response.data)
      })
    }
  }, [isAuthenticated])

  useEffect(() =>{
    if(keyword){
      handleSearch();
    }
  }, [keyword])

  function handleSearch() {
    api.get('podcasts/search', { params: { keyword: keyword } }).then(response => {
      setSearchResult(response.data)
    })
    .catch((error) => {
      toast.error("Ops! Algo deu errado, tente novamente.");
    })
  }

  function handleRedirect(event){
    event.preventDefault();
    setSearchResult([])
    setKeyword("")
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>iCast</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.grid}>
        <Navbar/>
        <div className={styles.main}>
          <div className={styles.search}>
            <input type="text" value={keyword} id="searchBar" placeholder="Buscar podcasts" onChange={(e) => {setKeyword(e.target.value)}}/>
            { keyword ? 
              <div className={styles.icon} onClick={handleRedirect} style={{cursor: 'pointer'}}><GrClose/></div> : 
              <div className={styles.icon}><FiSearch/></div> 
            }    
          </div>
          { keyword.length ? (
             searchResult.length > 0 ? (
              <div> 
                <h2 className={styles.pageTitle}>RESULTADOS</h2>
                <div className={[styles.feed, styles.result].join(" ")}>
                  {searchResult?.map((podcast) => (
                    <PodcastList 
                      key={podcast.id} 
                      id={podcast.id}
                      title={podcast.title}
                      author={`${podcast.author.firstName} ${podcast.author.lastName}`}
                      url={podcast.coverUrl} 
                      description={podcast.description}
                      countEpisodes={podcast.Episode.length}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className={styles.keywordNotFound}>
                <h3>Nenhum resultado encontrado para "{keyword}" </h3> 
                <p>Confira se você digitou corretamente ou use menos palavras-chave ou palavras-chave diferentes.</p>
              </div>
            )
          ) : (
            <div>
              <div className={styles.highlights}>
                <h2 className={styles.pageTitle}>DESTAQUES</h2>
                <div className={styles.carousel}>
                  <Slider {...settings}>
                    {spotlights?.map((spotlight) => (
                      <CardPodcastCarousel 
                        key={spotlight.id} 
                        id={spotlight.id} 
                        title={spotlight.title}
                        author={`${spotlight.author.firstName} ${spotlight.author.lastName}`}
                        url={spotlight.coverUrl} 
                        description={spotlight.description}
                        countEpisodes={spotlight.Episode.length}
                      />
                      ))}
                  </Slider>
                </div>
              </div>
              <h2 className={styles.pageTitle}>FEED</h2>
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
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <Player/>
      </div>
    </div>
  )
}

