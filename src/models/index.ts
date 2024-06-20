import mongoose from "mongoose";
const { Schema } = mongoose;

const MilitarSchema = new Schema({
    nome: { type: String, maxlength: [50, "O nome pode ter no máximo 50 caracteres"], required: true },
    idade: {
        type: Number,
        maxlenght:  [3, "A idade pode ter no máximo 3 caracteres"],
        required: true,
        unique: true,
        validate: {
            validator: function (value: number) {
                if (typeof value !== 'number') {
                    return false;
                }},
            message: (props: any) =>
                `${props.value} não é uma idade válida!`,
        },
    },
    email: {
        type: String,
        maxlength: [100, "O e-mail pode ter no máximo 60 caracteres"],
        unique: true,
        required: [true, "O e-mail é obrigatório"],
        validate: {
            validator: function (value: string) {
                // expressão regular para validar o formato do e-mail
                const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                return regex.test(value);
            },
            message: (props: any) =>
                `${props.value} não é um formato de e-mail válido`,
        },
    },
    fone: {
        type: String,
        maxlength: [11, "O telefone pode ter no máximo 11 caracteres"],
        unique: true,
        required: [true, "O e-mail é obrigatório"],
        validate: {
            validator: function (value: string) {
                if (typeof value !== 'string') {
                    return false;
                }
                value = value.replace(/[^\d]+/g, '');
                if (value.length !== 11 || !!value.match(/^(\d{5})(\d{4})$/)) {
                    return false;
                }},
            message: (props: any) =>
                `${props.value} não é um telefone válido válido! Escreva no formato (XX) XXXXX-XXXX`,
        },
    }
}, { timestamps: true },
);

const EditoraSchema = new Schema({
    razao: { type: String, maxlength: 50, required: true },
    cnpj: {
        type: String,
        minlength: 14,
        maxlength: 14,
        unique: true,
        validate: {
            validator: function (value: string) {
                // expressão regular para validar o formato do e-mail
                var b: number[] = [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]
                var c: string = String(value).replace(/[^\d]/g, '')

                if (c.length !== 14)
                    return false

                if (/0{14}/.test(c))
                    return false

                for (var i = 0, n = 0; i < 12; n += Number(c[i]) * b[++i]);
                if (Number(c[12]) != (((n %= 11) < 2) ? 0 : 11 - n))
                    return false

                for (var i = 0, n = 0; i <= 12; n += Number(c[i]) * b[i++]);
                if (Number(c[13]) != (((n %= 11) < 2) ? 0 : 11 - n))
                    return false

                return true
            },
            message: (props: any) =>
                `${props.value} não é um CNPJ válido`,
        },
    }
});

const LivroSchema = new Schema({
    editora: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Editora',
        required: true,
        validate: {
            validator: async function (id: string) {
                const editora = await Editora.findById(id); // verifica se id existe na coleção editoras
                return !!editora; // true se a editora existir
            },
            message: 'A Editora fornecida não existe!',
        }
    },
    titulo: { type: String, maxlength: 100, required: true },
    paginas: { type: Number, required: true }
});

const AutorLivroSchema = new Schema({
    livro: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Livro', required: true,
        validate: {
            validator: async function (id: string) {
                const livro = await Livro.findById(id); // verifica se id existe na coleção livros
                return !!livro; // true se o livro existir
            },
            message: 'O Livro fornecido não existe!',
        }
    },
    autor: {
        type: mongoose.Schema.Types.ObjectId, ref: 'Autor', required: true,
        validate: {
            validator: async function (id: string) {
                const autor = await Autor.findById(id); // verifica se id existe na coleção autores
                return !!autor; // true se o autor existir
            },
            message: 'O Autor fornecido não existe!',
        }
    }
});

const Autor = mongoose.model("Autor", AutorSchema, "autores");
const Editora = mongoose.model("Editora", EditoraSchema);
const Livro = mongoose.model("Livro", LivroSchema);
const AutorLivro = mongoose.model("AutorLivro", AutorLivroSchema);

export { Autor, Editora, Livro, AutorLivro };