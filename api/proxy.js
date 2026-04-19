// api/proxy.js
// api/proxy.js
export default async function handler(req, res) {
    const { name, cid } = req.query;
    res.setHeader('Access-Control-Allow-Origin', '*');

    try {
        let url;
        if (name) {
            // Route 1: Search for a CID by name
            url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/name/${encodeURIComponent(name)}/cids/JSON`;
        } else if (cid) {
            // Route 2: Get the 3D SDF structure data by CID
            url = `https://pubchem.ncbi.nlm.nih.gov/rest/pug/compound/cid/${cid}/SDF?record_type=3d`;
        } else {
            return res.status(400).json({ error: 'Provide name or cid' });
        }

        const response = await fetch(url);
        
        if (cid) {
            // If fetching 3D data, return as text
            const text = await response.text();
            return res.status(200).send(text);
        }

        const data = await response.json();
        res.status(200).json(data);
    } catch (error) {
        res.status(500).json({ error: 'PubChem fetch failed' });
    }
}