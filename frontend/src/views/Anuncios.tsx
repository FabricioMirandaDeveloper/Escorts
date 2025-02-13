import { useState, useEffect } from "react";
import { db } from "../../firebase";
import { collection, getDocs } from "firebase/firestore";

// Interfaz para tipar el anuncio (ajústala según tus necesidades)
interface Anuncio {
    id: string;
    nombre: string;
    edad: number;
    numero: number;
    descripcion: string;
    email: string;
    imagenes: string[];
    actualizado: any;
}

const Anuncios = () => {
    const [anuncios, setAnuncios] = useState<Anuncio[]>([]);
    const [cargando, setCargando] = useState<boolean>(true);

    useEffect(() => {
        const obtenerAnuncios = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "usuarios"));
                const anunciosData: Anuncio[] = querySnapshot.docs.map((doc) => {
                    const data = doc.data();
                    return {
                        id: doc.id,
                        nombre: data.nombre,
                        edad: data.edad,
                        numero: data.numero,
                        descripcion: data.descripcion,
                        email: data.email,
                        imagenes: data.imagenes,
                        actualizado: data.actualizado,
                    };
                });
                setAnuncios(anunciosData);
            } catch (error) {
                console.error("Error al obtener anuncios:", error);
            } finally {
                setCargando(false);
            }
        };

        obtenerAnuncios();
    }, []);

    if (cargando) {
        return <p>Cargando anuncios...</p>;
    }

    return (
        <div className="grid grid-cols-2 gap-2 p-2">
            {anuncios.map((anuncio) => (
                <div key={anuncio.id} className="bg-white text-black shadow p-4 rounded">
                    {/* Mostrar solo la primera imagen si existe */}
                    {anuncio.imagenes && anuncio.imagenes.length > 0 && (
                        <img
                            src={anuncio.imagenes[0]}
                            alt={`${anuncio.nombre} - imagen`}
                            className="w-full h-48 object-cover rounded mb-4"
                        />
                    )}
                    <h2 className="text-2xl font-bold mb-2">{anuncio.nombre}</h2>
                    <p className="mb-2">{anuncio.descripcion}</p>
                    <p className="mb-2">
                        <strong>Edad:</strong> {anuncio.edad}
                    </p>
                    <p>
                        <strong>Celular:</strong> {anuncio.numero}
                    </p>
                </div>
            ))}
        </div>
    );
};

export default Anuncios;
