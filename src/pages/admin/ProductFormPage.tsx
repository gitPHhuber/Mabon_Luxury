import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Product } from '../../data/db';

export const ProductFormPage = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { getProductById, addProduct, updateProduct, authors, collections } = useData();
    const isEditing = Boolean(id);
    
    const [formData, setFormData] = useState<Omit<Product, 'id'>>({
        name: '',
        description: '',
        price: 0,
        imageUrl: '',
        gallery: [],
        authorId: '',
        collection: '',
        isFeatured: false,
    });

    useEffect(() => {
        if (isEditing && id) {
            const product = getProductById(id);
            if (product) {
                setFormData({ ...product, isFeatured: product.isFeatured || false });
            }
        }
    }, [id, isEditing, getProductById]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, type, value } = e.target;
        
        if (type === 'checkbox') {
            setFormData(prev => ({
                ...prev,
                [name]: (e.target as HTMLInputElement).checked,
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [name]: name === 'price' ? parseFloat(value) || 0 : value
            }));
        }
    };
    
    const handleGalleryChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData(prev => ({
            ...prev,
            gallery: e.target.value.split(',').map(url => url.trim()).filter(url => url)
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (isEditing && id) {
            updateProduct({ ...formData, id });
        } else {
            addProduct(formData);
        }
        navigate('/admin/products');
    };

    const uniqueCollections = Array.from(new Set(collections.map(c => c.name)));

    return (
        <div>
            <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-8 gap-4">
                 <h1 className="text-3xl font-bold text-gray-800">{isEditing ? 'Редактировать продукт' : 'Добавить продукт'}</h1>
                 <div className="flex space-x-2">
                    <Link to="/admin/products" className="btn btn-secondary">
                        Посмотреть все
                    </Link>
                    <Link to="/admin/products/new" className="btn btn-primary">
                        Добавить новый
                    </Link>
                </div>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-md max-w-2xl mx-auto">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Название</label>
                        <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-gray focus:border-brown-gray" required />
                    </div>
                     <div>
                        <label htmlFor="description" className="block text-sm font-medium text-gray-700">Описание</label>
                        <textarea name="description" id="description" value={formData.description} onChange={handleChange} rows={4} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-gray focus:border-brown-gray" required />
                    </div>
                     <div>
                        <label htmlFor="price" className="block text-sm font-medium text-gray-700">Цена (₽)</label>
                        <input type="number" name="price" id="price" value={formData.price} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-gray focus:border-brown-gray" required />
                    </div>
                    <div>
                        <label htmlFor="imageUrl" className="block text-sm font-medium text-gray-700">URL основного изображения</label>
                        <input type="text" name="imageUrl" id="imageUrl" value={formData.imageUrl} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-gray focus:border-brown-gray" required />
                    </div>
                    <div>
                        <label htmlFor="gallery" className="block text-sm font-medium text-gray-700">URL изображений галереи (через запятую)</label>
                        <input type="text" name="gallery" id="gallery" value={formData.gallery.join(', ')} onChange={handleGalleryChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-gray focus:border-brown-gray" />
                    </div>
                    <div>
                        <label htmlFor="authorId" className="block text-sm font-medium text-gray-700">Автор</label>
                        <select name="authorId" id="authorId" value={formData.authorId} onChange={handleChange} className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-gray focus:border-brown-gray" required>
                            <option value="">Выберите автора</option>
                            {authors.map(author => (
                                <option key={author.id} value={author.id}>{author.name}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label htmlFor="collection" className="block text-sm font-medium text-gray-700">Коллекция</label>
                        <input type="text" name="collection" id="collection" value={formData.collection} onChange={handleChange} list="collections-list" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-brown-gray focus:border-brown-gray" required />
                        <datalist id="collections-list">
                            {uniqueCollections.map(coll => (
                                <option key={coll} value={coll} />
                            ))}
                        </datalist>
                    </div>
                    <div>
                        <label htmlFor="isFeatured" className="flex items-center text-sm font-medium text-gray-700">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                id="isFeatured"
                                checked={formData.isFeatured || false}
                                onChange={handleChange}
                                className="h-4 w-4 text-brown-gray border-gray-300 rounded focus:ring-brown-gray"
                            />
                            <span className="ml-2">Отметить как избранный продукт</span>
                        </label>
                        <p className="text-xs text-gray-500 mt-1">Избранные продукты будут отображаться в специальном разделе на главной странице.</p>
                    </div>
                    <div className="flex justify-end space-x-4">
                        <button type="button" onClick={() => navigate('/admin/products')} className="btn btn-secondary">
                            Отмена
                        </button>
                        <button type="submit" className="btn btn-primary">
                            {isEditing ? 'Сохранить изменения' : 'Создать продукт'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};