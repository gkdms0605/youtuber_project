const express = require("express")
const app = express()
app.listen(1234)
app.use(express.json())

let db = new Map()
let id = 1

let channel1 = {
    channelTitle: "tester1"
}

db.set(id++, channel1)


app
    .route("/channels")
    .get((req, res) => {
        let channels = []
        
        if(db.size) {
            db.forEach((value) => {
                channels.push(value)
            })

            res.status(200).json(channels)
        } else {
            res.status(404).send("채널이 없습니다.")
        }
    })
    
    .post((req, res) => {
        let {channelTitle} = req.body

        if(channelTitle){
            db.set(id++, req.body)
            res.status(201).send(`${channelTitle}님, 채널을 응원합니다!`)
        } else {
            res.status(400).send("채널명을 입력해주세요!")
        }
    })
    

app
    .route("/channels/:id")
    .get((req, res) => {
        let {id} = req.params
        id = parseInt(id)

        let channel = db.get(id)
        if(channel) {
            res.status(200).json(channel)
        } else {
            res.status(404).send("해당하는 ID의 채널 정보가 없습니다.")
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
                res.status(404).send("해당하는 ID의 채널 정보가 없습니다.")
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
            res.status(404).send("해당하는 ID의 채널 정보가 없습니다.")
        }
    })

    