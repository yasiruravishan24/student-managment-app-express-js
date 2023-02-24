const mysql = require('../configs/mysql')

const createStudent = async (data) => {
    const [student] = await mysql.query("INSERT INTO  students (full_name, reg_no, dob, age, sport) VALUES (?, ?, ?, ?, ?)", 
    [data['full_name'], data['reg_no'], data['dob'], data['age'], data['sport']])

    return student.insertId
}

const getStudentById = async (id) => {
    const [user] = await mysql.query("SELECT * FROM students WHERE id = ?", [id])

    return user
}

const updatePaymentData = async (data, id) => {
    await mysql.query("UPDATE students SET card_no = ?, expire_date = ?, cvv = ?, cardholder_name = ?  WHERE id = ?", [data['card_no'], data['expire_date'], data['cvv'], data['holder_name'] , id])

    return id
}

const getStudentByRegNo = async (reg_no) => {
    const [user] = await mysql.query("SELECT * FROM students WHERE reg_no = ?", [reg_no])

    return user
}


module.exports = {
    createStudent,
    getStudentById,
    updatePaymentData,
    getStudentByRegNo
}