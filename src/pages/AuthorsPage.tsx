import React from 'react';
import { AuthorCard } from '../components/ui/AuthorCard';
import { useData } from '../context/DataContext';

export const AuthorsPage = () => {
    const { authors } = useData();

    return (
        <div className="container mx-auto px-6 py-12 fade-in">
            <h1 className="text-center font-sans text-5xl text-brown-gray mb-12">Наши мастера</h1>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-16 max-w-5xl mx-auto">
                {authors.map(author => <AuthorCard key={author.id} author={author} />)}
            </div>
        </div>
    );
};