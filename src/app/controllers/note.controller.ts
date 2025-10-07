import express, { Request, Response } from "express";
import { Note } from "../models/note.model";

export const noteRouter = express.Router()

noteRouter.post('/create-note', async(req: Request, res: Response) => {

    const body = req.body;

    // APPROACH - 1 OF CREATING A DATA

    // const myNote = new Note({
    //     title: 'Learning Express', 
    //     tags: {
    //         label: 'database'
    //     }
    // })

    // await myNote.save()

    
    // APPROACH - 2 OF CREATING A DATA

    const note = await Note.create(body)

    res.status(201).json({
        success: true,
        message: 'Note created successfully', 
        note
    })
})

noteRouter.get('/', async(req: Request, res: Response) => {

    const notes = await Note.find().populate('user')

    res.status(200).json({
        success: true,
        message: 'Get your notes successfully!', 
        notes
    })
})

noteRouter.get('/:noteId', async(req: Request, res: Response) => {

    const noteId = req.params.noteId;
    const note = await Note.findById(noteId)

    // Another Way
    // const note = await Note.findOne({ _id: noteId})

    res.status(200).json({
        success: true,
        message: 'Get your note successfully!', 
        note,
    })
})

noteRouter.patch('/:noteId', async(req: Request, res: Response) => {
    
    const noteId = req.params.noteId;
    const updatedBody = req.body;

    const note = await Note.findByIdAndUpdate(noteId, updatedBody, { new: true })
    const note2 = await Note.updateOne({ _id: noteId}, updatedBody)
    const note3 = await Note.findOneAndUpdate({ _id: noteId}, updatedBody, { new: true })

    res.status(201).json({
        success: true,
        message: 'Note Updated Successfully',
        note
    })
})

noteRouter.delete('/:noteId', async(req: Request, res: Response) => {
    const noteId = req.params.noteId;

    await Note.findByIdAndDelete(noteId);
    await Note.deleteOne({ _id: noteId });
    await Note.findOneAndDelete({ _id: noteId })

    res.status(200).json({
        success: true,
        message: 'Note Deleted Successfully'
    })
})
