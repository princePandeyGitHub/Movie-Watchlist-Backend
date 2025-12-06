import { prisma } from "../config/db.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/generateToken.js";

// Registring User
const register = async (req, res) => {
    
    const { name, email, password } = req.body;

    // Check if user already exists
    const userExists = await prisma.user.findUnique({
        where: { email: email },
    });

    if (userExists) {
        return res
            .status(400)
            .json({ error: "User already exists with this email" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create User
    const user = await prisma.user.create({
        data: {
            name,
            email,
            password: hashedPassword,
        },
    });

    const token = generateToken(user.id,res);

    res.status(201).json({
        status: "success",
        data: {
            user: {
                id: user.id,
                name: name,
                email: email,
            },
        },
        token,
    });
};

// Login
const login = async (req,res) => {
    const { email, password } = req.body;

    //check if whether this email exists in table or not
    const user = await prisma.user.findUnique({
        where: {email: email}
    })
    if(!user){
        return res.status(400).json({error: "Invalid email or password"})
    }

    //check if password is correct
    const isPasswordValid = await bcrypt.compare(password,user.password);
    if(!isPasswordValid){
        return res.status(400).json({error: "Invalid email or password"})
    }

    const token = generateToken(user.id,res);

    //email and password both are correct ! should login successfully
    res.status(201).json({
        status: "login success",
        data: {
            id: user.id,
            email: user.email
        },
        token,
    })

}

// Logout
const logout = async (req,res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0),
    });

    res.status(200).json({
        status: "logout success",
        message: "logged out successfully",
    });
}

export { register,login,logout }