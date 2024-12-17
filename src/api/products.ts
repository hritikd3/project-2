const API_KEY = '72njgfa948d9aS7gs5';
const BASE_URL = 'https://stageapi.monkcommerce.app/task/products';

export const searchProducts = async (search: string = '', page: number = 0) => {
  try {
    const response = await fetch(
      `${BASE_URL}/search?search=${search}&page=${page}&limit=10`,
      {
        headers: {
          'x-api-key': API_KEY,
        },
      }
    );
    return await response.json();
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};