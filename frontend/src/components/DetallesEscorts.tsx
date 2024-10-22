import { useParams } from "react-router-dom"
import { useFetchUsuarios } from "../hooks/useFetchEscorts";

export default function DetallesEscorts() {
    const { id } = useParams() 
    const {usuarios, loading} = useFetchUsuarios("http://localhost:3000/usuarios")
    
    if (loading) {
        return <div>Cargando...</div>
    }

    const usuario = usuarios.find(usuario => usuario.id.toString() === id)

    if (!usuario) {
        return <div>Usuario no encontrado</div>;
    }
    console.log(usuario);
    
    return(
        <>
        
        <main>
        <img src={usuario.imagenes} alt="" />
        <h1>{usuario.nombre}</h1>
        <p>{usuario.edad}</p>
        </main>
        </>
    )
}