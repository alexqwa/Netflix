import React, { useEffect, useState } from "react";
import './App.css';
import Tmdb from './Tmdb';

import Header from "./components/Header/Header";
import MovieRow from './components/MovieRow/MovieRow';
import FeaturedMovie from "./components/FeaturedMovie/FeaturedMovie";

export default () => {

    const [movieList, setMoveList] = useState([]);
    const [featuredData, setFeaturedData] = useState(null);
    const [blackHeader, setBlackHeader] = useState(false);

    useEffect(() => {
        const loadAll = async () => {
            // Pegando a lista TOTAL
            let list = await Tmdb.getHomeList();
            setMoveList(list);

            // Pegando o Featured
            let originals = list.filter(i=>i.slug === 'originals');
            let randomChosen = Math.floor(Math.random() * (originals[0].items.results.length - 1));
            let chosen = originals[0].items.results[randomChosen];
            let chosenInfo = await Tmdb.getMovieInfo(chosen.id, 'tv');
            setFeaturedData(chosenInfo);
        }

        loadAll();
    }, []);

    useEffect(() => {
        const scrollListener = () => {
            if (window.scrollY > 10) {
                setBlackHeader(true);
            } else {
                setBlackHeader(false);
            }
            
        }

        window.addEventListener('scroll', scrollListener);

        return () => {
            window.removeEventListener('scroll', scrollListener);
        }
    }, []);

    return (
        <div clasName="page">
            <Header black={blackHeader} />

            {featuredData &&
                <FeaturedMovie item={featuredData} />
            }

            <section className="lists">
                {movieList.map((item, key) => (
                    <MovieRow key={key} title={item.title} items={item.items} />
                ))}
            </section>

            {movieList.length <= 0 && 
                <div className="loading">
                    <img src="https://www.rchandru.com/images/portfolio/loading.gif" alt="Carregando" />
                </div>
            }
        </div>
    );
}