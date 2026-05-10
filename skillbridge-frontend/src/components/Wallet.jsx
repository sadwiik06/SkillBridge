import React,{useState, useEffect} from 'react';
import API from '../api/axios';

const Wallet = ()=>{
    const [transactions,setTransactions]=useState([]);
    const [balance,setBalance]=useState(({total:0,locked:0}));
    const [loading, setLoading] = useState(true);
    
    useEffect(() => {
        const fetchWalletData = async () => {
            try {
                const txRes = await API.get('/transactions/my-transactions');
                setTransactions(txRes.data);
                
                const userRes = await API.get('/auth/me');
                setBalance({
                    total: userRes.data.totalBalance || 0,
                    locked: userRes.data.lockedBalance || 0
                });
                setLoading(false);
            } catch(err) {
                console.error("Error fetching wallet data", err);
                setLoading(false);
            }
        };
        fetchWalletData();
    }, []);
    if(loading) return <div>Loading wallet data</div>
    return (
        <div>
            <h2>Digital Wallet</h2>
            <div>
                <div>
                    <span>Available Balance</span>
                    <h2>${(balance.total-balance.locked).toFixed(2)}</h2>

                    
                </div>
                <div>
                    <span>Locked in Escrow</span>
                    <h2>${balance.locked.toFixed(2)}</h2>
                </div>
            </div>
            <div>
                <h4>Transaction History</h4>
                {transactions.length===0?(<p>No transactions recorded yet   </p>):(
                    <table>
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Description</th>
                                <th>Type</th>
                                <th>Amount</th>
                            </tr>
                        </thead>
                        <tbody>
                            {transactions.map((tx)=>(
                                <tr key={tx.id}>
                                    <td>
                                    {new Date(tx.timestamp).toLocaleDateString()}
                                    </td>
                                    <td>{tx.description}</td>
                                    <td>
                                        <span>{tx.type.replace('_',' ')}</span>

                                    </td>
                                    <td>
                                        {tx.amount>0? `+`:``}${tx.amount.toFixed(2)}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}
            </div>
        </div>
    )

};
export default Wallet;