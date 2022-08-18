import express from 'express';
import nameQuery from '../components/nameQuery'

const indexRouter = express.Router();

indexRouter.get('/', (req,res) => {
    res.send('You have queried the backend ENFS server')
})

indexRouter.post('/checkNames', (req,res) => {
    nameQuery(req.body.regex).then(response => {
        console.log(Object.fromEntries(response))
        res.send(Object.fromEntries(response))
    })
})

// ROUTES LIST:
// NameQuery - Receives regex string, Returns list of names & their info
// PostDB - Posts DB info
// PullDB - Sends a list of names, Receives names and their info
// UpdateDB - Pulls updated block info from Infura

export default indexRouter;