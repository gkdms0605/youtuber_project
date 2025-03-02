// express 모듈 세팅
const express = require("express")
const router = express.Router()
const conn = require('../mariadb')

conn.query(
    'SELECT * FROM `users`',
    function (err, results, fields) {   // 각각 에러, 결과, 필드를 반환)
        let {id, email, name, created_at} = results[0]
        console.log(id); 
        console.log(email); 
        console.log(name); 
        console.log(created_at); 
        // console.log(fields); 
    }
);

router.use(express.json())

// db
let db = new Map()

// 임시 데이터
let user1 = {
    userId: "haeun",
    password: "master",
    name: "하은"
}
db.set(user1.userId, user1)

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
router.post('/login', (req, res) => {
    // userId와 pwd가 일치하는지 비교
    const {userId, password} = req.body
    let loginUser = findUser(userId)

    if(isExist(loginUser) && loginUser.password === password){
        res.status(200).json({
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
router.post('/join', (req, res) => {
    let insertData = req.body
    if(insertData != {}) {
        const {userId} = req.body
        db.set(userId, req.body)
        res.status(201).json({
            message: `${db.get(userId).name}님 환영합니다.`
        })
    }
    else {
        res.status(400).json({
            message: "입력 값을 확인해주세요."
        })
    }
    
}) 

router
    .route('/users')

    // 회원 개별 조회 (get)
    .get((req, res) => {
        let {userId} = req.body
        let userData = db.get(userId)
        
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
        let {userId} = req.body
        let userData = db.get(userId)
        
        if(userData) {
            let userName = userData.name
            db.delete(userId)        
            res.status(200).json({
                message: `${userName}님, 다음에 또 뵙겠습니다.`
            })
        } else {
            res.status(404).json({
                message: "회원 정보가 없습니다."
            })
        }
    })

module.exports = router