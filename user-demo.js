// express 모듈 세팅
const express = require("express")
const app = express()
app.listen(1234)
app.use(express.json())

// db
let db = new Map()
let id = 2

// 임시 데이터
let user = {
    userId: "haeun",
    password: "master",
    name: "하은"
}

db.set(1, user)

// 회원 로그인 (post)
app.post('/login', (req, res) => {
    res.json({
        message: `${name}님 환영합니다.`
    })
})

// 회원 가입 (post)
app.post('/join', (req, res) => {
    let insertData = req.body
    if(insertData)

    if(insertData) {
        db.set(id, req.body)
        res.status(201).json({
            message: `${db.get(id++).name}님 환영합니다.`
        })
    }
    else {
        res.status(400).json({
            message: "입력 값을 확인해주세요."
        })
    }
    
}) 

// 회원 개별 조회 (get)
app.get('/users/:id', (req, res) => {
    let {id} = req.params
    id = parseInt(id)
    
    res.json({
        id: res.id,
        name: res.name
    })
})

// 회원 탈퇴 (delete)
app.delete('/users/:id', (req, res) => {
    let {id} = req.params
    id = parseInt(id)
    
    res.json({
        message: `${name}님 다음에 또 뵙겠습니다.`
    })
})