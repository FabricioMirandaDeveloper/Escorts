import { useEffect, useState } from "react";

interface Usuario {
    id: number;
    nombre: string;
    edad: number;
    celular: string;
    pais: string;
    email: string;
    password_hash: string; // O cualquier otro campo que necesites
    imagenes: string; // La propiedad que almacena la URL de la imagen
}

export default function Escorts() {
    const [usuarios,setUsuarios] = useState<Usuario[]>([])
    useEffect(() => {
        const fetchEscorts = async () => {
            try {
                const response = await fetch('http://localhost:3000/usuarios')
                if (!response.ok) {
                    throw new Error('Error en la solicitud')
                }
                const data = await response.json()
                console.log(data);
                
                setUsuarios(data)
            } catch (error) {
                console.error('Error al obtener los datos:', error)
            }
        }
        fetchEscorts()
    }, [])
    return(
        <main>
            <section className="grid grid-cols-3 gap-1">
                {usuarios.map(usuario => (
                    <div key={usuario.id}>
                        <img src={usuario.imagenes} alt={usuario.nombre} className="h-48 object-cover rounded-sm"/>
                    </div>
                ))}
            </section>
        </main>
    )
}   