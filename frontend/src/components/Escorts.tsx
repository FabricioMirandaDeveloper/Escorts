import { useEffect } from "react";

export default function Escorts() {
    useEffect(() => {
        const fetchEscorts = async () => {
            try {
                const response = await fetch('http://localhost:3000/usuarios'); 
                if (!response.ok) {
                    throw new Error('Error en la solicitud');
                }
                const data = await response.json(); 
                console.log(data);
                
            } catch (error) {
                console.error('Error al obtener los datos:', error);
            }
        }
        fetchEscorts()
    }, [])
    return(
        <main>
            <section>

            </section>
        </main>
    )
}