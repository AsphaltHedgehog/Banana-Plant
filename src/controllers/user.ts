import { Request, Response } from 'express';
import User from '../models/User';
import { HttpError } from '../helpers';
import { ctrlWrapper } from '../decorators/index';



const favorite = async (req: Request, res: Response) => {
    const user = req.body.user;
    const favoriteID = req.body.favorite
    if (!user.favorite.includes(favoriteID)) {
        await User.findByIdAndUpdate(user.id,{$push:{favorite:favoriteID}},{new:true})
        res.status(201).json({ message:'user favorite succsessfuly added'})
        return
   }
   if (user.favorite.includes(favoriteID)) {
       await User.findByIdAndUpdate(user.id,{$pull:{ favorite: { id: favoriteID} }},{new:true})
    res.status(204).json({})
    return
   }
   
};



export const ctrl = {
   favorite: ctrlWrapper(favorite),
   
};
