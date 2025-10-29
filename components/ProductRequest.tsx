import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import { XMarkIcon } from './Icons';

const ProductRequest: React.FC = () => {
  const { showToast } = useAppContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [comment, setComment] = useState('');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    const fileInput = document.getElementById('product-request-file') as HTMLInputElement;
    if(fileInput) fileInput.value = '';
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      showToast('Proszę dodać zdjęcie produktu.');
      return;
    }
    // Simulate submission
    console.log('Submitting request:', { fileName: selectedFile.name, comment });
    showToast('Twoje zapytanie zostało wysłane! Dziękujemy.');
    
    // Reset form
    clearImage();
    setComment('');
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 my-8">
      <h3 className="text-xl font-bold text-dark text-center">Nie możesz znaleźć produktu?</h3>
      <p className="text-sm text-gray-500 text-center mt-1">Pokaż nam, czego szukasz, a my postaramy się to dla Ciebie znaleźć!</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4 max-w-lg mx-auto">
        <div>
          <label htmlFor="product-request-file" className="block text-sm font-semibold text-dark mb-2">Dodaj zdjęcie</label>
          {previewUrl ? (
            <div className="relative group">
              <img src={previewUrl} alt="Podgląd" className="w-full h-48 object-contain rounded-lg bg-accent/30 p-2" />
              <button
                type="button"
                onClick={clearImage}
                className="absolute top-2 right-2 p-1.5 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                aria-label="Usuń zdjęcie"
              >
                <XMarkIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="flex items-center justify-center w-full">
              <label htmlFor="product-request-file" className="flex flex-col items-center justify-center w-full h-32 border-2 border-accent border-dashed rounded-lg cursor-pointer bg-accent/30 hover:bg-accent/50 transition-colors">
                <div className="flex flex-col items-center justify-center pt-5 pb-6">
                  <svg className="w-8 h-8 mb-2 text-primary/70" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 20 16">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2" />
                  </svg>
                  <p className="text-sm text-primary/80"><span className="font-semibold">Kliknij, aby przesłać</span></p>
                  <p className="text-xs text-primary/60">PNG, JPG (MAX. 5MB)</p>
                </div>
                <input id="product-request-file" type="file" className="hidden" onChange={handleFileChange} accept="image/png, image/jpeg" />
              </label>
            </div>
          )}
        </div>

        <div>
          <label htmlFor="comment" className="block text-sm font-semibold text-dark mb-2">Dodatkowy komentarz (opcjonalnie)</label>
          <textarea
            id="comment"
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Np. 'Szukam podobnej sukienki na wesele, rozmiar M'"
            rows={3}
            className="w-full p-2 bg-white text-dark placeholder-gray-400 rounded-lg border-2 border-accent focus:outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-primary text-white py-3 rounded-xl font-bold hover:bg-opacity-90 transition-colors text-lg"
        >
          Wyślij zapytanie
        </button>
      </form>
    </div>
  );
};

export default ProductRequest;