const express = require('express')
const router = express.Router()
const conn = require('../mariadb')
const {body, param, validationResult} = require('express-validator')

router.use(express.json())

// functions
function notFoundId(res) {
    res.status(404).send("해당하는 ID의 채널 정보가 없습니다.")
}

function stringToInt(req) {
    let {id} = req
    return parseInt(id)
}

const validate = (req, res) => {
    const err = validationResult(req)

    if(!err.isEmpty){
        return res.status(400).json(err.array())
    }
}

router
    .route("/")
    .get(
        [
            body('user_id').notEmpty().isInt().withMessage('숫자를 입력해주세요.'),
            validate
        ],
        (req, res) => {
            validate(req, res)

            let {user_id} = req.body

            let sql = `SELECT * FROM channels WHERE user_id = ? `
            conn.query(sql, user_id,
                (err, results) => {
                    if(results.length){
                        res.status(200).json(results)
                    } else {
                        notFoundId(res)
                    }
                }
            )
    })
    
    .post(
        [body('userId').notEmpty().isInt().withMessage('숫자를 입력해주세요.'),
        body('name').notEmpty().isString().withMessage('문자를 입력해주세요.')],
            (req, res) => {
                const err = validationResult(req)

                if(!err.isEmpty()) {
                    return res.status(400).json(err.array())
                }
                const {name, userId} = req.body
                
                let sql = `INSERT INTO channels (name, user_id) VALUES (?, ?)`
                conn.query(sql, [name, userId],
                    (err, results) => {
                        if(err) {
                            console.log(err)
                            return res.status(400).end()
                        }
                        res.status(201).json(results)
                    }
                )
            }
        )

router
    .route("/:id")
    .get( param().notEmpty().withMessage('채널 id 필요'),
        (req, res) => {
        const err = validationResult(req)

        if(!err.isEmpty()) {
            return res.status(400).json(arr.array())
        }

        let id = stringToInt(req.params)

        let sql = `SELECT * FROM channels WHERE id = ? `
        conn.query(sql, id,
            (err, results) => {
                if(err){
                    console.log(err)
                    res.status(400).end()
                } 
                
                if(results.length){
                    res.status(200).json(results)
                }
                else {
                    notFoundId(res)
                }
            }
        )
    })

    .put([param('id').notEmpty().withMessage('채널 id 필요'),
        body('name').notEmpty().isString().withMessage('채널명 오류'),
    ],
        (req, res) => {
        const err = validationResult(req)

        if(!err.isEmpty()) {
            return res.status(400).json(err.array())
        }

        let {name} = req.body
        let {id} = req.params
        id = parseInt(id)

        let values = [name, id]
        
        let sql = 'UPDATE channels SET name = ? WHERE id = ?'
        conn.query(sql, values,
            (err, results) => {
                if(err) {
                    console.log(err)
                    return res.status(400).end()
                }

                if(results.affectedRows == 0) {
                    return notFoundId(res)
                }
                else {
                    res.status(200).json(results)
                }
            }
        )
    })

    .delete(param('id').notEmpty().isInt().withMessage('채널 ID 필요'),
        (req, res) => {
        const err = validationResult(req)

        if(!err.isEmpty()){
            return res.status.json(err.array())
        }
        let {id} = req.params
        id = parseInt(id)
        
        let sql = "DELETE FROM channels WHERE id = ?"

        conn.query(sql, id, 
            (err, results) => {
                if(err){
                    return res.status(400).json(err)
                }

                if(results.affectedRows == 0){
                    return  res.status(400).end()
                }
                else {
                    res.status(200).json(results)
                }                
            }
        )
    })

module.exports = router