const express = require('express')
const router = express.Router()
const {
    create,
    store,
    edit,
    update,
    show
} = require('../controllers/studentController')


router.route('/create').get(create).post(store)
router.route('/payment/:id').get(edit).post(update)
router.route('/search').get(show)

module.exports = router


