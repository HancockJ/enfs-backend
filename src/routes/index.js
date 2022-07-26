import express from 'express';
import nameQuery from '../components/nameQuery'

const indexRouter = express.Router();

indexRouter.get('/', (req,res) => {
    res.send('You have queried the backend ENFS server')
})

indexRouter.post('/checkNames', (req,res) => {
    nameQuery(req.body.regex).then(response => {
        console.log("response",response)
        res.send(response)
    })
})
// TODO: Change checkName to nameQuery
// ROUTES LIST:
// NameQuery - Receives regex string, Returns list of names & their info
// PostDB - Posts DB info
// PullDB - Sends a list of names, Receives names and their info
// UpdateDB - Pulls updated block info from Infura

export default indexRouter;