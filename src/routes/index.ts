import { Router, Request, Response } from "express";
import autor from './Militar';
import editora from './Patente';
import livro from './Soldado';

const routes = Router();
routes.use("/autor", autor);
routes.use("/editora", editora);
routes.use("/livro", livro);

//aceita qualquer método HTTP ou URL
routes.use( (_:Request,res:Response) => res.json({error:"Requisição desconhecida"}) );

export default routes;