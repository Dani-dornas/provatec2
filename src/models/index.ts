import mongoose from "mongoose";
const { Schema } = mongoose;

const MilitarSchema = new Schema({
    nome: { type: String, maxlength: [50, "O nome pode ter no máximo 50 caracteres"], required: true },
    idade: {
        type: Number,
        maxlenght: [3, "A idade pode ter no máximo 3 caracteres"],
        required: true,
        unique: true,
        validate: {
            validator: function (value: number) {
                if (typeof value !== 'number') {
                    return false;
                }
            },
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
                }
            },
            message: (props: any) =>
                `${props.value} não é um telefone válido válido! Escreva no formato (XX) XXXXX-XXXX`,
        },
    }
}, { timestamps: true },
);

const SoldadoSchema = new Schema({
    altura: { type: Number, required: true },
    cim: {
        type: Number,
        maxlength: [10, "O CIM pode ter no máximo 10 caracteres"]

    },
    militar: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Militar',
        required: true,
        validate: {
            validator: async function (id: string) {
                const militar = await Militar.findById(id); // verifica se id existe na coleção Militars
                return !!militar; // true se o Militar existir
            },
            message: 'O militar fornecido não existe!',
        }
    }
});

const PatenteSchema = new Schema({
    codigo: { type: Number, maxlength: 2, required: true, unique: true },
    descricao: { type: String, maxlength: [30, "A descrição pode ter no máximo 30 caracteres"], required: true }
});


const Militar = mongoose.model("Militar", MilitarSchema, "militares");
const Soldado = mongoose.model("Soldado", SoldadoSchema);
const Patente = mongoose.model("Patente", PatenteSchema);

export { Militar, Soldado, Patente };