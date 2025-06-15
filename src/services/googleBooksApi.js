import axios from 'axios';

const API_URL = 'https://www.googleapis.com/books/v1/volumes';

export async function searchBooks(query) {

  if (!query) {
    return [];
  }

  try {
    const response = await axios.get(API_URL, {
      params: {
        q: query,
        maxResults: 10,
      },
    });

    if (!response.data.items) {
      return [];
    }

    const books = response.data.items.map((item) => ({
      title: item.volumeInfo.title,
      authors: item.volumeInfo.authors || ['Autor Desconhecido'],
      publishedDate: item.volumeInfo.publishedDate || '',
    }));

    return books;

  } catch (error) {
    console.error('Erro ao buscar livros na API do Google:', error);
    return [];
  }
}