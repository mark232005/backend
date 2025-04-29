
import fs from 'fs'
import { utilService } from "./util.service.js"
import { log } from 'console';

const toys = utilService.readJsonFile('data/toy.json')
const labels = [
    'On wheels',
    'Box game',
    'Art',
    'Baby',
    'Doll',
    'Puzzle',
    'Outdoor',
    'Battery Powered'
];


export const toyService = {
    query,
    getById,
    remove,
    save,
    labels

}


function query(filterBy = {}, sortBy = {}) {
    var toysToShow = [...toys]
    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        toysToShow = toysToShow.filter(toy => regExp.test(toy.name))
    }
    if (filterBy.inStock === 'false') {
        toysToShow = toysToShow.filter(toy => toy.inStock === false)
    }
    if (filterBy.inStock === 'true') {
        toysToShow = toysToShow.filter(toy => toy.inStock === true)

    }
    if (sortBy.type === 'name') {
        toysToShow.sort((a, b) => {
            return a.name.localeCompare(b.name)
        })
    }
    if (sortBy.type === 'price') {
        toysToShow.sort((a, b) => (a.price - b.price))

    }
    if (sortBy.type === 'date') {
        toysToShow.sort((a, b) => (a.createdAt - b.createdAt))
    }
    return Promise.resolve(toysToShow)
}

function getById(toyId) {
    const toy = toys.find(toy => toy._id === toyId)
    if (!toy) return Promise.reject('Toy not found')
    return Promise.resolve(toy)
}


function remove(toyId) {
    const idx = toys.findIndex(toy => toy._id === toyId)
    if (idx === -1) return Promise.reject('No such toy')
    toys.splice(idx, 1)
    return _saveToysToFile()
}
function save(toy) {
    if (toy._id) {
        const idx = toys.findIndex(currToy => toy._id === currToy._id)
        toys[idx] = { ...toys[idx], ...toy }
    } else {
        toy._id = _makeId()
        toy.createdAt = Date.now()
        toy.inStock = true
        toys.unshift(toy)
    }
    return _saveToysToFile().then(() => toy)
}

function _makeId(length = 5) {
    let text = ''
    const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
    for (let i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length))
    }
    return text
}


function _saveToysToFile() {
    return new Promise((resolve, reject) => {
        const toysStr = JSON.stringify(toys, null, 4)
        fs.writeFile('data/toy.json', toysStr, err => {
            if (err) {
                return console.log(err)
            }
            resolve()
        })
    })
}
