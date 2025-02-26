// express 모듈 세팅
const express = require("express")
const app = express()
app.listen(1234)
app.use(express.json())

// db
let db = new Map()
let id = 2

// 임시 데이터
let user1 = {
    userId: "haeun",
    password: "master",
    name: "하은"
}
db.set(1, user1)

// functions
function isExist(obj) {
    return Object.keys(obj).length
}

function findUser(userId) {
    let foundUser = {}
    
    db.forEach((user) => {
        if(user.userId === userId) foundUser = user
    })

    return foundUser

    // 또는 Object.values(db).find를 통해 쉽게 찾을 수 있음 (Object.find : 객체의 모든 속성 값을 배열로 반환)
}

// 회원 로그인 (post)
app.post('/login', (req, res) => {
    // userId와 pwd가 일치하는지 비교
    const {userId, password} = req.body
    let loginUser = findUser(userId)

    if(isExist(loginUser) && loginUser.password === password){
        res.status(201).json({
            message: `${loginUser.name}님 환영합니다.`
        })
    }   
    else {
        res.status(400).json({
            message: `아이디 또는 비밀번호가 틀렸습니다.`
        }) 
    }

    
})

// 회원 가입 (post)
app.post('/join', (req, res) => {
    let insertData = req.body
    if(insertData != {}) {
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

app
    .route('/users/:id')

    // 회원 개별 조회 (get)
    .get((req, res) => {
        let {id} = req.params
        id = parseInt(id)
        let userData = db.get(id)
        
        if(userData) {
            res.status(200).json({
                userId: userData.userId,
                name: userData.name
            })
        } else {
            res.status(404).json({
                message: "회원 정보가 없습니다."
            })
        }
    })

    // 회원 탈퇴 (delete)
    .delete((req, res) => {
        let {id} = req.params
        id = parseInt(id)
        let userData = db.get(id)
        
        if(userData) {
            let userName = userData.name
            db.delete(id)        
            res.status(200).json({
                message: `${userName}님, 다음에 또 뵙겠습니다.`
            })
        } else {
            res.status(404).json({
                message: "회원 정보가 없습니다."
            })
        }
    })