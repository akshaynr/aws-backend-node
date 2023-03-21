
import { object, string, number } from 'yup';
import { STATUS_CODES } from '../constants';
import { HttpError }  from '../util/error';

 const productSchema = object().shape({
    title: string().required(),
    description: string(),
    price: number().required().positive(),
    count: number().required().positive().integer(),
 });

export const validateProductSchema = async(product) => {
    try{
        const validatedData = await productSchema.validate(product);
        return validatedData;
    } catch(error){
        throw new HttpError("Invalid Product Data", STATUS_CODES.BAD_REQUEST);
    }
}