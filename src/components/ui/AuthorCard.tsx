import React from 'react';
import { Link } from 'react-router-dom';
import { Author } from '../../data/db';
import { ImageWithLoader } from './ImageWithLoader';
import { TruncatedText } from './TruncatedText';


interface AuthorCardProps {
    author: Author;
}


export const AuthorCard: React.FC<AuthorCardProps> = ({ author }) => (
    <div className="text-center">
        <Link to={`/authors/${author.id}`} className="group block">
            <div className="aspect-square overflow-hidden rounded-full mx-auto w-32 h-32 md:w-48 md:h-48 transition-all duration-500 ease-in-out group-hover:shadow-xl">
                <ImageWithLoader
                    src={author.imageUrl}
                    alt={author.name}
                    className="w-full h-full"
                    imageClassName="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
                />
            </div>
            <h3 className="mt-4 font-sans text-xl text-brown-gray">{author.name}</h3>
        </Link>
        <div className="mt-2">
            <TruncatedText text={author.bio} maxLength={100} className="text-sm text-brown-gray font-serif" />
        </div>
    </div>
);