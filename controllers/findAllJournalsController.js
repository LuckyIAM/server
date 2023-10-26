const axios = require('axios')
const qs = require('qs')


class GetJournalName{
    async getJournals(req, res){
        let token, inv_num
        const data = {
            grant_type:'password',
            client_id:'354FE540-6100-436F-A212-7B29C4D09545',
            client_secret: 'rhBQCWiIufQRooTtXcH',
            username: 'PRGUS',
            password: 'wsDCrf7',
            scope: 'read/write/admin',
            refresh_token: ''
        }
        const options = {
            headers: { 'content-type': 'application/x-www-form-urlencoded' },
            data: qs.stringify(data),
            url:`http://opac64-test.liart.local/api/v1/oauth2/token`,
            method: 'POST'
        }
        await axios(options)
        .then(respons => {
            token = respons.data.access_token
        })
        .catch(err => {console.error(err)})

        const dataId = {
            limit: 3000,
            prefix: 'Слово',
            position: 4500000,
        }
        const optionsId = {
            headers: { Authorization : `Bearer ${token}`,
            Accept: 'application/vnd.api+json' },
            url:`http://opac64-test.liart.local/api/v1/databases/404/indexes/IN?limit=3000&prefix=Слово&position=4500000`,
            method: 'GET'
        }
        await axios(optionsId)
        .then(respons => {
            inv_num = respons.data
        })
        .catch(err => {console.error(err)})
        res.json(inv_num)
    }
}

module.exports = new GetJournalName()