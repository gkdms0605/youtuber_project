const express = require("express")
const router = express.Router()
const conn = require('../mariadb')
const {body, param, validationResult} = require('express-validator')
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv')

dotenv.config({path: __dirname + '/../.env'})

router.use(express.json())

function validate(req, res, next){
    const err = validationResult(req)

    if(err.isEmpty()){
        return next()
    } else {
        res.status(400).json(err.array())
    }
}

router.post('/login',
    [
        body('email').notEmpty().isEmail().withMessage("이메일 확인 필요"),
        body('password').notEmpty().isString().withMessage("로그인 확인 필요"),
        validate
    ],
    (req, res) => {
    const {email, password} = req.body

    let sql = `SELECT * FROM users WHERE email = ?`
    
    conn.query(sql, email,
        ((err, results) => {
            if(err) {
            console.log(err)
                return res.status(400).end()
            }

            let loginUser = results[0];
            
            if(loginUser && loginUser.password == password) {
                const token = jwt.sign({
                    email: loginUser.email,
                    name: loginUser.name
                }, process.env.PRIVATE_KEY, {
                    expiresIn: '1m',    // 유효 기간 설정 s, m, h
                    issuer : "songa"    // 토큰 발행자
                }) // data, private key, option

                res.cookie("token", token, {
                    httpOnly: true
                }) // token이라는 상자에 token 담기, {}옵션으로

                res.status(200).json({
                    message: `${loginUser.name}님, 로그인 되었습니다.`
                })
            }
            else {
                res.status(403).json({
                    message: "아이디 또는 비밀번호를 잘못 입력하셨습니다."
                })
            }
        })
    )
})

router.post('/join', 
    [
        body('email').notEmpty().isEmail().withMessage("이메일 확인 필요"),
        body('name').notEmpty().isString().withMessage("이름 확인 필요"),
        body('password').notEmpty().isString().withMessage("비밀번호 확인 필요"),
        body('contact').notEmpty().isString().withMessage("연락처 확인 필요"),
        validate
    ],
    (req, res) => {
        if(req.body != {}) {
            let {email, name, password, contact} = req.body
            let sql = `INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)`
            
            conn.query(sql, [email, name, password, contact],
                ((err, results) => {
                    if(err) {
                        console.log(err)
                        return res.status(400).end()
                    }
                    res.status(201).json(results)
                })
            )
        }
        else {
            res.status(400).json({
                message: "입력 값을 확인해주세요."
            })
        }
    
}) 

router
    .route('/users')
    .get(
        [
            body('email').notEmpty().isEmail().withMessage("이메일 확인 필요"),
            validate
        ],
        (req, res) => {
            let {email} = req.body
            let sql = `SELECT * FROM users WHERE email = ?` 

            conn.query(sql, email,
                ((err, results) => {
                    if(err) {
                        console.log(err)
                        return res.status(400).end()
                    }
                    if(results.affectedRows == 0){
                        return res.status(400).send('회원 정보를 찾을 수 없습니다.')
                    }
                    res.status(200).json(results)
                })
            )
    })

    .delete(
        [
            body('email').notEmpty().isEmail().withMessage("이메일 확인 필요"),
            validate
        ],
        (req, res) => {
            let {email} = req.body
            let sql = `DELETE FROM users WHERE email = ?`
            conn.query(
                sql, email,
                ((err, results) => {   
                    if(err) {
                        console.log(err)
                        return res.status(400).end()
                    }
                    if(results.affectedRows == 0){
                        return res.status(400).send('회원 정보를 찾을 수 없습니다.')
                    }
                    res.status(200).json(results)
                })
            )
    })

module.exports = router