const express = require("express")
const router = express.Router()
const conn = require('../mariadb')

router.use(express.json())

router.post('/login', (req, res) => {
    const {email, password} = req.body
    let sql = `SELECT * FROM users WHERE email = ?`
    
    conn.query(sql, email,
        ((err, results) => {
            let loginUser = results[0];
            if(loginUser && loginUser.password == password) {
                res.status(200).json({
                    message: `${loginUser.name}님, 로그인 되었습니다.`
                })
            }
            else {
                res.status(404).json({
                    message: "아이디 또는 비밀번호를 잘못 입력하셨습니다."
                })
            }
        })
    )
})

router.post('/join', (req, res) => {
    if(req.body != {}) {
        let {email, name, password, contact} = req.body
        let sql = `INSERT INTO users (email, name, password, contact) VALUES (?, ?, ?, ?)`
        
        conn.query(sql, [email, name, password, contact],
            ((err, results) => {
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
    .get((req, res) => {
        let {email} = req.body
        let sql = `SELECT * FROM users WHERE email = ?` 

        conn.query(sql, email,
            ((err, results) => {
                res.status(200).json(results)
            })
        )
    })

    .delete((req, res) => {
        let {email} = req.body
        let sql = `DELETE FROM users WHERE email = ?`
        conn.query(
            sql, email,
            ((err, results) => {   
                res.status(200).json(results)
            })
        )
    })

module.exports = router