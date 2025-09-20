import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Author } from '../../data/db';

export const AuthorFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getAuthorById, addAuthor, updateAuthor } = useData();
    const isEditing = Boolean(id);
    
    const [formData, setFormData] = useState<Omit<Author, 'id'>>({
        name: '',
        bio: '',
        imageUrl: '',
    });

    useEffect(() => {
        if (isEditing && id) {
            const author = getAuthorById(id);
            if (author) {
                setFormData(author);
            }
        }
    }, [id, isEditing, getAuthorById]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && id) {
            updateAuthor({ ...formData, id });
        } else {
            addAuthor(formData);
        }
        navigate('/admin/authors');
    };

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                <h1 className="text-3xl font-bold text-gray-800">{isEditing ? 'Редактировать автора' : 'Добавить автора'}</h1>
                <div className="flex space-x-2">
                    <Link to="/admin/authors" className="btn btn-secondary flex-1 sm:flex-none">
                        Все авторы
                    </Link>
                </div>
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Имя</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-gray focus:border-brown-gray" required />
                    </div>
                     <div>
                        <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Биография</label>
                        <textarea name="bio" id="bio" value={formData.bio} onChange={handleChange} rows={6} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-gray focus:border-brown-gray" required />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL изображения</label>
                        <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-gray focus:border-brown-gray" required />
                    </div>
                   
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={() => navigate('/admin/authors')} className="btn btn-secondary">
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {isEditing ? 'Сохранить изменения' : 'Создать автора'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};
