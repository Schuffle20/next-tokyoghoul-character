"use client"
import Image from 'next/image';
import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import Link from 'next/link';

type Character = {
  images: {
    webp: {
      image_url: string;
    };
  };
  name: string;
  name_kanji?: string;
  about?: string;
};

export default function CharacterDetail() {
  const params = useParams();
  const [character, setCharacter] = useState<Character | null>(null);

  useEffect(() => {
    // Fetch individual character data using the ID from the URL
    fetch(`https://api.jikan.moe/v4/characters/${(params as { id: string }).id}/full`)
      .then(res => res.json())
      .then(data => setCharacter(data.data))
  }, [params])

  if (!character) return <div className="p-10 text-center">Loading Character Details...</div>

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <Link href="/">
        <button className="mb-6 border px-4 py-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800">
          ← Back to Directory
        </button>
      </Link>

      <div className="flex flex-col md:flex-row gap-10 items-start">
        <Image
          src={character.images.webp.image_url}
          width={320}
          height={480}
          className="w-full md:w-80 rounded-xl shadow-2xl shrink-0"
          alt={character.name}
        />
        
        <div className="space-y-4 flex-1">
          <h1 className="text-4xl font-bold text-slate-900 dark:text-white">{character.name}</h1>
          <p className="text-xl text-red-600 font-semibold">{character.name_kanji}</p>
          <div className="prose dark:prose-invert max-w-none max-h-64 overflow-y-auto pr-2">
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed whitespace-pre-line">
              {character.about || "No biography available for this character."}
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}