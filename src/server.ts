import { Server } from 'http'
import app from './app'
import mongoose from 'mongoose'

let server: Server

const PORT = 5000

async function main() {
    try {
        await mongoose.connect('mongodb+srv://mern123:mern123@mernapp.atv7idg.mongodb.net/note-app?retryWrites=true&w=majority&appName=mernapp')

        server = app.listen(PORT, () => {
            console.log(`App is listening on PORT ${PORT}`);
        })
    } catch (error) {
        console.log(error)
    }
}

main()