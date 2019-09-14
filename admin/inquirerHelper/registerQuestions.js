const questions = [
    {
        type : 'input',
        name : 'firstName',
        message : 'Имя продавца'
    },
    {
        type : 'input',
        name : 'lastName',
        message : 'Фамилия продавца'
    },
    {
        type : 'input',
        name : 'login',
        message : 'Логин'
    },
    {
        type : 'passsword',
        name : 'password',
        message : 'Пароль',
        mask : '*'
    },
]

module.exports = questions;