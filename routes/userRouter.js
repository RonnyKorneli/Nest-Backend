import express from "express";
import User from "../models/User.js"
import jwt from 'jsonwebtoken'
import { body, validationResult } from 'express-validator'
import userValidators from '../validators/userValidators.js'
import createError from 'http-errors'




const userRouter = express.Router();
const secret = "ztzt"


//////////// LOGIN ///////////////////////////////
userRouter
    .post("/login", async (req,res)=>{
        const user = await User.login(req.body)
        console.log(user)

        if (user) {
            /////// TOKEN ..........................
            const payload = { 
                userId: user._id 
            }
            const options ={
                    expiresIn: "30m"
            }
            const token = jwt.sign(payload,secret,options)
            console.log(token)
            return res.send({ ...user.toJSON(), token}).status({ Login: 'sucess!!' })
    }
    res.status(404).send({ error: "wrong creds" })
})
///////////////////////////////////////////////////////////////////

    .post("/register",
        userValidators, 
        async (req,res,next) => {
            const errors = validationResult(req.body.loginInfo)
            if (!errors.isEmpty()) {
                return res.status(400).send({
                    errors: errors.array().map(e => e.msg)
                })
            }
            try{ 
                // const password = req.headers.password
                //req.body.password = password
                const user = await User.register(req.body)

                return res.send(user)
            
            } catch (err) {
                next(createError(400, err.message)) 
            }
        }
    )

    .get("/:id", async (req,res)=>{ 
        try {
            const user = await User.findById(req.params.id)

            if (!user) {
                return next(createError(404, "User not found"))
            }
            res.send(user)
        } catch (error) {
            next(error)
        }
    })

    .patch("/:id", async (req,res,next)=>{
        try {
            const queryOptions = { new: true, runValidators: true }
            const id = req.params.id

            const query = User.findByIdAndUpdate(id, req.body, queryOptions)
            //query.populate("houses")
            query.populate("reviews")
            //query.populate("conversations")
            
            const question = await query.exec()

            if (!question) {
                return next(createError(404, "Question not found"))
            }

            res.send(question)
        } catch (error) {
            next(createError(400, error.message))
        }
    })

    .delete("/deleteProfile",(req,res)=>{    
    })

export default userRouter;