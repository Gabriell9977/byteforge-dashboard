import { useState, useMemo } from 'react';
import { recentTransactions } from '../services/transactionService';

export function useTransactions() {
  const [search, setSearch] = useState('');

  const filteredTransactions = useMemo(() => {
    return recentTransactions.filter(
      (tx) =>
        tx.customer.toLowerCase().includes(search.toLowerCase()) ||
        tx.id.toLowerCase().includes(search.toLowerCase())
    );
  }, [search]);

  return { search, setSearch, filteredTransactions };
}