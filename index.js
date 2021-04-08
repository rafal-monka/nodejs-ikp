const express = require('express')
const app = express()
const ikp = require("./ikp")
const j2t = require("./libs/json2table")

const servicePointId = "f9189652-3e86-46b1-9131-54cc51ba9ace" //EMC Instytut Medyczny Pilczycka 144-148

app.get('/',  (req, res, next) => {
    res.json('IKP covid-19 vaccine robot homepage')
})

app.get('/covid-vaccine/:date_to/:patient_id/:x_csrf_token', (req, res, next) => {
    //res.json([req.params.patient_id, req.params.x_csrf_token])
    //return

    //Internetowe Konto Pacjenta - Covid vaccine requests
    // //schedule
    // cronParams = "*/10 6-21 * * 0-6" 
    // console.log('schedule IKPCovidVaccine', new Date(), cronParams)
    // if (false) schedule.scheduleJob(cronParams, function(){ 
    //     console.log('IKPCovidVaccine...')
    //     ikp.IKPFindVaccine(req.params.date_to, req.params.patient_id, req.params.x_csrf_token).then(response => {
    //         ikp.IKPSendEmail(response)
    //     })
    // })
    
    //run now
    ikp.IKPFindVaccine(req.params.date_to, req.params.patient_id, req.params.x_csrf_token).then(response => {
        let txt = 'No list'
        if (response.list && response.list.length > 0) {
            let msg = response.list.map(list => ({
                name: list.servicePoint.name,
                addressText: list.servicePoint.addressText,
                vaccineType: list.vaccineType,
                startAt: new Date(new Date(list.startAt).getTime() + 0*60*60*1000),
                id: list.id
            }))
            
            let found = response.list.find(list => list.servicePoint.id === servicePointId)
            if (found !== undefined) {
                //@@@
                txt = 'Found:'+JSON.stringify(found, ' ', 2)   
                //console.log(found)
                ikp.IKPConfirm(found.id, req.params.patient_id, req.params.x_csrf_token)
            } else {
                txt = 'Chosen Service Point not found.'
            }
            txt += '\n\nFull list:\n' + j2t.json2Table(msg)
        }
        ikp.IKPSendEmail('Query result', txt)
    })

    res.json({
        title: 'IKPCovidVaccine schedule', 
        //cronParams: cronParams, 
        date_to: req.params.date_to, 
        patient_id: req.params.patient_id, 
        x_csrf_token: req.params.x_csrf_token
    })
})

const PORT = process.env.PORT;
var server = app.listen(PORT, () => {
    console.log(`Server for IKP covid-19 vaccine is running on port ${PORT}.`);
});

