const path = require('path')
const CryptoJS = require('crypto-js')
const {
    createStudent,
    getStudentById,
    updatePaymentData,
    getStudentByRegNo
} = require('../services/student')
require('dotenv').config()

const create = async (req, res) => {
    return res.render(path.resolve('./views/index'), {
        title: "Student Information",
    })

}

const store = async (req, res) => {
    try {
        const data = req.body

        var errors = new Array();

        if(!data['full_name'] || data['full_name'] == '') {
            errors["full_name"] = "Full name cannot be empty !"
        }else if(!/^[A-Za-z\s]*$/.test(data['full_name'])) {
            errors["full_name"] = "Sport should only contain letters !"
        }

        if(!data['reg_no'] || data['reg_no'] == '') {
            errors["reg_no"] = "Register no cannot be empty !"
        }else if(!/^[0-9]*$/.test(data['reg_no'])) {
            errors["reg_no"] = "Register No should only contain numbers !"
        }else if((await getStudentByRegNo(data['reg_no'])).length > 0) {
            errors["reg_no"] = "Register No already exist !"
        }


        if(!data['dob'] || data['dob'] == '') {
            errors["dob"] = "Please select date of birth !"
        }

        if(!data['age'] || data['age'] == '') {
            errors["age"] = "Age cannot be empty !"
        }

        if(!data['sport'] || data['sport'] == '') {
            errors["sport"] = "sport cannot be empty !"
        }else if(!/^[A-Za-z\s]*$/.test(data['sport'])) {
            errors["sport"] = "Sport should only contain letters !"
        }


        if(Object.keys(errors).length > 0) {
            return res.render(path.resolve('./views/index'), {
                title: "Student Information",
                errors: errors,
                data:data
                
            })
        }

        var id = await createStudent(data)

        if(!id) {
            res.redirect('/student/create')
        }

        const encrypted = await CryptoJS.AES.encrypt(id.toString(), process.env.SECRET_KEY);

        res.redirect('/student/payment/' + encodeURIComponent(encrypted.toString()))

    } catch (err) {
        console.log(err)
        process.exit(1)
    }
 };

const edit = async (req, res) => { 

    try {
        const { id } = req.params

        var encrypted_id = await CryptoJS.AES.decrypt(decodeURIComponent(id), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    
        const user = await getStudentById(encrypted_id)
    
        if(!user.length > 0) {
            return res.render('404', {
                title: "Page Not Found"
            })
        }
    
        return res.render(path.resolve('./views/payment'), {
            title: "Payemnt Information",
        })

    }catch (err) {
        console.log(err)
        process.exit(1)
    }
};

const update = async (req, res) => { 

    try {
        const { id } = req.params
        const data = req.body

        var encrypted_id = await CryptoJS.AES.decrypt(decodeURIComponent(id), process.env.SECRET_KEY).toString(CryptoJS.enc.Utf8);
    
        const user = await getStudentById(encrypted_id)
    
        if(!user.length > 0) {
            return res.render('404', {
                title: "Page Not Found"
            })
        }

        var errors = new Array();

        if(!data['card_no'] || data['card_no'] == '') {
            errors["card_no"] = "Card Number cannot be empty !"
        }else if(!/^[0-9-]*$/.test(data['card_no'])) {
            errors["card_no"] = "Card Number should only contain number !"
        }

        if(!data['expire_date'] || data['expire_date'] == '') {
            errors["expire_date"] = "Expire Date cannot be empty !"
        }else if(!/^[0-9/]*$/.test(data['expire_date'])) {
            errors["expire_date"] = "Expire date should only contain numbers !"
        }

        if(!data['cvv'] || data['cvv'] == '') {
            errors["cvv"] = "CVV cannot be empty  !"
        }else if(!/^[0-9]*$/.test(data['cvv'])) {
            errors["cvv"] = "CVV should only contain numbers !"
        }

        if(!data['holder_name'] || data['holder_name'] == '') {
            errors["holder_name"] = "Cardholder name cannot be empty !"
        }else if(!/^[A-Za-z\s]*$/.test(data['holder_name'])) {
            errors["holder_name"] = "Cardholder name should only contain letters !"
        }


        if(Object.keys(errors).length > 0) {
            return res.render(path.resolve('./views/payment'), {
                title: "Payemnt Information",
                errors: errors,
                data:data
                
            })
        }

        await updatePaymentData(data, encrypted_id)

        res.redirect('/student/create')
        
    }catch (err) {
        console.log(err)
        process.exit(1)
    }
};

const show = async (req, res) => { 

    try {
        const reg_no = req.query.reg_no


        if(reg_no && reg_no != '') {


            var errors = new Array()

            if(!/^[0-9]*$/.test(reg_no)) {
                errors["reg_no"] = "Register No should only contain numbers !"
            }
            
            if(Object.keys(errors).length > 0) {
                return res.render(path.resolve('./views/search'), {
                    title: "Search Student",
                    errors: errors,
                    reg_no:reg_no
                })
            }

            const student = await getStudentByRegNo(reg_no)

            return res.render(path.resolve('./views/search'), {
                title: "Search Student",
                student: student,
                reg_no: reg_no
            })
        }


        return res.render(path.resolve('./views/search'), {
            title: "Search Student",
        })

    }catch (err) {
        console.log(err)
        process.exit(1)
    }
};

module.exports = {
    create,
    store,
    edit,
    update,
    show,
}
