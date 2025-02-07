import { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "../../firebase"; // Asegúrate de que la ruta sea correcta
import toast from "react-hot-toast";
import { Link } from "react-router-dom";

const RecuperarContrasena = () => {
    const [correo, setCorreo] = useState<string>("");
    const [enviando, setEnviando] = useState<boolean>(false);

    const manejarEnvio = async (e: React.FormEvent) => {
        e.preventDefault();
        setEnviando(true);
        try {
            await sendPasswordResetEmail(auth, correo);
            toast.success("Correo para restablecer la contraseña enviado.");
        } catch (error: any) {
            console.error("Error al enviar correo de recuperación:", error);
            switch (error.code) {
                case "auth/user-not-found":
                    toast.error("No se encontró una cuenta con este correo electrónico.");
                    break;
                case "auth/invalid-email":
                    toast.error("El correo electrónico no es válido.");
                    break;
                case "auth/too-many-requests":
                    toast.error("Demasiados intentos. Por favor, inténtalo de nuevo más tarde.");
                    break;
                default:
                    toast.error("Error al enviar el correo para restablecer la contraseña.");
                    break;
            }
        } finally {
            setEnviando(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-800 p-4">
            <div className="w-full max-w-sm bg-gray-700 p-6 rounded shadow">
                <h2 className="text-2xl font-bold text-center text-white mb-4">
                    Recuperar Contraseña
                </h2>
                <form onSubmit={manejarEnvio} className="space-y-4">
                    <div>
                        <label htmlFor="correo" className="block text-sm font-medium text-white">
                            Correo electrónico:
                        </label>
                        <input
                            type="email"
                            id="correo"
                            value={correo}
                            onChange={(e) => setCorreo(e.target.value)}
                            required
                            className="mt-1 block w-full rounded-md p-2 text-black focus:outline-[#EA580C]"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={enviando}
                        className="w-full flex justify-center rounded-md px-3 py-2 font-semibold text-white bg-[#EA580C] hover:bg-[#FF6B35]"
                    >
                        {enviando ? "Enviando..." : "Enviar correo"}
                    </button>
                </form>
                <p className="mt-4 text-center text-white">
                    Recuerda volver al{" "}
                    <Link to="/login" className="font-semibold text-[#EA580C] hover:text-[#FF6B35]">
                        inicio de sesión
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default RecuperarContrasena;
