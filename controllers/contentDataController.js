const fs = require('fs')
const {ImportFile, ContentData, User} = require('../model/model')
const jwt = require('jsonwebtoken')


class ContentParse{
    async parsData(req, res){
        const {file_meta, date} = req.body
        let fileInDB, nameFileToParse,  dataFileSplit, elementsOfElement, element, addContent, existRecord
        let box_num = -1, quantity = -1, content, nameJournal, collector, collectorNow, nameJrnl
        
        
        if(!file_meta && date){
            fileInDB = await ImportFile.findAll({
                where: {
                    'create_data': date
                }
            })
        }
        if(file_meta && !date){
            fileInDB = await ImportFile.findAll({
                where: {
                    'file_name': file_meta
                }
            })
        }
        if(file_meta && date){
            fileInDB = await ImportFile.findAll({
                where: {
                    'file_name': file_meta, 
                    'create_data': date
                 }
            })
        }
        console.log('file_name: ', file_meta,);
        console.log(fileInDB);
        nameFileToParse = fs.readFileSync(`./filesUpload/${fileInDB[0].file_up}`, 'utf-8')

        const token = req.headers.authorization.split(' ')[1]
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        console.log(decoded.name);

        const user = await User.findOne({
            where:{
                mail: decoded.mail
            }
        })
        
        dataFileSplit = nameFileToParse.split('\r\n')
        console.log(dataFileSplit);
        for(let i = 0; i < dataFileSplit.length; i++){
            element= dataFileSplit[i]
            console.log(element);
            elementsOfElement = element.split(';')
            // console.log(elementsOfElement.length, elementsOfElement, elementsOfElement[0], typeof elementsOfElement[0] === 'number', typeof elementsOfElement[1], elementsOfElement[1], elementsOfElement[2]);
            console.log(elementsOfElement.length, elementsOfElement);
            if(elementsOfElement.length >=  4){
                if( ((/[0-9]+/g).test(elementsOfElement[0].trim()) || (/[0-9]+\n[0-9]+/g).test(elementsOfElement[0].trim()) || (/[0-9]+[abABавАВ]{1}/g).test(elementsOfElement[0].trim()) || (/б\/н/g).test(elementsOfElement[0].trim())) && (/[0-9]+/g).test(elementsOfElement[1].trim())){
                    box_num = elementsOfElement[0]
                    quantity = Number(elementsOfElement[1])
                    
                    if(elementsOfElement.length == 4){
                        nameJournal = elementsOfElement[2]
                        collector = (/[а-яё]+/g).test(elementsOfElement[3]) ?  `\n ${elementsOfElement[3]}` : ''

                        content = await ContentData.create({
                            num_box: box_num,
                            quantity: quantity,
                            name_journal: nameJournal, 
                            collector: collector,
                            userId: user.id
                        })
                    }
                    
                    if(elementsOfElement.length > 4){
                        nameJournal = elementsOfElement.slice(2, elementsOfElement.length - 1).join()
                        collector = (/[а-яё]+/g).test(elementsOfElement[elementsOfElement.length - 1]) ? elementsOfElement[elementsOfElement.length - 1] : ''
                        content = await ContentData.create({
                            num_box: box_num,
                            quantity: quantity,
                            name_journal: nameJournal, 
                            collector: collector
    
                        })
                    }

                    

                }else if(elementsOfElement[0]==='' &&  elementsOfElement[1] === ''){
                    existRecord =  await ContentData.findOne({
                        where:{
                            num_box: box_num
                        }
                    })
                    if(elementsOfElement.length == 4){
                        nameJournal = existRecord.name_journal +  `\n ${elementsOfElement[2]}`
                        collectorNow = (/[а-яё]+/g).test(elementsOfElement[3]) ?  `\n ${elementsOfElement[3]}` : ''
                        collector = existRecord.collector + collectorNow

                        addContent = await ContentData.update({
                            name_journal: nameJournal, 
                            collector: collector
                        },
                        {
                            where: {
                                num_box:box_num
                            }
                        })
                    }
                    
                    if(elementsOfElement.length > 4){
                        nameJournal = existRecord.name_journal + `\n ${elementsOfElement.slice(2, elementsOfElement.length).join()}`
                        collectorNow = (/[а-яё]+/g).test(elementsOfElement[elementsOfElement.length - 1]) ?  `\n ${elementsOfElement[elementsOfElement.length - 1]}` : ''
                        collector = existRecord.collector + collectorNow
                        
                        addContent = await ContentData.update({
                            name_journal: nameJournal, 
                            collector: collector
                        },
                        {
                            where: {
                                num_box:box_num
                            }
                        })
                    }
                    
                    
                    console.log('nummber box:', box_num, 'nameJournal', nameJournal, 'collector.file_name', collector) 
                    
                }
            // }else if(elementsOfElement.length == 1){
            //     const recordLast = await ContentData.update({
            //         name_journal: elementsOfElement[0], 
            //     },
            //     {
            //         where: {
            //             num_box:box_num
            //         }
            //     })  
            
            }else{
                fs.appendFileSync('./badWriter.text', element)
            }
        }

        // console.log(dataFileSplit);


        return res.json(fileInDB)

        
        
    }
    async getOneData(req, res){
        const {id} = req.params
        const record = await ContentData.findOne({
            where:{id}
        })
        return res.json(record)
    }
    async getAllDatas(req, res){
        let searchExemplear, recordInDB, addRecordToSearch = [], searchWord,  searchYear, findeRecords = 0

        const {data_search, year} = req.body

        const maxId = await ContentData.count()

        for(let id = 1; id < maxId; id++){

            recordInDB = await ContentData.findOne({
                where:{
                    id: id
                }
                
            })
            searchWord = recordInDB.name_journal

            console.log(recordInDB);
            console.log(searchWord.toLowerCase(), data_search);

            if(!data_search && year){
                if(searchWord.includes(year)){
                    addRecordToSearch.push(recordInDB)
                }
            }
    
            if(data_search && !year){
                if(searchWord.toLowerCase().includes(data_search.toLowerCase())){ 
                    addRecordToSearch.push(recordInDB)
                }
            }
    
            if(data_search && year){
                if(searchWord.toLowerCase().includes(data_search.toLowerCase())){
                    addRecordToSearch.push(recordInDB)
                }
                if(searchWord.toLowerCase().includes(year.toLowerCase())){
                    addRecordToSearch.push(recordInDB)
                }
            }

        }
        res.json(addRecordToSearch)
    }
    async getAll(req, res){
        
    }
}

module.exports = new ContentParse()