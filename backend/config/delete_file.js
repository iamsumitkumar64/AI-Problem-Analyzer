import fs from 'fs/promises';
import path from 'path';
import { __dirname } from '../index.js';

export const delfile = async (file) => {
    try {
        const filePath = path.isAbsolute(file) ? file : path.resolve(__dirname, 'uploads', file);
        await fs.unlink(filePath);
        console.log('Deleted =>', file);
    }
    catch (error) {
        console.log(`Error in Deletion (MayBe Not Found in Storage)=>${file}\t\t\t${error.message}`);
    }
}