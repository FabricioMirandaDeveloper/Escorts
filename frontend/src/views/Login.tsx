import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase";
import { Link } from "react-router-dom";

const Login = () => {
    const [correo, setCorreo] = useState<string>('');
    const [contraseña, setContraseña] = useState<string>('');
    const [mensaje, setMensaje] = useState<string>('');
    const manejarLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, correo, contraseña);
            setMensaje("¡Inicio de sesión exitoso!");
        } catch (error: any) {
            setMensaje("Hubo un error: " + error.message);
        }
    };
    return(
        <>
        <main className="flex min-h-full flex-1 flex-col justify-center py-12 px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                <h2 className="mt-10 text-center text-2xl/9 font-bold text-white">INICIA SESIÓN</h2>
            </div>
            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <form onSubmit={manejarLogin} className="space-y-6">
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
                            <button
                                    type="button"
                                    className="text-sm text-[#EA580C] hover:text-[#FF6B35]"
                                >
                                    ¿Olvidaste tu contraseña?
                                </button>
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
                        <button type="submit" className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white bg-[#EA580C]">Iniciar Sesión</button>
                    </div>
                </form>
                <p className="mt-4 text-center text-sm text-white">
                    ¿No tienes una cuenta?{" "}
                    <Link to="/registro" className="font-semibold text-[#EA580C] hover:text-[#FF6B35]">
                        Regístrate
                    </Link>
                </p>
            </div>
            {mensaje && <p className="text-center text-white">{mensaje}</p>}
        </main>
        </>
    )
}
export default Login