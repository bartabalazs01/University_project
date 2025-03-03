import './App.css';
import { useEffect, useState } from 'react';
import fetchCoinData from './priceing_api';

const Table = () => {
    const [data, setData] = useState([]);
    const [originalData, setOriginalData] = useState([]);
    const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'none' });

    useEffect(() => {
        const getData = async () => {
            try {
                const coinData = await fetchCoinData();
                setData(coinData);
                setOriginalData(coinData);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        getData();
    }, []);

    const sortData = (key) => {
        let direction = 'ascending';
        if (sortConfig.key === key) {
            if (sortConfig.direction === 'ascending') {
                direction = 'descending';
            } else if (sortConfig.direction === 'descending') {
                direction = 'none';
            }
        }

        if (direction === 'none') {
            setData(originalData);
        } else {
            const sortedData = [...data].sort((a, b) => {
                if (typeof a.quotes.USD[key] === 'number' && typeof b.quotes.USD[key] === 'number') {
                    return direction === 'ascending' ? a.quotes.USD[key] - b.quotes.USD[key] : b.quotes.USD[key] - a.quotes.USD[key];
                }
                return direction === 'ascending' ? a[key].localeCompare(b[key]) : b[key].localeCompare(a[key]);
            });
            setData(sortedData);
        }

        setSortConfig({ key, direction });
    };

    const formatValue = (value) => {
        return value >= 0 ? `+${value}` : `${value}`;
    };

    const renderTableRow = (coin) => (
        <tr key={coin.id}>
            <td>{coin.name}</td>
            <td>{coin.quotes.USD.price.toFixed(2)} USD</td>
            <td>{formatValue(coin.quotes.USD.percent_change_1h)}%</td>
            <td>{formatValue(coin.quotes.USD.percent_change_24h)}%</td>
            <td>{formatValue(coin.quotes.USD.percent_change_7d)}%</td>
            <td>{coin.quotes.USD.volume_24h.toLocaleString()} USD</td>
            <td>{coin.quotes.USD.market_cap.toLocaleString()} USD</td>
        </tr>
    );

    return (
        <table>
            <thead>
                <tr>
                    <th><button className='sort-button' onClick={() => sortData('name')}>Name</button></th>
                    <th><button className='sort-button' onClick={() => sortData('price')}>Priceing</button></th>
                    <th><button className='sort-button' onClick={() => sortData('percent_change_1h')}>1 h</button></th>
                    <th><button className='sort-button' onClick={() => sortData('percent_change_24h')}>24 h</button></th>
                    <th><button className='sort-button' onClick={() => sortData('percent_change_7d')}>7 d</button></th>
                    <th><button className='sort-button' onClick={() => sortData('volume_24h')}>24 h traffic</button></th>
                    <th><button className='sort-button' onClick={() => sortData('market_cap')}>Market capitalization</button></th>
                </tr>
            </thead>
            <tbody>
                {data.map(renderTableRow)}
            </tbody>
        </table>
    );
};

export default Table;

