const midtransClient = require('midtrans-client');

// Khusus Vercel Serverless Function
export default async function handler(req, res) {
    // Hanya ijinkan method POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { orderId, grossAmount, customerName, customerPhone, items } = req.body;

        // 1. Inisialisasi Snap API
        const p1 = 'Mid-server-';
        const p2 = 'sSywINBDrNE8vfFiOqV7yvQB';

        const snap = new midtransClient.Snap({
            isProduction: false, // ubah ke true jika sudah live
            serverKey: process.env.MIDTRANS_SERVER_KEY || (p1 + p2)
        });

        // 2. Format Items (Opsional, tapi bagus untuk invoice)
        const itemDetails = items.map(item => ({
            id: item.id,
            price: item.price,
            quantity: item.qty,
            name: item.name.substring(0, 50) // Midtrans limit max 50 char
        }));

        // 3. Setup Parameter Transaksi
        const parameter = {
            transaction_details: {
                order_id: orderId,
                gross_amount: grossAmount
            },
            customer_details: {
                first_name: customerName,
                phone: customerPhone
            },
            item_details: itemDetails
        };

        // 4. Request Token ke Midtrans
        const transaction = await snap.createTransaction(parameter);

        // 5. Kembalikan ke Frontend
        res.status(200).json({ token: transaction.token });

    } catch (error) {
        console.error('Error generating snap token:', error);
        res.status(500).json({ error: 'Failed to generate payment token.', details: error.message });
    }
}
