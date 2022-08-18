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




export default indexRouter;