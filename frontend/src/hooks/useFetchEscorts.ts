import { useEffect, useState } from "react";

interface Escorts {
    id: number;
    nombre: string;
    edad: number;
    celular: string;
    pais: string;
    email: string;
    password_hash: string;
    imagenes: string; 
}

export function useFetchUsuarios(url: string) {

    const [usuarios,setUsuarios] = useState<Escorts[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchEscorts = async () => {
            try {
                const response = await fetch(url)
                if (!response.ok) {
                    throw new Error('Error en la solicitud')
                }
                const data = await response.json()
                setUsuarios(data)
            } catch (error) {
                console.error('Error al obtener los datos:', error)
            } finally {
                setLoading(false)
            }
        }

        fetchEscorts()
    }, [url])
    return {usuarios, loading};
}