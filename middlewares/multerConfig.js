import multer, { diskStorage } from 'multer'
import { formattedDate } from '../utils/formatDate.js'
const date = formattedDate.split('/').join('')

const storage = diskStorage({
    destination: (req, file, cb) => {
        
        if(req.route.path === '/users' || req.route.path === '/users/:id'){
            cb(null, './public/images/users')
        } else if(req.route.path === '/students') {
            cb(null, './public/images/students')
        } else {
            cb(new Error('Ruta inválida'))
        }
    },
    filename: (req, file, cb) => {
        const ext = file.originalname.split('.').pop()
        const name = req.body.name.split(' ').join('')
        cb(null, `${date}-${name}.${ext}`)
    }
})

const upload = multer({ storage })

export default upload