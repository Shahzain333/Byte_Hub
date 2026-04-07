import Category from '../models/category.js'
import { v2 as cloudinary } from 'cloudinary'

export const addCategory = async(req,res) => {
    try {
        
        const { name } = req.body

        if(!name || !req.file) {
            return res.status(400).json({ message: "Name and Image are required!", success: false })
        }

        const alreadyExist = await Category.findOne({ name })
        
        if(alreadyExist) {
            return res.status(400).json({ message: "Category already exists", success: false })   
        }

        const result = await cloudinary.uploader.upload(req.file.path)
        
        const newcategory = await Category.create({
            name,
            image: result.secure_url
        })

        res.status(201).json({ message: "Added Category", success: true, category: newcategory })

    } catch (error) {
        console.log("Error in Add Category : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const updateCategory = async(req,res) => {
    try {
        
        const { id } = req.params
        const { name } = req.body

        const category = await Category.findById(id)

        if(!category) {
            return res.status(404).json({ message: "Category not found", success: false })
        }

        if(req.file) {
            const result = await cloudinary.uploader.upload(req.file.path)
            category.image = result.secure_url
        }

        if(name) category.name = name

        await category.save()

        res.status(200).json({ message: "Updated Category", success: true, category })

    } catch (error) {
        console.log("Error in Update Category : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const deleteCategory = async(req,res) => {
    try {
        
        const { id } = req.params
        const category = await Category.findByIdAndDelete(id)

        if(!category) {
            return res.status(404).json({ message: "Category not found" })
        }

        res.status(200).json({ message: "Category Deleted", success: true })

    } catch (error) {
        console.log("Error in Delete Category : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}

export const getAllCategory = async(req,res) => {
    try {
        const categories = await Category.find().sort({ createdAt: -1 })
        res.status(200).json({ success: true, categories })
    } catch (error) {
        console.log("Error in Get All Category : ", error.message)
        return res.json({ message: "Internal server error", success: false })
    }
}
