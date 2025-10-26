import { useState, useEffect } from 'react';

export function useSafeCoins() {
    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchBalance = async () => {
        try {
            const response = await fetch('http://localhost:3000/estado');
            if (!response.ok) throw new Error('Error fetching balance');
            const data = await response.json();
            console.log('Datos recibidos del servidor:', data);
            setBalance(Number(data.safecoinTotal) || 0);
        } catch (error) {
            console.error('Error fetching SafeCoins balance:', error);
        } finally {
            setLoading(false);
        }
    };

    const spendCoins = async (amount: number) => {
        try {
            const response = await fetch('http://localhost:3000/spend-coins', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ amount }),
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.message || 'Error spending coins');
            }
            
            await fetchBalance(); // Actualizar el balance después de gastar
            return true;
        } catch (error) {
            console.error('Error spending SafeCoins:', error);
            return false;
        }
    };

    useEffect(() => {
        fetchBalance();
        const interval = setInterval(fetchBalance, 1000);
        return () => clearInterval(interval);
    }, []);

    return { balance, loading, spendCoins, refreshBalance: fetchBalance };
}