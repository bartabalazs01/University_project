import axios from 'axios';

const fetchCoinData = async () => {
    try {
        const { data } = await axios.get('api link');
        return data.slice(0, 100);
    } catch (error) {
        console.error('Error fetching data:', error.response ? error.response.data : error.message);
        throw error;
    }
};

export default fetchCoinData;

