import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"
import "./registro.css"
import toast from "react-hot-toast";

const Registro = () => {
    // Estado para los valores del formulario
    const [correo, setCorreo] = useState<string>('');
    const [contraseña, setContraseña] = useState<string>('');
    const [isLoading, setIsLoading] = useState<boolean>(false); // Estado para controlar la carga

    // Manejo del envío del formulario
    const manejarRegistro = async (e: React.FormEvent) => {
        e.preventDefault();

        if (contraseña.length < 6) {
            toast.error("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        // Deshabilitar el botón y mostrar estado de carga
        setIsLoading(true);

        toast.promise(
            createUserWithEmailAndPassword(auth, correo, contraseña),
            {
                loading: "Registrando...",
                success: <b>¡Usuario registrado con éxito!</b>,
                error: (error) => {
                    if (error.code === "auth/email-already-in-use") {
                        return <b>Este correo ya está registrado. ¿Quieres iniciar sesión?</b>
                    } else {
                        return <b>Hubo un error: {error.message}</b>
                    }
                }
            }
        )
            .then(() => {
                setCorreo("")
                setContraseña("")
            })
            .catch(() => {
                // No es necesario hacer nada aquí, ya que el error se maneja en toast.promise
            })
            .finally(() => {
                // Rehabilitar el botón después de la operación
                setIsLoading(false);
            })
    }

    return (
        <main className="flex min-h-full flex-1 flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold text-white">CREA TU CUENTA</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                <form onSubmit={manejarRegistro} className="space-y-6">
                    <div>
                        <label htmlFor="correo" className="block text-sm/6 font-medium">Correo electrónico:</label>
                        <div className="mt-2">
                            <input
                                type="email"
                                id="correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                                className="block w-full rounded-md px-3 py-1.5 text-black focus:outline-[#EA580C]"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="contraseña" className="block text-sm/6 font-medium">Contraseña:</label>
                        </div>
                        <div className="mt-2">
                            <input
                                type="password"
                                id="contraseña"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                                required
                                className="block w-full rounded-md px-3 py-1.5 text-black focus:outline-[#EA580C]"
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit" disabled={isLoading} className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white bg-[#EA580C] disabled:opacity-50">{isLoading ? "Registrando..." : "Registrar"}</button>
                    </div>
                </form>
            </div>
        </main>
    );
};

export default Registro