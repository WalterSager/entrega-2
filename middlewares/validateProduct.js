const validateProduct = (req, res, next) => {
    const { title, description, code, price, stock, category } = req.body;

    if (!title || typeof title !== 'string') {
        return res.status(400).json({ error: 'El título es obligatorio y debe ser un texto' });
    }
    if (!description || typeof description !== 'string') {
        return res.status(400).json({ error: 'La descripción es obligatoria y debe ser un texto' });
    }
    if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: 'El código es obligatorio y debe ser un texto' });
    }
    if (!price || typeof price !== 'number') {
        return res.status(400).json({ error: 'El precio es obligatorio y debe ser un número' });
    }
    if (!stock || typeof stock !== 'number') {
        return res.status(400).json({ error: 'El stock es obligatorio y debe ser un número' });
    }
    if (!category || typeof category !== 'string') {
        return res.status(400).json({ error: 'La categoría es obligatoria y debe ser un texto' });
    }

    next();
};

module.exports = validateProduct;
