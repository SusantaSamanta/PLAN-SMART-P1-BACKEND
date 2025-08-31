


export const postRegister = (req, res) => {
    res.send('login page')
}

export const postLogin = (req, res) => {
    console.log(req.body);
    
    const { email, password } = req.body;
    res.json({ name: 'susanta', email, password });
    // res.send('login page')
}