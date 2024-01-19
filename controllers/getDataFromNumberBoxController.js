const {ContentData} =require('../model/model')

class GetDataFromNumberBox{
    async getOneDataFromIdBox(req, res){
        const {num_box} = req.body
        const record = await ContentData.findAll()
        console.log(record);
        let box = []
        for(let i = 0; i < record.length; i++){
            if(record[i].num_box.includes(String(num_box))){
                box.push(record[i])
            }
        }
        return res.json(box)
    }
}

module.exports = new GetDataFromNumberBox()