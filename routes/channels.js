const express = require("express")
const router = express.Router()
const conn = require('../mariadb')
router.use(express.json())

function notFoundId(res) {
    res.status(404).send("해당하는 ID의 채널 정보가 없습니다.")
}

function stringToInt(req) {
    let {id} = req
    return parseInt(id)
}

router
    .route("/")
    .get((req, res) => {
        let {user_id} = req.body

        let sql = `SELECT * FROM channels WHERE id = ? `
        if (user_id) {
            conn.query(sql, user_id,
                (err, results) => {
                    if(results.length){
                        res.status(200).json(results)
                    } else {
                        notFoundId(res)
                    }
                }
            )
        } 

        else {
            res.status(400).end()
        }
    })
    
    .post((req, res) => {
        const {name, userId} = req.body
        
        if(name && userId){
            let sql = `INSERT INTO channels (name, user_id) VALUES (?, ?)`
            conn.query(sql, [name, userId],
                (err, results) => {
                    res.status(201).json(results)
                }
            )
        } else {
            res.status(400).send("요청값을 확인해 주세요!")
        }
    })
    

router
    .route("/:id")
    .get((req, res) => {
        let id = stringToInt(req.params)

        let sql = `SELECT * FROM channels WHERE id = ? `
        conn.query(sql, id,
            (err, results) => {
                if(results.length){
                    res.status(200).json(results)
                } else {
                    notFoundId(res)
                }
            }
        )
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