import { useState } from "react";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"
import "./registro.css"

const Registro = () => {
    // Estado para los valores del formulario
    const [correo, setCorreo] = useState<string>('');
    const [contraseña, setContraseña] = useState<string>('');
    const [mensaje, setMensaje] = useState<string>('')

    // Manejo del envío del formulario
    const manejarRegistro = async (e: React.FormEvent) => {
        e.preventDefault();

        if (contraseña.length < 6) {
            setMensaje("La contraseña debe tener al menos 6 caracteres.");
            return;
        }

        try {
            await createUserWithEmailAndPassword(auth, correo, contraseña)
            setMensaje("¡Usuario registrado con éxito!")
        } catch (error: any) {
            setMensaje("Hubo un error: " + error.message);
        }
    };

    return (
        <main className="flex min-h-full flex-1 flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold text-white">CREA TU CUENTA</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">

                <form onSubmit={manejarRegistro} className="space-y-6">
                    <div>
                        <label htmlFor="nombre" className="block text-sm/6 font-medium">Correo electrónico:</label>
                        <div className="mt-2">
                            <input
                                type="email"
                                id="correo"
                                value={correo}
                                onChange={(e) => setCorreo(e.target.value)}
                                required
                                className="block w-full rounded-md px-3 py-1.5"
                            />
                        </div>
                    </div>
                    <div>
                        <div className="flex items-center justify-between">
                            <label htmlFor="contraseña" className="block text-sm/6 font-medium">Contraseña:</label>
                            <div className="text-sm">
                                <a href="#" className="font-semibold text-[#EA580C]">Olvidaste tu contraseña?</a>
                            </div>
                        </div>
                        <div className="mt-2">
                            <input
                                type="password"
                                id="contraseña"
                                value={contraseña}
                                onChange={(e) => setContraseña(e.target.value)}
                                required
                                className="block w-full rounded-md px-3 py-1.5"
                            />
                        </div>
                    </div>
                    <div>
                        <button type="submit" className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white bg-[#EA580C]">Registrar</button>
                    </div>
                </form>
            </div>
            {mensaje && <p>{mensaje}</p>}
        </main>
    );
};

export default Registro