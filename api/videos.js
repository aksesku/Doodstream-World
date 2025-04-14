const fetch = require('node-fetch');

module.exports = async (req, res) => {
    const apiKey = process.env.DOODSTREAM_API_KEY; // Ambil dari Environment Variable
    const { file_code } = req.query;

    if (file_code) {
        // Fetch detail video
        try {
            const response = await fetch(`https://doodstream.com/api/file/info?key=${apiKey}&file_code=${file_code}`);
            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Gagal mengambil detail video dari Doodstream API' });
        }
    } else {
        // Fetch daftar video
        try {
            const response = await fetch(`https://doodstream.com/api/user/videos?key=${apiKey}`);
            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ error: 'Gagal mengambil daftar video dari Doodstream API' });
        }
    }
};
