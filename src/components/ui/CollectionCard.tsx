import React from 'react';
import { Link } from 'react-router-dom';
import { ImageWithLoader } from './ImageWithLoader';

export const CollectionCard = ({ collection }: { collection: { name: string; imageUrl: string } }) => (
    <Link to="/collections" state={{ filter: collection.name }} className="group relative block aspect-square overflow-hidden">
        <ImageWithLoader
            src={collection.imageUrl}
            alt={collection.name}
            className="w-full h-full"
            imageClassName="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-brown-gray bg-opacity-30 flex items-center justify-center transition-opacity duration-300 group-hover:bg-opacity-10">
            <h3 className="font-sans text-2xl text-white tracking-widest">{collection.name}</h3>
        </div>
    </Link>
);
