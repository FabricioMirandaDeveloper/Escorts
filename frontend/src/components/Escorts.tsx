import { Link } from "react-router-dom";
import { useFetchUsuarios } from "../hooks/useFetchEscorts";

export default function Escorts() {

    const {usuarios, loading} = useFetchUsuarios("http://localhost:3000/usuarios")

    if (loading) {
        return <p>Cargando...</p>
    }

    return(
        <main>
            <section className="grid grid-cols-3 gap-1">
                {usuarios.map(usuario => (
                    <Link to={`/detalle/${usuario.id}`} key={usuario.id}>
                        <img src={usuario.imagenes} alt={usuario.nombre} className="h-48 object-cover rounded-sm"/>
                    </Link>
                ))}
            </section>
        </main>
    )
}   