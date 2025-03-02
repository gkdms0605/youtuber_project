const express = require("express")
const router = express.Router()
router.use(express.json())

let db = new Map()
let id = 1

let channel1 = {
    channelTitle: "tester1",
    userId: "haeun"
}

db.set(id++, channel1)

function notFoundId() {
    res.status(404).send("해당하는 ID의 채널 정보가 없습니다.")
}


router
    .route("/")
    .get((req, res) => {
        let {userId} = req.body
        let channels = []
        
        if(userId){
            if(db.size) {
                db.forEach((value) => {
                    if(value.userId == userId){
                        channels.push(value)
                        findUser = true
                    }
                })

                if(channels.length){
                    res.status(200).json(channels)
                } else {
                    res.status(404).send("user을 찾을 수 없습니다.")
                }
            } else {
                notFoundId()
            }
        }
        else {
            res.status(404).send("로그인이 필요합니다.")
        }
    })
    
    .post((req, res) => {
        if(req.body.channelTitle){
            let channel = req.body
            db.set(id++, channel)
            res.status(201).send(`${req.body.channelTitle}님, 채널을 응원합니다!`)
        } else {
            res.status(400).send("채널명을 입력해주세요!")
        }
    })
    

router
    .route("/:id")
    .get((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        let channel = db.get(id)
        if(channel) {
            res.status(200).json(channel)
        } else {
            notFoundId()
        }
    })

    .put((req, res) => {
        let {id} = req.params
        id = parseInt(id)
        let channel = db.get(id)

        if(channel) {
            if(Object.keys(req.body).length){
                let oldTitle = channel.channelTitle 
                let newTitle = req.body.channelTitle
                db.set(id, req.body)

                res.status(200).send(`채널명이 성공적으로 변경되었습니다. ${oldTitle} -> ${newTitle}`)
            } else {
                res.status(400).send("채널명을 입력해주세요.")
            }
        } else {
            notFoundId()
        }
    })

    .delete((req, res) => {
        let {id} = req.params
        id = parseInt(id)
        let channel = db.get(id)

        if(channel) {
            db.delete(id)
            res.status(200).send(`${channel.channelTitle}이 삭제 되었습니다.`)
        } else {
            notFoundId()
        }
    })

module.exports = router