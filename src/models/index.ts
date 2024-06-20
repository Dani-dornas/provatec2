import mongoose from "mongoose";
const { Schema } = mongoose;

const MilitarSchema = new Schema({
    nome: {
        type: String,
        maxlength: [50, "O nome pode ter no máximo 50 caracteres"], required: true
    },
    idade: {
        type: Number,
        maxlenght: [3, "A idade pode ter no máximo 3 caracteres"],
        required: true,
        unique: true,
        validate: {
            validator: function (value: number) {
                if (typeof value !== 'number' && value < 18) {
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
                //  ^[^\s@]+: Começa com um ou mais caracteres que não são espaços em branco nem @.
                //  @(eb|marinha|fab): Seguido por um @ e um dos domínios permitidos (eb, marinha ou fab).
                //  \.mil\.br$: Seguido por .mil.br, onde . é escapado (\.) para representar o ponto literal.
                const regex = /^[^\s@]+@(eb|marinha|fab)\.mil\.br$/;
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
        required: [true, "O telefone é obrigatório"],
        validate: {
            validator: function (value: string) {
                // Expressão regular para verificar se o telefone tem 10 ou 11 dígitos numéricos
                const regex = /^[0-9]{10,11}$/;

                // Verifica se o telefone corresponde ao formato esperado
                if (!regex.test(value)) {
                    return false;
                }
                // Obtém os dois primeiros dígitos do telefone para verificar o DDD
                const ddd = parseInt(value.substring(0, 2), 10); // Converte para número inteiro

                // Array com os DDDs válidos no Brasil
                const ddds = [11, 12, 13, 14, 15, 16, 17, 18, 19, 21, 22, 24, 27, 28, 31, 32, 33, 34, 35, 37, 38, 41, 42, 43, 44, 45, 46, 47, 48, 49, 51, 53, 54, 55, 61, 62, 63, 64, 65, 66, 67, 68, 69, 71, 73, 74, 75, 77, 79, 81, 82, 83, 84, 85, 86, 87, 88, 89, 91, 92, 93, 94, 95, 96, 97, 98, 99];

                // Verifica se o DDD do telefone está na lista de DDDs válidos
                if (!ddds.includes(ddd)) {
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
    altura: {
        type: Number, required: true,
        validate: {
            validator: function (value: number) {
                if (typeof value !== 'number' && value <= 20) {
                    return false
                }
            }
        }
    },
    cim: {
        type: Number,
        maxlength: [10, "O CIM pode ter no máximo 10 caracteres"],
        required: true,
        unique: true
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
    codigo: {
        type: Number,
        maxlength: 2,
        required: true,
        unique: true,
        validate: {
            validator: function (value: number) {
                if (typeof value !== 'number' && value <= 20 && value > 0) {
                    return false
                }
            }
        }
    },
    descricao: { type: String, maxlength: [30, "A descrição pode ter no máximo 30 caracteres"], required: true }
});


const Militar = mongoose.model("Militar", MilitarSchema, "militares");
const Soldado = mongoose.model("Soldado", SoldadoSchema);
const Patente = mongoose.model("Patente", PatenteSchema);

export { Militar, Soldado, Patente };