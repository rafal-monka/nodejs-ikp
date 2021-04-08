const http2 = require("http2")
const email = require("./email")

const baseurl = 'https://pacjent.erejestracja.ezdrowie.gov.pl'
const prescriptionId = "21594a8e-cd9b-46a9-8d5a-d280c52a1695"

var Confirmed = false

exports.IKPConfirm = (id, patient_sid, x_csrf_token) => {
    
    let path = '/api/calendarSlots/calendarSlot/'+id+'/confirm'
    let postbody = JSON.stringify(
        {"prescriptionId": prescriptionId}
    )
    console.log('IKPConfirm', id, patient_sid, x_csrf_token)
    Confirmed = true
    this.IKPSendEmail('Reserved/status:'+Confirmed, id+'/'+prescriptionId+', this.Confirmed='+Confirmed)
    return
    return new Promise((resolve) => {
        const client = http2.connect(baseurl);
        const request = client.request({
            ":method": "POST",
            ":path": path,
            "content-length": Buffer.byteLength(postbody),
            "Accept": "application/json, text/plain, */*",
            "Content-Type": "application/json;charset=UTF-8",
            "Cookie": "patient_sid="+patient_sid,
            "Origin": baseurl,
            "Referer": "https://pacjent.erejestracja.ezdrowie.gov.pl/rezerwacja-wizyty",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
            "X-Csrf-Token": x_csrf_token,
            "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
            "sec-ch-ua-mobile": "?0"
        })

        request.on("response", (headers, flags) => {
            console.log(new Date(), "IKPConfirm #response")
            for (const name in headers) {
                // console.log(`${name}: ${headers[name]}`);
            }
        });

        request.on("data", chunk => {
            response = response + chunk;
        });

        request.on("end", () => {
            client.close()
            Confirmed = true //@@@
            resolve(JSON.parse(response))
        });

        request.end(postbody)
    })


}


exports.IKPFindVaccine = (dateTo, patient_sid, x_csrf_token) => {
    return new Promise((resolve) => {
        let response = "";
        let dateFrom = new Date().toISOString().substring(0,10)

        console.log('IKPCovidVaccine', dateFrom, patient_sid, x_csrf_token)
        let postbody = JSON.stringify(
            //Wrocław all
            // {
            // "dayRange": {
            //     "from": dateFrom,
            //     "to": dateTo
            // },
            // "geoId": "0264029",
            // "prescriptionId": "21594a8e-cd9b-46a9-8d5a-d280c52a1695",
            // "voiId": "02"
            // }

            //EMC Moderna, Pfizer
            {
                "dayRange": {
                    "from": dateFrom,
                    "to": dateTo
                },
                "geoId": "0264029" /*WRO-FAB*/, //"0264011" /*WRO*/, 
                "prescriptionId": prescriptionId,
                //"servicePointId": servicePointId,
                "voiId": "02",
                "vaccineTypes": [
                    "cov19.moderna", "cov19.pfizer"//, "cov19.astra_zeneca"
                ]
            }
        );
        
        let path = '/api/calendarSlots/find'
        const client = http2.connect(baseurl);
        const request = client.request({
            ":method": "POST",
            ":path": path,
            //"content-type": "application/json",
            "content-length": Buffer.byteLength(postbody),

            // :authority: pacjent.erejestracja.ezdrowie.gov.pl
            // :method: POST
            // :path: /api/calendarSlots/find
            // :scheme: https
            // accept: application/json, text/plain, */*
            "accept-encoding": "gzip, deflate, br",
            "accept-language": "en,pl-PL;q=0.9,pl;q=0.8,en-US;q=0.7",
            "content-type": "application/json;charset=UTF-8",
            "cookie": "patient_sid="+patient_sid,
            "origin": baseurl,
            "referer": "https://pacjent.erejestracja.ezdrowie.gov.pl/rezerwacja-wizyty",
            "sec-ch-ua": '"Google Chrome";v="89", "Chromium";v="89", ";Not A Brand";v="99"',
            "sec-ch-ua-mobile": "?0",
            "sec-fetch-dest": "empty",
            "sec-fetch-mode": "cors",
            "sec-fetch-site": "same-origin",
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/89.0.4389.90 Safari/537.36",
            "x-csrf-token": x_csrf_token
        });


        request.on("response", (headers, flags) => {
            console.log(new Date(), "#response")
            for (const name in headers) {
                // console.log(`${name}: ${headers[name]}`);
            }
        });

        //let data = [];
        request.on("data", chunk => {
            //console.log("#data", chunk)
            response = response + chunk;
            //data.push(chunk);     
        });

        request.on("end", () => {
            //console.log("#end")
            //let output = data.join()
            //console.log("response", response)
            client.close()
            resolve(JSON.parse(response))
        });

        request.end(postbody)
    })
}

exports.IKPSendEmail = (title, text) => {
    email.sendEmail('-IKP '+title+' '+new Date(), text)    
}