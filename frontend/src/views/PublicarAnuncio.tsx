import { useState } from "react";
import toast from "react-hot-toast";
import { auth, db } from "../../firebase";
import { doc, setDoc } from "firebase/firestore"

const PublicarAnuncio = () => {
    const [nombre, setNombre] = useState<string>("");
    const [edad, setEdad] = useState<string>("");
    const [numero, setNumero] = useState<string>("");

    const manejarFormulario = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        const user = auth.currentUser
        console.log(user);

        if (!user) {
            toast.error("No estás autenticado. Por favor inicia sesión.")
            return
        }

        if (!nombre || !edad || !numero) {
            toast.error("Debes completar todos los campos")
            return
        }

        const edadNumero = Number(edad)
        if (isNaN(edadNumero)) {
            toast.error("La edad debe ser un número válido")
            return
        }
        if (edadNumero < 18) {
            toast.error("Debes ser mayor de 18 años para publicar un anuncio");
            return;
        }

        const numeroPattern = /^9\d{8}$/;
        if (!numeroPattern.test(numero)) {
            toast.error("El número debe ser de 9 dígitos");
            return;
        }

        try {
            await setDoc(
                doc(db, "usuarios", user.uid),
                {
                    nombre,
                    edad: edadNumero,
                    numero: Number(numero),
                    email: user.email,
                    actualizado: new Date(),
                },
                { merge: true }
            )
            toast.success("Información guardada correctamente")
        } catch (error) {
            console.error("Error al guardar los datos: ", error);
            toast.error("Hubo un error al guardar la información ");
        }
    }
    return (
        <div className="min-h-screen flex items-center justify-center bg-[#101828] p-4">
            <div className="w-full max-w-md bg-gray-700 p-6 rounded shadow">
                <h2 className="text-2xl font-bold text-center mb-4">
                    PUBLICAR ANUNCIO
                </h2>
                <h3 className="text-center text-sm font-medium">Completa la informacion requerida para poder publicar tu anuncio</h3>
                <form onSubmit={manejarFormulario} className="space-y-4 mt-6">
                    <div>
                        <label htmlFor="nombre" className="block text-white">
                            Nombre:
                        </label>
                        <input
                            type="text"
                            id="nombre"
                            value={nombre}
                            onChange={(e) => setNombre(e.target.value)}
                            className="mt-1 block w-full p-2 rounded text-black"
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="edad" className="block text-white">
                            Edad:
                        </label>
                        <input
                            type="number"
                            id="edad"
                            value={edad}
                            onChange={(e) => setEdad(e.target.value)}
                            className="mt-1 block w-full p-2 rounded text-black"
                            min="18"
                            max="99"
                            required
                            onInvalid={(e) => e.currentTarget.setCustomValidity("Debes ser mayor de 18 años para publicar un anuncio")}
                            onInput={(e) => e.currentTarget.setCustomValidity("")}
                        />
                    </div>
                    <div>
                        <label htmlFor="numero" className="block text-white">
                            Número de celular:
                        </label>
                        <input
                            type="tel"
                            id="numero"
                            value={numero}
                            onChange={(e) => setNumero(e.target.value)}
                            className="mt-1 block w-full p-2 rounded text-black"
                            required
                            pattern="^9\d{8}$"
                            onInvalid={(e) =>
                                e.currentTarget.setCustomValidity("El número debe ser de 9 dígitos")
                            }
                            onInput={(e) => e.currentTarget.setCustomValidity("")}
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center rounded-md px-3 py-2 font-semibold text-white bg-[#EA580C] hover:bg-[#FF6B35]"
                    >
                        Publicar Anuncio
                    </button>
                </form>
            </div>
        </div>
    );
};

export default PublicarAnuncio;
