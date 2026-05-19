const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { checkout } = require('../app');


//generate AccessToken
const generateAccessToken = (userId)=>{ 
    return jwt.sign({id: userId}, 
        process.env.JWT_ACCESS_SECRET,
        {expiresIn: '15m'});
};
//generate RefreshToken
const generateRefreshToken = (userId)=>{ 
return jwt.sign ({id: userId},
    process.env.JWT_REFRESH_SECRET,
    {expiresIn: "7d"});
};
// token-cookies
const setTokenCookies = (res, accessToken, refreshToken) => {
    res.cookie('accessToken', accessToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 15 * 60 *1000 // 15 minutes
    });
    res.cookie('refreshToken', refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7d

    });

};


//endpoints controllers

const register = async (req, res)=>{
    try{
        const {name, email, password, role, vehicleType}= req.body;
        // checkout user existnas
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(409).json({msg: "email already in use"});
        }
        const user = await User.create({name, email, password, role, vehicleType});

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        //save refreshtoken in the db so we can checked it out any time we want
        user.refreshToken = refreshToken;
        await user.save();
        
        setTokenCookies(res, accessToken, refreshToken);

        res.status(201).json({
            msg: "user registered successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                vehicleType: user.vehicleType,
            },
        });

    }catch(err){
            res.status(500).json({ message: err.message });
    }
};

//login endpoint 
const login = async (req, res)=>{
    try{
        const {email, password} =req.body;
        const user = await User.findOne({email});
        if (!user) return res.status(401).json({msg: 'invalid credntials'});

        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(401).json({msg: 'invalid credentials'});

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        //save refreshtoken in the db so we can checked it out any time we want
        user.refreshToken = refreshToken;
        await user.save();
        
        setTokenCookies(res, accessToken, refreshToken);

        res.status(200).json({
            msg: "Logged in successfully",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                vehicleType: user.vehicleType,
            },
        });

    }catch (err) {
    res.status(500).json({ message: err.message });
  }
}

// refresh
const refresh = async (req, res)=> {
    try{
        const token = req.cookies.refreshToken;
        if (!token) return res.status(401).json({msg: "no refresh token"})

            const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);

            const user = await User.findById(decoded.id);
            if (!user || user.refreshToken !== token) return res.status(401).json({msg: "invalid refresh token"});

            // new refresh token for the access token //  hard to be hacked
            const newAccessToken = generateAccessToken(user._id);
            const newRefreshToken = generateRefreshToken(user._id);
            // reassign the old refresh token with the newRefresh token
            user.refreshToken = newRefreshToken;
            await user.save();
            setTokenCookies(res, newAccessToken, newRefreshToken)

            res.status(200).json({msg: 'token refreshed'});

    } catch (err) {
    res.status(401).json({ message: 'invalid or expired refresh token' });
  }
}
//logout endpoint
const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
        //delete token from the db
        await User.findOneAndUpdate(
        { refreshToken: token },
        { refreshToken: null }
      );
    }
    res.clearCookie('accessToken');
    res.clearCookie('refreshToken');
    res.status(200).json({ message: 'logged out successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login, refresh, logout };



