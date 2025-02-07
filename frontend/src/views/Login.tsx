import { signInWithEmailAndPassword } from "firebase/auth";
import { useState } from "react";
import { auth } from "../../firebase";
import { Link, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import toast from "react-hot-toast";

const Login = () => {
    const [correo, setCorreo] = useState<string>('');
    const [contraseña, setContraseña] = useState<string>('');
    const [mostrarContraseña, setMostrarContraseña] = useState<boolean>(false)
    const [cargando, setCargando] = useState<boolean>(false)

    const navigate = useNavigate()

    const manejarLogin = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            await signInWithEmailAndPassword(auth, correo, contraseña);
            toast.success("¡Inicio de sesión exitoso!");
            navigate("/panelDeControl")
        } catch (error: any) {
            switch (error.code) {
                case 'auth/wrong-password':
                    toast.error("Contraseña incorrecta. Por favor, intentalo de nuevo.")
                    break
                case 'auth/user-not-found':
                    toast.error("No se encontró una cuenta con este correo electrónico.");
                    break
                case 'auth/invalid-email':
                    toast.error("El correo electrónico no es válido.")
                    break
                case 'auth/too-many-requests':
                    toast.error("Demasiados intentos fallidos. Por favor, inténtalo de nuevo más tarde.");
                    break;
                default:
                    toast.error("Hubo un error al iniciar sesión. Por favor, inténtalo de nuevo.");
                    break;
            }
        } finally {
            setCargando(false)
        }
    }
    return (
        <>
            <Header />
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
                                <Link
                                    to="/recuperarContraseña"
                                    type="button"
                                    className="text-sm text-[#EA580C] hover:text-[#FF6B35]"
                                >
                                    ¿Olvidaste tu contraseña?
                                </Link>
                            </div>
                            <div className="mt-2 relative">
                                <input
                                    type={mostrarContraseña ? "text" : "password"}
                                    id="contraseña"
                                    value={contraseña}
                                    onChange={(e) => setContraseña(e.target.value)}
                                    required
                                    className="block w-full rounded-md px-3 py-1.5 text-black focus:outline-[#EA580C]"
                                />
                                <button type="button" onClick={() => setMostrarContraseña(!mostrarContraseña)} className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5">
                                    {mostrarContraseña ? (<FontAwesomeIcon icon={faEye} className="text-gray-500" />) : (<FontAwesomeIcon icon={faEyeSlash} className="text-gray-500" />)}
                                </button>
                            </div>
                        </div>
                        <div>
                            <button type="submit" disabled={cargando} className="flex w-full justify-center rounded-md px-3 py-1.5 text-sm/6 font-semibold text-white bg-[#EA580C]">{cargando ? "Cargando..." : "Iniciar Sesión"}</button>
                        </div>
                    </form>
                    <p className="mt-4 text-center text-sm text-white">
                        ¿No tienes una cuenta?{" "}
                        <Link to="/registro" className="font-semibold text-[#EA580C] hover:text-[#FF6B35]">
                            Regístrate
                        </Link>
                    </p>
                </div>
            </main>
        </>
    )
}
export default Login