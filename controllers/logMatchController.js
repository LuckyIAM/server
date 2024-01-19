const fs = require('fs')
const {ContentData} = require('../model/model')

class LogMatch{
    async logMatch(req, res){
        let recordInDB
        const getDataFromFile = fs.readFileSync('./Реестр_журналов_из_БД_7_8_091023.csv', 'utf-8')
        console.log(getDataFromFile);
        const dataSplitNL = getDataFromFile.split('\n')
       
        for(let i = 1; i < dataSplitNL.length - 1; i++){
            console.log(`data${i}`,dataSplitNL[i]);
            let elementSplitCSV = dataSplitNL[i].split(';')[1]
            console.log(elementSplitCSV)

            const maxId = await ContentData.count()
            for(let id = 1; id < maxId; id++){

                recordInDB = await ContentData.findOne({
                    where:{
                        id: id
                    }
                    
                })
                let reg  = ''
                for(let j = 0; j < elementSplitCSV.length - 1; j++){
                    reg = reg + `[${elementSplitCSV[j].toUpperCase()}${elementSplitCSV[j].toLowerCase()}]{1,1}`
                }
                let regNume = new RegExp(reg, 'g')
                console.log(reg, );
                if(regNume.test(recordInDB.name_journal)){
                    fs.appendFileSync('./journal_in_Mojaets.txt', `${elementSplitCSV}, `,'utf-8') //`${elementSplitCSV} ${recordInDB.id} \n`
                }else{
                    fs.appendFileSync('./not_journal_in_Mojaetsk.txt', `Данный журнал не обнаружен в коробках: ${elementSplitCSV}- id: ${recordInDB.id} \n`, 'utf-8')
                }

            }
        }
        res.json({data: 'All is work!'})
    }
    async getCompare(req, res){
        
    }
    getSet(req, res){
        const dataFromFile = fs.readFileSync('./journal_in_Mojaets.txt', 'utf-8')
        const namesJournal = new Set(dataFromFile.split('\r\n, '))
        // console.log(namesJournal);
        const data = fs.readFileSync('./setJournal.txt', 'utf-8')
        console.log(data);
        data.split('\n').foreach(elem => {
            fs.appendFileSync('./journal_in_Mojaets.txt', `${elem};\n`)
        })
        res.json({data: data})
    }
}

module.exports = new LogMatch()