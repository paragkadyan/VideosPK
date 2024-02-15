import {asyncHandler} from "../utils/asyncHandler.js";
import {ApiError} from "../utils/ApiError.js";
import {User} from "../models/user.model.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"
import {ApiResponse} from "../utils/ApiResponse.js"

const registerUser = asyncHandler( async (req,res) => {
    const{fullname, email, username, password} = req.body;
    console.log("email :", email);

    if(
        [fullname,email,username,password].some((field)=> 
        field?.trim() === "")
    ) {
        throw new ApiError(400, "All fields are required")
    }

    const existedUser = await User.findOne({
        $or: [{username},{email}]
    })

    if (existedUser) {
        throw new ApiError(409, "User with email or username already exist")
    }

    
    const avatarLocalPath = req.files?.avatar?.[0]?.path;
    
    const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
    
    

    if(!avatarLocalPath) {
        throw new ApiError(400, "Avatar is required!")
    }

    

    const avatar =  await uploadOnCloudinary(avatarLocalPath)
    
    const coverImage = await uploadOnCloudinary(coverImageLocalPath)


    if(!avatar){
        throw new ApiError(400, "Avatar is required!!")

    }

    

    const user = await User.create({
        username: username.toLowerCase(),
        email,
        fullname,
        avatar:avatar.url,
        coverImage: coverImage?.url ||  "",
        password,
    })


    const createdUser = await User.findById(user._id).select(
        "-password -refreshToken"
    ) 

    if(!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201,).json(
        new ApiResponse(200, createdUser, "User registered successfully")
    )

})

const loginUser = asyncHandler( async(req, res) => {

    const { username, email, password } = req.body

   if(!username || !email) {
    throw new ApiError(400, "Username or email is required")
   }

   if(!password) {
    throw new ApiError(400, "password is required")
   }

   const user = await User.findOne({
    $or: [{username}, {password}]
   })

   if(!user){
    throw new ApiError(400, "User does not exist")
   }


   const isPasswordValid = await user.isPasswordCorrect(password)

   if(!isPasswordValid){
    throw new ApiError(401, "Invalid user credentials")
   }



})

 
export {
        registerUser,
        loginUser
       }


//http://localhost:8000/api/v1/users/register