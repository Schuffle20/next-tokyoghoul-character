'use client';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import Loading from './loading';
import Link from 'next/link';

type CharacterItem = {
  character: {
    mal_id: number;
    name: string;
    images: {
      webp: {
        image_url: string;
      };
    };
  };
  role?: string;
};

const Home = () => {
  const [characters, setCharacters] = useState<CharacterItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const url = 'https://api.jikan.moe/v4/anime/1195/characters';
  useEffect(() => {
    fetch(url)
      .then((res) => res.json())
      .then((data) => {
        setCharacters(data.data.slice(0, 12));
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching characters:', err);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Loading />
  }
  return (
    <main className='p-8 min-h-screen bg-white dark:bg-slate-950 transition-colors duration-300'>
      <h1 className='text-4xl font-bold mb-8 text-slate-900 dark:text-white'>
        Tokyo Ghoul Directory
      </h1>
     
      <div className='grid grid-cols-1 md:grid-cols-4 gap-6'>
        {characters.map((char) => (
          <Link href={`/character/${char.character.mal_id}`} key={char.character.mal_id}>
            <div
            key={char.character.mal_id}
            className='border p-4 rounded-lg shadow-md bg-slate-50 dark:bg-slate-900'
          >
            <Image
              src={char.character.images.webp.image_url}
              alt={char.character.name}
              width={300}
              height={300}
              className='w-full h-64 object-cover rounded-md mb-4'
            />
            <h2 className='font-bold text-lg dark:text-white'>
              {char.character.name}
            </h2>
            <p className='text-sm text-slate-500'>
              {char.role ? char.role : 'Unknown'}
            </p>
          </div>
          </Link>
        ))}
      </div>
    </main>
  )
}

export default Home